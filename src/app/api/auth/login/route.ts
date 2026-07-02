import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { verifyPassword, createSession, serializeUser, SESSION_COOKIE, checkLoginLockout, recordFailedLogin, clearFailedLogins, getRemainingAttempts, logAudit } from "@/lib/auth";

const Body = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  remember: z.boolean().optional().default(false),
});

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = Body.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    const { email, password } = parsed.data;
    const normalizedEmail = email.toLowerCase();

    // Check account lockout
    if (checkLoginLockout(normalizedEmail)) {
      return NextResponse.json({ error: "Account temporarily locked due to too many failed attempts. Try again in 15 minutes." }, { status: 429 });
    }

    const user = await db.user.findUnique({ where: { email: normalizedEmail } });
    if (!user || !user.passwordHash) {
      recordFailedLogin(normalizedEmail);
      const remaining = getRemainingAttempts(normalizedEmail);
      await logAudit(null, "failed_login", "security", normalizedEmail);
      return NextResponse.json({ error: `Invalid email or password. ${remaining} attempts remaining.` }, { status: 401 });
    }
    if (user.status === "suspended" || user.status === "archived") {
      return NextResponse.json({ error: "Account suspended. Contact HR." }, { status: 403 });
    }
    if (!verifyPassword(password, user.passwordHash)) {
      recordFailedLogin(normalizedEmail);
      const remaining = getRemainingAttempts(normalizedEmail);
      await logAudit(user.id, "failed_login", "security", normalizedEmail);
      if (remaining === 0) {
        return NextResponse.json({ error: "Account locked due to too many failed attempts. Try again in 15 minutes." }, { status: 429 });
      }
      return NextResponse.json({ error: `Invalid email or password. ${remaining} attempts remaining.` }, { status: 401 });
    }

    // Success — clear failed attempts
    clearFailedLogins(normalizedEmail);
    const token = await createSession(user.id);
    await db.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    await logAudit(user.id, "login", "auth", "web");

    const res = NextResponse.json({ user: serializeUser(user) });
    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch (e) {
    console.error("[auth/login]", e);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
