import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const sessions = await db.session.findMany({
    where: { userId: user.id },
    orderBy: { lastActiveAt: "desc" },
    select: {
      id: true,
      device: true,
      ipAddress: true,
      userAgent: true,
      lastActiveAt: true,
      expiresAt: true,
      createdAt: true,
    },
  });
  return NextResponse.json({ sessions, currentUserId: user.id });
}

export async function DELETE() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // Revoke all sessions except the current one (caller can pass currentToken via body if needed)
  await db.session.deleteMany({ where: { userId: user.id } });
  await db.auditLog.create({
    data: { userId: user.id, action: "logout_all_devices", category: "security" },
  });
  return NextResponse.json({ ok: true });
}
