import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const user = await getSessionUser();
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const limit = parseInt(searchParams.get("limit") || "100");
  const where: Record<string, unknown> = {};
  if (category) where.category = category;
  // Non-admins see only their own activity
  if (user && !["CEO", "CHRO"].includes(user.role)) {
    where.userId = user.id;
  }
  const logs = await db.activityLog.findMany({
    where,
    take: limit,
    orderBy: { createdAt: "desc" },
    include: { user: { select: { id: true, name: true, avatarColor: true } } },
  });
  return NextResponse.json({ logs });
}
