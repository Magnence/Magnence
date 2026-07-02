import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { destroySession, SESSION_COOKIE, getSessionUser } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const user = await getSessionUser();
  if (token) {
    await destroySession(token);
  }
  if (user) {
    await db.auditLog.create({
      data: { userId: user.id, action: "logout", category: "auth", target: "web" },
    });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(SESSION_COOKIE);
  return res;
}
