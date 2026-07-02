import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  const payments = await db.payment.findMany({ orderBy: { createdAt: "desc" }, take: 100, include: { invoice: { select: { id: true, number: true, company: { select: { name: true } } } } } });
  const totals = {
    incoming: payments.filter((p) => p.type === "incoming").reduce((s, p) => s + p.amount, 0),
    outgoing: payments.filter((p) => p.type === "outgoing").reduce((s, p) => s + p.amount, 0),
    count: payments.length,
  };
  return NextResponse.json({ payments, totals });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { invoiceId, type, amount, method, reference, notes } = body;
  if (!amount) return NextResponse.json({ error: "Amount required" }, { status: 400 });
  const payment = await db.payment.create({
    data: { invoiceId: invoiceId || null, type: type || "incoming", amount: Number(amount), method: method || "bank", reference, notes },
  });
  // Update invoice paidAmount if linked
  if (invoiceId) {
    const inv = await db.invoice.findUnique({ where: { id: invoiceId } });
    if (inv) {
      const newPaid = inv.paidAmount + Number(amount);
      await db.invoice.update({ where: { id: invoiceId }, data: { paidAmount: newPaid, status: newPaid >= inv.total ? "paid" : "partial" } });
    }
  }
  return NextResponse.json({ payment });
}
