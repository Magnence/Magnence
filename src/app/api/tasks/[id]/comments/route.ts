import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser, serializeUser } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  if (!body.content?.trim()) return NextResponse.json({ error: "Content required" }, { status: 400 });
  const comment = await db.taskComment.create({
    data: { taskId: id, authorId: user.id, content: body.content },
  });
  return NextResponse.json({ comment });
}
