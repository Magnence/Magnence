import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
export const runtime = "nodejs";
export async function GET() {
  const feedback = await db.aIFeedback.findMany({ orderBy: { createdAt: "desc" }, take: 50 });
  const avgRating = feedback.length > 0 ? (feedback.reduce((s, f) => s + f.rating, 0) / feedback.length).toFixed(1) : "0";
  return NextResponse.json({ feedback, avgRating, total: feedback.length });
}
export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  const body = await req.json();
  const { agentType, message, response, rating, feedback: fb } = body;
  if (!message?.trim() || !rating) return NextResponse.json({ error: "Message and rating required" }, { status: 400 });
  const item = await db.aIFeedback.create({ data: { agentType: agentType || "company", message, response: response || "", rating: Number(rating), feedback: fb, userId: user?.id || null } });
  return NextResponse.json({ item });
}
