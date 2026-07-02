import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId") || user.id;
  const projectId = searchParams.get("projectId");
  const where: Record<string, unknown> = { userId };
  if (projectId) where.projectId = projectId;
  const entries = await db.timeEntry.findMany({
    where,
    orderBy: { startTime: "desc" },
    include: {
      task: { select: { id: true, title: true } },
      project: { select: { id: true, name: true } },
    },
    take: 100,
  });
  const totalMinutes = entries.reduce((s, e) => s + (e.duration || 0), 0);
  return NextResponse.json({ entries, totalMinutes });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { taskId, projectId, startTime, endTime, duration, billable, notes, action } = body;

  if (action === "stop" && body.id) {
    const existing = await db.timeEntry.findUnique({ where: { id: body.id } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const end = endTime ? new Date(endTime) : new Date();
    const dur = Math.round((end.getTime() - existing.startTime.getTime()) / 60000);
    const entry = await db.timeEntry.update({
      where: { id: body.id },
      data: { endTime: end, duration: dur },
    });
    // Update task actual time
    if (existing.taskId) {
      const task = await db.task.findUnique({ where: { id: existing.taskId } });
      if (task) {
        await db.task.update({ where: { id: task.id }, data: { actualTime: task.actualTime + dur } });
      }
    }
    return NextResponse.json({ entry });
  }

  // action === "start" creates a new running entry
  if (action === "start") {
    const entry = await db.timeEntry.create({
      data: {
        userId: user.id,
        taskId: taskId || null,
        projectId: projectId || null,
        startTime: new Date(),
        billable: billable !== false,
      },
    });
    return NextResponse.json({ entry });
  }

  // Manual entry
  if (!startTime) return NextResponse.json({ error: "startTime required" }, { status: 400 });
  const start = new Date(startTime);
  const end = endTime ? new Date(endTime) : null;
  const dur = duration || (end ? Math.round((end.getTime() - start.getTime()) / 60000) : 0);
  const entry = await db.timeEntry.create({
    data: {
      userId: user.id,
      taskId: taskId || null,
      projectId: projectId || null,
      startTime: start,
      endTime: end,
      duration: dur,
      billable: billable !== false,
      notes,
    },
  });
  return NextResponse.json({ entry });
}
