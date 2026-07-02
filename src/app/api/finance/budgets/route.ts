import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  const budgets = await db.budget.findMany({ orderBy: { fiscalYear: "desc" } });
  return NextResponse.json({ budgets });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { name, type, category, allocated, fiscalYear, startDate, endDate } = body;
  if (!name?.trim()) return NextResponse.json({ error: "Name required" }, { status: 400 });
  const budget = await db.budget.create({
    data: { name, type: type || "department", category, allocated: allocated || 0, fiscalYear: fiscalYear || new Date().getFullYear(), startDate: startDate ? new Date(startDate) : null, endDate: endDate ? new Date(endDate) : null },
  });
  return NextResponse.json({ budget });
}
