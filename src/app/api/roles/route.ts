import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { ROLE_TYPES, DEFAULT_PERMISSIONS, MODULES, ACTIONS } from "@/lib/constants";

export const runtime = "nodejs";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const roles = await db.role.findMany({ orderBy: { name: "asc" } });
  // Combine system roles + custom roles
  const systemRoles = ROLE_TYPES.map((r) => ({
    id: r,
    name: r,
    description: `Built-in ${r} role`,
    isSystem: true,
    permissions: DEFAULT_PERMISSIONS[r] || {},
  }));
  const customRoles = roles.map((r) => ({
    ...r,
    permissions: r.permissions ? JSON.parse(r.permissions) : {},
    isSystem: false,
  }));
  return NextResponse.json({
    roles: [...systemRoles, ...customRoles],
    modules: MODULES,
    actions: ACTIONS,
  });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user || !["CEO"].includes(user.role)) {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
  }
  const body = await req.json();
  const { name, description, permissions } = body;
  if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });
  const role = await db.role.create({
    data: {
      name,
      description,
      permissions: JSON.stringify(permissions || {}),
      isSystem: false,
    },
  });
  await db.auditLog.create({
    data: { userId: user.id, action: "create_role", category: "permission", target: name },
  });
  return NextResponse.json({ role });
}

export async function PATCH(req: NextRequest) {
  const user = await getSessionUser();
  if (!user || !["CEO"].includes(user.role)) {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
  }
  const body = await req.json();
  const { id, permissions, description } = body;
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const role = await db.role.update({
    where: { id },
    data: {
      permissions: permissions ? JSON.stringify(permissions) : undefined,
      description,
    },
  });
  await db.auditLog.create({
    data: { userId: user.id, action: "update_role", category: "permission", target: role.name },
  });
  return NextResponse.json({ role });
}
