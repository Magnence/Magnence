import { db } from "./db";
import { cookies } from "next/headers";
import { DEFAULT_PERMISSIONS } from "./constants";
import crypto from "crypto";

export const SESSION_COOKIE = "magnence_session";
const SESSION_DURATION_DAYS = 7;
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;

// Simple synchronous password hashing (using node crypto scrypt)
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const verify = crypto.scryptSync(password, salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(verify, "hex"));
}

export async function createSession(userId: string): Promise<string> {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_DURATION_DAYS);
  await db.session.create({ data: { userId, token, expiresAt, lastActiveAt: new Date() } });
  return token;
}

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  avatarColor: string;
  role: string;
  department: string;
  title: string | null;
  phone: string | null;
  location: string | null;
  bio: string | null;
  status: string;
  emailVerified: boolean;
  mfaEnabled: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = await db.session.findUnique({ where: { token }, include: { user: true } });
  if (!session) return null;
  if (session.expiresAt < new Date()) {
    await db.session.delete({ where: { id: session.id } }).catch(() => {});
    return null;
  }
  // Check account status
  if (session.user.status === "suspended" || session.user.status === "archived") {
    await db.session.delete({ where: { id: session.id } }).catch(() => {});
    return null;
  }
  await db.session.update({ where: { id: session.id }, data: { lastActiveAt: new Date() } }).catch(() => {});
  return session.user as SessionUser;
}

export async function destroySession(token: string) {
  await db.session.deleteMany({ where: { token } }).catch(() => {});
}

export function getPermissionsForRole(role: string): Record<string, string[]> {
  return DEFAULT_PERMISSIONS[role] || DEFAULT_PERMISSIONS.EMPLOYEE;
}

export function serializeUser(user: SessionUser) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    department: user.department,
    title: user.title || "",
    avatarColor: user.avatarColor,
    status: (user.status as "active" | "away" | "offline") || "active",
    permissions: getPermissionsForRole(user.role),
  };
}

// === RBAC Server-Side Permission Checks ===

/**
 * Check if a user has a specific permission on a module.
 * Super Admin, Founder, Admin always have all permissions.
 */
export function hasPermission(user: SessionUser | null, module: string, action: string): boolean {
  if (!user) return false;
  if (["CEO"].includes(user.role)) return true;
  const perms = getPermissionsForRole(user.role);
  const modulePerms = perms[module] || [];
  return modulePerms.includes(action);
}

/**
 * Require a specific permission or return a 403 response.
 * Usage: const auth = requirePermission(user, "finance", "view"); if (auth) return auth;
 */
export function requirePermission(user: SessionUser | null, module: string, action: string): Response | null {
  if (!user) {
    return new Response(JSON.stringify({ error: "Authentication required" }), { status: 401, headers: { "Content-Type": "application/json" } });
  }
  if (!hasPermission(user, module, action)) {
    return new Response(JSON.stringify({ error: "Access denied", message: `You need ${action} permission on ${module}` }), { status: 403, headers: { "Content-Type": "application/json" } });
  }
  return null;
}

/**
 * Check if user can access another user's data (ownership check).
 * Users can access their own data. Managers/Leads can access their team. Admins can access all.
 */
export function canAccessUserData(requester: SessionUser, targetUserId: string): boolean {
  if (["CEO"].includes(requester.role)) return true;
  if (requester.id === targetUserId) return true;
  if (["CHRO"].includes(requester.role)) return true;
  // Team leads and project managers can access team members (simplified - in production would check team membership)
  if (["CTO", "CHRO"].includes(requester.role)) return true;
  return false;
}

/**
 * Get department-scoped filter for queries.
 * Non-admin users can only see data from their own department unless they have cross-dept permissions.
 */
export function getDepartmentFilter(user: SessionUser): Record<string, unknown> {
  if (["CEO"].includes(user.role)) return {};
  // Users see data from their department
  return { department: user.department };
}

/**
 * Get ownership filter for tasks/tickets.
 * Regular users only see items assigned to them. Managers/leads see team items.
 */
