import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import crypto from "crypto";

const RequestBody = z.object({
  email: z.string().email(),
});

const ResetBody = z.object({
  token: z.string(),
  password: z.string().min(6),
});

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // If token + password provided, reset
    const resetParsed = ResetBody.safeParse(body);
    if (resetParsed.success) {
      const { token, password } = resetParsed.data;
      const reset = await db.passwordReset.findUnique({ where: { token } });
      if (!reset || reset.used || reset.expiresAt < new Date()) {
        return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
      }
      const user = await db.user.findUnique({ where: { email: reset.email } });
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      const { hashPassword } = await import("@/lib/auth");
      await db.user.update({
        where: { id: user.id },
        data: { passwordHash: hashPassword(password) },
      });
      await db.passwordReset.update({ where: { id: reset.id }, data: { used: true } });
      await db.auditLog.create({
        data: { userId: user.id, action: "password_reset", category: "security" },
      });
      return NextResponse.json({ ok: true });
    }
    // Otherwise send reset email (just create token + return it for demo)
    const reqParsed = RequestBody.safeParse(body);
    if (!reqParsed.success) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    const { email } = reqParsed.data;
    const user = await db.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) {
      // don't reveal that email doesn't exist
      return NextResponse.json({ ok: true });
    }
    const token = crypto.randomBytes(32).toString("hex");
    await db.passwordReset.create({
      data: {
        email: email.toLowerCase(),
        token,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      },
    });
    // In production: send email with reset link. For demo, return token.
    return NextResponse.json({ ok: true, token, message: "Reset link generated (in production would be emailed)" });
  } catch (e) {
    console.error("[auth/reset-password]", e);
    return NextResponse.json({ error: "Reset failed" }, { status: 500 });
  }
}
