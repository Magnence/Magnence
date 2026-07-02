import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ tasks: [] });
  const { searchParams } = new URL(req.url);
  const assigneeId = searchParams.get("assigneeId");
  const projectId = searchParams.get("projectId");
  const status = searchParams.get("status");
  const where: Record<string, unknown> = {};
  if (assigneeId) where.assigneeId = assigneeId;
  if (projectId) where.projectId = projectId;
  if (status) where.status = status;
  const tasks = await db.task.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      assignee: { select: { id: true, name: true, avatarColor: true } },
      reporter: { select: { id: true, name: true, avatarColor: true } },
      project: { select: { id: true, name: true } },
      _count: { select: { comments: true, subtasks: true, timeEntries: true } },
    },
  });
  return NextResponse.json({ tasks });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { title, description, priority, dueDate, startDate, estimatedTime, projectId, assigneeId, labels, tags, status, parentTaskId } = body;
  if (!title?.trim()) return NextResponse.json({ error: "Title required" }, { status: 400 });
  const task = await db.task.create({
    data: {
      title,
      description,
      priority: priority || "medium",
      status: status || "todo",
      dueDate: dueDate ? new Date(dueDate) : null,
      startDate: startDate ? new Date(startDate) : null,
      estimatedTime: estimatedTime || null,
      projectId: projectId || null,
      assigneeId: assigneeId || null,
      reporterId: user.id,
      labels,
      tags,
      parentTaskId: parentTaskId || null,
    },
  });
  return NextResponse.json({ task });
}
