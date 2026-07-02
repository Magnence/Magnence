import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser, hashPassword, serializeUser, getPermissionsForRole } from "@/lib/auth";
import { ROLE_TYPES, DEFAULT_PERMISSIONS } from "@/lib/constants";

export const runtime = "nodejs";

const ADMIN_ONLY = ["CEO"];

export async function GET() {
  const user = await getSessionUser();
  if (!user || !ADMIN_ONLY.includes(user.role)) {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
  }
  const users = await db.user.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true, name: true, email: true, role: true, department: true, title: true,
      avatarColor: true, status: true, lastLoginAt: true, createdAt: true, emailVerified: true,
    },
  });
  return NextResponse.json({ users });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user || !ADMIN_ONLY.includes(user.role)) {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
  }
  const body = await req.json();
  const { name, email, password, role, department, title, avatarColor, action } = body;

  if (action === "reset_password") {
    // Reset password for a user
    const { userId, newPassword } = body;
    if (!userId || !newPassword) return NextResponse.json({ error: "userId and newPassword required" }, { status: 400 });
    const target = await db.user.findUnique({ where: { id: userId } });
    if (!target) return NextResponse.json({ error: "User not found" }, { status: 404 });
    await db.user.update({ where: { id: userId }, data: { passwordHash: hashPassword(newPassword) } });
    await db.auditLog.create({
      data: { userId: user.id, action: "reset_user_password", category: "security", target: target.email },
    });
    return NextResponse.json({ ok: true });
  }

  if (!name?.trim() || !email?.trim() || !password) {
    return NextResponse.json({ error: "Name, email, and password required" }, { status: 400 });
  }
  const existing = await db.user.findUnique({ where: { email: email.toLowerCase() } });
  if (existing) return NextResponse.json({ error: "Email already exists" }, { status: 409 });

  const newRole = ROLE_TYPES.includes(role) ? role : "EMPLOYEE";
  const newUser = await db.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      passwordHash: hashPassword(password),
      role: newRole,
      department: department || "General",
      title: title || null,
      avatarColor: avatarColor || "#f1c24e",
      status: "active",
    },
  });
  // Create employee profile
  await db.employeeProfile.create({
    data: { userId: newUser.id, joinDate: new Date(), employmentStatus: "active" },
  });
  await db.auditLog.create({
    data: { userId: user.id, action: "create_account", category: "admin", target: email },
  });
  return NextResponse.json({ user: serializeUser(newUser) });
}

export async function PATCH(req: NextRequest) {
  const user = await getSessionUser();
  if (!user || !ADMIN_ONLY.includes(user.role)) {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
  }
  const body = await req.json();
  const { id, name, email, role, department, title, status, avatarColor, action } = body;
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  if (action === "delete") {
    // Prevent self-deletion
    if (id === user.id) return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 });
    await db.user.delete({ where: { id } });
    await db.auditLog.create({
      data: { userId: user.id, action: "delete_account", category: "admin", target: id },
    });
    return NextResponse.json({ ok: true });
  }

  const update: Record<string, unknown> = {};
  if (name !== undefined) update.name = name;
  if (email !== undefined) update.email = email.toLowerCase();
  if (role !== undefined && ROLE_TYPES.includes(role)) update.role = role;
  if (department !== undefined) update.department = department;
  if (title !== undefined) update.title = title;
  if (status !== undefined) update.status = status;
  if (avatarColor !== undefined) update.avatarColor = avatarColor;

  const updated = await db.user.update({ where: { id }, data: update });
  await db.auditLog.create({
    data: { userId: user.id, action: "update_account", category: "admin", target: updated.email },
  });
  return NextResponse.json({ user: serializeUser(updated) });
}