export function getOwnershipFilter(user: SessionUser, assigneeField = "assigneeId"): Record<string, unknown> {
  if (["CEO"].includes(user.role)) return {};
  if (["CTO", "CHRO", "CHRO"].includes(user.role)) return {};
  return { [assigneeField]: user.id };
}

/**
 * Mask sensitive fields based on role.
 * Salary fields visible only to HR and Finance. Cost fields hidden from interns.
 */
export function shouldShowField(user: SessionUser, fieldType: "salary" | "cost" | "budget" | "payroll" | "internal_notes"): boolean {
  if (["CEO"].includes(user.role)) return true;
  switch (fieldType) {
    case "salary":
    case "payroll":
      return ["CHRO", "CFO"].includes(user.role);
    case "cost":
    case "budget":
      return !["INTERN", "FREELANCER", "CLIENT"].includes(user.role);
    case "internal_notes":
      return !["INTERN", "FREELANCER", "CLIENT"].includes(user.role);
    default:
      return true;
  }
}

/**
 * Check if AI can answer based on the user's permissions.
 * Returns null if allowed, or a refusal message if denied.
 */
export function checkAIPermission(user: SessionUser, topic: string): string | null {
  const lowerTopic = topic.toLowerCase();
  // Payroll/salary topics
  if (lowerTopic.includes("payroll") || lowerTopic.includes("salary") || lowerTopic.includes("compensation")) {
    if (!shouldShowField(user, "salary")) {
      return "I don't have permission to access payroll or salary information for your role. Please contact HR or Finance if you need this information.";
    }
  }
  // Finance reports
  if (lowerTopic.includes("finance report") || lowerTopic.includes("expense report") || lowerTopic.includes("budget report") || lowerTopic.includes("profit") || lowerTopic.includes("revenue report")) {
    if (!hasPermission(user, "finance", "view")) {
      return "You don't have permission to access Finance reports. Please contact your administrator if you need access.";
    }
  }
  // HR records
  if (lowerTopic.includes("employee salary") || lowerTopic.includes("employee performance") || lowerTopic.includes("employee review")) {
    if (!hasPermission(user, "employees", "view")) {
      return "You don't have permission to access HR records. Please contact HR if you need this information.";
    }
  }
  // Audit logs
  if (lowerTopic.includes("audit log") || lowerTopic.includes("security log")) {
    if (!hasPermission(user, "audit", "view")) {
      return "You don't have permission to access audit logs. Only administrators can view security logs.";
    }
  }
  return null;
}

/**
 * Track failed login attempts for account lockout.
 */
const loginAttempts = new Map<string, { count: number; lockedUntil: number }>();

export function checkLoginLockout(email: string): boolean {
  const record = loginAttempts.get(email.toLowerCase());
  if (!record) return false;
  if (record.lockedUntil > Date.now()) return true;
  if (record.lockedUntil <= Date.now() && record.count >= MAX_LOGIN_ATTEMPTS) {
    loginAttempts.delete(email.toLowerCase());
    return false;
  }
  return false;
}

export function recordFailedLogin(email: string) {
  const key = email.toLowerCase();
  const record = loginAttempts.get(key) || { count: 0, lockedUntil: 0 };
  record.count += 1;
  if (record.count >= MAX_LOGIN_ATTEMPTS) {
    record.lockedUntil = Date.now() + LOCKOUT_MINUTES * 60 * 1000;
  }
  loginAttempts.set(key, record);
}

export function clearFailedLogins(email: string) {
  loginAttempts.delete(email.toLowerCase());
}

export function getRemainingAttempts(email: string): number {
  const record = loginAttempts.get(email.toLowerCase());
  if (!record) return MAX_LOGIN_ATTEMPTS;
  return Math.max(0, MAX_LOGIN_ATTEMPTS - record.count);
}

/**
 * Log an audit event.
 */
export async function logAudit(userId: string | null, action: string, category: string, target?: string, meta?: string) {
  try {
    await db.auditLog.create({
      data: { userId: userId || "system", action, category, target, meta },
    });
  } catch (e) {
    console.error("[audit] Failed to log:", e);
  }
}
