import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const stage = searchParams.get("stage");
  const companyId = searchParams.get("companyId");
  const where: Record<string, unknown> = {};
  if (stage) where.stage = stage;
  if (companyId) where.companyId = companyId;
  const deals = await db.deal.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      company: { select: { id: true, name: true } },
      contact: { select: { id: true, firstName: true, lastName: true } },
    },
  });
  return NextResponse.json({ deals });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { title, companyId, contactId, value, stage, probability, expectedCloseDate, source, competitor, notes } = body;
  if (!title?.trim() || !companyId) return NextResponse.json({ error: "Title and company required" }, { status: 400 });
  const deal = await db.deal.create({
    data: { title, companyId, contactId: contactId || null, ownerId: user.id, value: value || 0, stage: stage || "new", probability: probability || 10, expectedCloseDate: expectedCloseDate ? new Date(expectedCloseDate) : null, source, competitor, notes },
  });
  return NextResponse.json({ deal });
}

export async function PATCH(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { id, action, ...rest } = body;
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  if (action === "delete") {
    await db.deal.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  }
  if (rest.stage === "won" || rest.stage === "lost") {
    rest.actualCloseDate = new Date();
  }
  const deal = await db.deal.update({ where: { id }, data: rest });
  return NextResponse.json({ deal });
}
