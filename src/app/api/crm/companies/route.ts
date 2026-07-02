import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const isClient = searchParams.get("isClient");
  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (isClient === "true") where.isClient = true;
  if (isClient === "false") where.isClient = false;
  const companies = await db.company.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      owner: { select: { id: true, name: true, avatarColor: true } },
      _count: { select: { contacts: true, deals: true, invoices: true, contracts: true } },
    },
  });
  return NextResponse.json({ companies });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { name, industry, website, email, phone, address, city, country, size, source, isClient, ownerId, tags, notes } = body;
  if (!name?.trim()) return NextResponse.json({ error: "Name required" }, { status: 400 });
  const company = await db.company.create({
    data: { name, industry, website, email, phone, address, city, country, size, source, isClient: !!isClient, ownerId: ownerId || user.id, tags, notes, status: isClient ? "active_client" : "lead" },
  });
  return NextResponse.json({ company });
}

export async function PATCH(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { id, action, ...rest } = body;
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  if (action === "delete") {
    await db.company.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  }
  if (action === "convert_to_client") {
    const company = await db.company.update({ where: { id }, data: { isClient: true, status: "active_client" } });
    return NextResponse.json({ company });
  }
  const company = await db.company.update({ where: { id }, data: rest });
  return NextResponse.json({ company });
}
