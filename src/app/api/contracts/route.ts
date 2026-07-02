import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  const contracts = await db.contract.findMany({
    orderBy: { createdAt: "desc" },
    include: { company: { select: { id: true, name: true } } },
  });
  // Expiring soon (within 30 days)
  const now = new Date();
  const in30Days = new Date(now.getTime() + 30 * 86400000);
  const expiringSoon = contracts.filter((c) => c.endDate && new Date(c.endDate) <= in30Days && new Date(c.endDate) >= now && c.status === "active").length;
  const stats = {
    total: contracts.length,
    active: contracts.filter((c) => c.status === "active").length,
    expiringSoon,
    totalValue: contracts.filter((c) => c.status === "active").reduce((s, c) => s + c.value, 0),
  };
  return NextResponse.json({ contracts, stats });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { number, title, companyId, type, value, startDate, endDate, signedDate, autoRenew, terms, fileUrl } = body;
  if (!title?.trim() || !companyId) return NextResponse.json({ error: "Title and company required" }, { status: 400 });
  const contract = await db.contract.create({
    data: { number: number || `CTR-${Date.now()}`, title, companyId, type: type || "service", status: "draft", value: value || 0, startDate: startDate ? new Date(startDate) : null, endDate: endDate ? new Date(endDate) : null, signedDate: signedDate ? new Date(signedDate) : null, autoRenew: !!autoRenew, terms, fileUrl },
  });
  return NextResponse.json({ contract });
}

export async function PATCH(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { id, status, action, ...rest } = body;
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  if (action === "delete") { await db.contract.delete({ where: { id } }); return NextResponse.json({ ok: true }); }
  const contract = await db.contract.update({ where: { id }, data: { status, ...rest } });
  return NextResponse.json({ contract });
}
