import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export const runtime = "nodejs";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const update: Record<string, unknown> = {};
  const allowed = ["title", "description", "status", "priority", "dueDate", "startDate", "estimatedTime", "actualTime", "projectId", "assigneeId", "labels", "tags", "checklist", "parentTaskId"];
  for (const k of allowed) {
    if (body[k] !== undefined) {
      if ((k === "dueDate" || k === "startDate") && body[k]) update[k] = new Date(body[k]);
      else update[k] = body[k];
    }
  }
  if (body.status === "completed" && !update.completedAt) update.completedAt = new Date();
  const task = await db.task.update({ where: { id }, data: update });
  return NextResponse.json({ task });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await db.task.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
