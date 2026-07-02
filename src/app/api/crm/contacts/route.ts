import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const companyId = searchParams.get("companyId");
  const where: Record<string, unknown> = {};
  if (companyId) where.companyId = companyId;
  const contacts = await db.contact.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { company: { select: { id: true, name: true, isClient: true } } },
  });
  return NextResponse.json({ contacts });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { firstName, lastName, email, phone, mobile, title, department, companyId, linkedin, isPrimary, isDecisionMaker, tags, notes } = body;
  if (!firstName?.trim() || !companyId) return NextResponse.json({ error: "First name and company required" }, { status: 400 });
  const contact = await db.contact.create({
    data: { firstName, lastName, email, phone, mobile, title, department, companyId, linkedin, isPrimary: !!isPrimary, isDecisionMaker: !!isDecisionMaker, tags, notes },
  });
  return NextResponse.json({ contact });
}
