import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const steps = await db.onboardingStep.findMany({ orderBy: { order: "asc" } });
  const completed = steps.filter((s) => s.completed).length;
  const total = steps.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  return NextResponse.json({ steps, completed, total, percentage });
}

export async function PATCH(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { id, action } = body;
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  if (action === "complete") {
    const step = await db.onboardingStep.update({ where: { id }, data: { completed: true } });
    return NextResponse.json({ step });
  }
  if (action === "uncomplete") {
    const step = await db.onboardingStep.update({ where: { id }, data: { completed: false } });
    return NextResponse.json({ step });
  }
  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
