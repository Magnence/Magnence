import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const type = searchParams.get("type");
  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (type) where.type = type;
  const invoices = await db.invoice.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { company: { select: { id: true, name: true } }, _count: { select: { payments: true } } },
  });
  const totals = {
    total: invoices.reduce((s, i) => s + i.total, 0),
    paid: invoices.reduce((s, i) => s + i.paidAmount, 0),
    outstanding: invoices.reduce((s, i) => s + (i.total - i.paidAmount), 0),
    overdue: invoices.filter((i) => i.status === "overdue").reduce((s, i) => s + i.total, 0),
    count: invoices.length,
  };
  return NextResponse.json({ invoices, totals });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { number, companyId, type, issueDate, dueDate, subtotal, discount, tax, total, notes, items } = body;
  if (!number?.trim()) return NextResponse.json({ error: "Invoice number required" }, { status: 400 });
  const invoice = await db.invoice.create({
    data: { number, companyId: companyId || null, type: type || "sales", issueDate: issueDate ? new Date(issueDate) : new Date(), dueDate: dueDate ? new Date(dueDate) : null, subtotal: subtotal || 0, discount: discount || 0, tax: tax || 0, total: total || 0, notes, items: items ? JSON.stringify(items) : "[]" },
  });
  return NextResponse.json({ invoice });
}

export async function PATCH(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { id, status, paidAmount, action } = body;
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  if (action === "delete") {
    await db.invoice.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  }
  const update: Record<string, unknown> = {};
  if (status) update.status = status;
  if (paidAmount !== undefined) update.paidAmount = paidAmount;
  const invoice = await db.invoice.update({ where: { id }, data: update });
  return NextResponse.json({ invoice });
}
