import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { hashPassword, createSession, serializeUser, SESSION_COOKIE } from "@/lib/auth";

const Body = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.string().optional().default("EMPLOYEE"),
  department: z.string().optional().default("General"),
});

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = Body.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
    }
    const { name, email, password, role, department } = parsed.data;

    const existing = await db.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    // First user becomes CEO
    const userCount = await db.user.count();
    const finalRole = userCount === 0 ? "CEO" : role;

    const user = await db.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        passwordHash: hashPassword(password),
        role: finalRole,
        department,
        status: "active",
        emailVerified: false,
      },
    });

    // Create employee profile
    await db.employeeProfile.create({
      data: {
        userId: user.id,
        joinDate: new Date(),
        employmentStatus: "active",
      },
    });

    await db.auditLog.create({
      data: {
        userId: user.id,
        action: "register",
        category: "auth",
        target: email,
        ipAddress: req.headers.get("x-forwarded-for") || "unknown",
        userAgent: req.headers.get("user-agent") || "unknown",
      },
    });

    const token = await createSession(user.id);
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
    console.error("[auth/register]", e);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
