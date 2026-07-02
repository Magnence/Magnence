import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
export const runtime = "nodejs";
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  const category = searchParams.get("category");
  const where: Record<string, unknown> = {};
  if (category) where.category = category;
  if (q) { where.OR = [{ title: { contains: q } }, { content: { contains: q } }]; }
  const knowledge = await db.aIKnowledge.findMany({ where, orderBy: { updatedAt: "desc" }, take: 50 });
  return NextResponse.json({ knowledge });
}
export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { title, content, category, department, tags, source } = body;
  if (!title?.trim()) return NextResponse.json({ error: "Title required" }, { status: 400 });
  const item = await db.aIKnowledge.create({ data: { title, content, category: category || "faq", department, tags, source } });
  return NextResponse.json({ item });
}
export async function PATCH(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { id, action } = body;
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  if (action === "delete") { await db.aIKnowledge.delete({ where: { id } }); return NextResponse.json({ ok: true }); }
  if (action === "view") { await db.aIKnowledge.update({ where: { id }, data: { views: { increment: 1 } } }); return NextResponse.json({ ok: true }); }
  if (action === "helpful") { await db.aIKnowledge.update({ where: { id }, data: { helpful: { increment: 1 } } }); return NextResponse.json({ ok: true }); }
  if (action === "not_helpful") { await db.aIKnowledge.update({ where: { id }, data: { notHelpful: { increment: 1 } } }); return NextResponse.json({ ok: true }); }
  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
