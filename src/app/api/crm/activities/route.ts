import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const companyId = searchParams.get("companyId");
  const where: Record<string, unknown> = {};
  if (companyId) where.companyId = companyId;
  const activities = await db.activity.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return NextResponse.json({ activities });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { type, title, description, dueDate, companyId, contactId, dealId } = body;
  if (!title?.trim()) return NextResponse.json({ error: "Title required" }, { status: 400 });
  const activity = await db.activity.create({
    data: { type: type || "note", title, description, dueDate: dueDate ? new Date(dueDate) : null, companyId: companyId || null, contactId: contactId || null, dealId: dealId || null, userId: user.id },
  });
  return NextResponse.json({ activity });
}
