import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const expenses = await db.expense.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { id: true, name: true, avatarColor: true } } },
  });
  const totals = {
    total: expenses.reduce((s, e) => s + e.amount, 0),
    pending: expenses.filter((e) => e.status === "pending").reduce((s, e) => s + e.amount, 0),
    approved: expenses.filter((e) => e.status === "approved").reduce((s, e) => s + e.amount, 0),
    reimbursed: expenses.filter((e) => e.status === "reimbursed").reduce((s, e) => s + e.amount, 0),
    count: expenses.length,
  };
  return NextResponse.json({ expenses, totals });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { number, category, description, amount, currency, date, notes } = body;
  if (!description?.trim() || !amount) return NextResponse.json({ error: "Description and amount required" }, { status: 400 });
  const expense = await db.expense.create({
    data: { number: number || `EXP-${Date.now()}`, userId: user.id, category: category || "other", description, amount: Number(amount), currency: currency || "USD", date: date ? new Date(date) : new Date(), notes },
  });
  return NextResponse.json({ expense });
}

export async function PATCH(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { id, status, action } = body;
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  if (action === "delete") {
    await db.expense.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  }
  const update: Record<string, unknown> = { status };
  if (status === "approved") { update.approvedById = user.id; update.approvedAt = new Date(); }
  const expense = await db.expense.update({ where: { id }, data: update });
  return NextResponse.json({ expense });
}
