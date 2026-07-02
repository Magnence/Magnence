import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ notifications: [], unread: 0 });
  const notifications = await db.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  const unread = notifications.filter((n) => !n.read).length;
  return NextResponse.json({ notifications, unread });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  // Create notification (for self or broadcast)
  const { userId, type, title, body: notifBody, link } = body;
  const notif = await db.notification.create({
    data: {
      userId: userId || user.id,
      type: type || "system",
      title,
      body: notifBody,
      link,
    },
  });
  return NextResponse.json({ notification: notif });
}

export async function PATCH(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { id, markAllRead, action } = body;
  if (markAllRead) {
    await db.notification.updateMany({ where: { userId: user.id, read: false }, data: { read: true } });
    return NextResponse.json({ ok: true });
  }
  if (action === "clear") {
    await db.notification.deleteMany({ where: { userId: user.id } });
    return NextResponse.json({ ok: true });
  }
  if (id) {
    const notif = await db.notification.update({ where: { id }, data: { read: true } });
    return NextResponse.json({ notification: notif });
  }
  return NextResponse.json({ error: "Invalid request" }, { status: 400 });
}
