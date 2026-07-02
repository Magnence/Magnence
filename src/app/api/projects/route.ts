import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  const projects = await db.project.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { tasks: true, milestones: true } },
      tasks: {
        select: { id: true, status: true },
      },
    },
  });
  // Compute task stats
  const withStats = projects.map((p) => {
    const total = p.tasks.length;
    const completed = p.tasks.filter((t) => t.status === "completed").length;
    const { tasks, ...rest } = p;
    return { ...rest, taskStats: { total, completed, pending: total - completed } };
  });
  return NextResponse.json({ projects: withStats });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { name, description, category, department, status, budget, startDate, endDate, objectives, deliverables } = body;
  if (!name?.trim()) return NextResponse.json({ error: "Name required" }, { status: 400 });
  const project = await db.project.create({
    data: {
      name,
      description,
      category: category || "internal",
      department,
      status: status || "planning",
      budget: budget || 0,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      objectives,
      deliverables,
    },
  });
  return NextResponse.json({ project });
}
