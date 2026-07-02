import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser, hasPermission } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  if (q.trim().length < 1) {
    return NextResponse.json({ results: [], counts: {} });
  }
  const term = q.toLowerCase();

  const searchPromises: Promise<any[]>[] = [];

  // People — everyone can search
  searchPromises.push(
    db.user.findMany({
      where: { OR: [{ name: { contains: term } }, { email: { contains: term } }, { department: { contains: term } }, { title: { contains: term } }] },
      take: 8,
      select: { id: true, name: true, email: true, role: true, department: true, title: true, avatarColor: true },
    }).then((items) => items.map((u) => ({ type: "person", id: u.id, title: u.name, subtitle: u.title || u.department, meta: u.role, icon: "Users", color: u.avatarColor }))).catch(() => [])
  );

  // Projects — if projects view permission
  if (hasPermission(user, "projects", "view")) {
    searchPromises.push(
      db.project.findMany({
        where: { OR: [{ name: { contains: term } }, { description: { contains: term } }] },
        take: 8,
        select: { id: true, name: true, status: true },
      }).then((items) => items.map((p) => ({ type: "project", id: p.id, title: p.name, subtitle: p.status, meta: "", icon: "FolderKanban", color: "#2563eb" }))).catch(() => [])
    );
  } else {
    searchPromises.push(Promise.resolve([]));
  }

  // Tasks — user's own tasks or all if manager
  if (hasPermission(user, "tasks", "view")) {
    const taskWhere: Record<string, unknown> = { OR: [{ title: { contains: term } }, { description: { contains: term } }] };
    if (!["CEO", "CTO", "COO", "CHRO"].includes(user.role)) {
      taskWhere.assigneeId = user.id;
    }
    searchPromises.push(
      db.task.findMany({
        where: taskWhere,
        take: 8,
        select: { id: true, title: true, status: true, priority: true },
      }).then((items) => items.map((t) => ({ type: "task", id: t.id, title: t.title, subtitle: t.priority, meta: t.status, icon: "CheckSquare", color: "#16a34a" }))).catch(() => [])
    );
  } else {
    searchPromises.push(Promise.resolve([]));
  }

  // Documents — user's own or shared
  if (hasPermission(user, "documents", "view")) {
    searchPromises.push(
      db.document.findMany({
        where: { name: { contains: term }, OR: [{ ownerId: user.id }, { isShared: true }] },
        take: 8,
        select: { id: true, name: true, type: true, mimeType: true, updatedAt: true },
      }).then((items) => items.map((d) => ({ type: "document", id: d.id, title: d.name, subtitle: d.type, meta: d.mimeType || "", icon: "FileText", color: "#ea580c" }))).catch(() => [])
    );
  } else {
    searchPromises.push(Promise.resolve([]));
  }

  // Clients (Companies) — if CRM view permission
  if (hasPermission(user, "crm", "view") || hasPermission(user, "clients", "view")) {
    searchPromises.push(
      db.company.findMany({
        where: { OR: [{ name: { contains: term } }, { email: { contains: term } }, { industry: { contains: term } }] },
        take: 5,
        select: { id: true, name: true, industry: true, status: true },
      }).then((items) => items.map((c) => ({ type: "client", id: c.id, title: c.name, subtitle: c.industry || "", meta: c.status, icon: "HeartHandshake", color: "#7c3aed" }))).catch(() => [])
    );
  } else {
    searchPromises.push(Promise.resolve([]));
  }

  // Contracts — if contracts view permission
  if (hasPermission(user, "contracts", "view")) {
    searchPromises.push(
      db.contract.findMany({
        where: { OR: [{ title: { contains: term } }, { description: { contains: term } }] },
        take: 5,
        select: { id: true, title: true, status: true, value: true },
      }).then((items) => items.map((c) => ({ type: "contract", id: c.id, title: c.title, subtitle: c.status, meta: c.value ? `$${c.value.toLocaleString()}` : "", icon: "FileSignature", color: "#dc2626" }))).catch(() => [])
    );
  } else {
    searchPromises.push(Promise.resolve([]));
  }

  const allResults = await Promise.all(searchPromises);
  const results = allResults.flat();

  const counts: Record<string, number> = {};
  for (const r of results) counts[r.type] = (counts[r.type] || 0) + 1;

  return NextResponse.json({ results, counts });
}
