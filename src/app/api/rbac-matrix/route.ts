import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { DEFAULT_PERMISSIONS, MODULES, ACTIONS, ROLE_TYPES, ROLE_LABELS, MODULE_LABELS } from "@/lib/constants";
export const runtime = "nodejs";
export async function GET() {
  const user = await getSessionUser();
  if (!user || !["CEO"].includes(user.role)) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }
  const matrix = ROLE_TYPES.map((role) => {
    const perms = DEFAULT_PERMISSIONS[role] || {};
    const moduleAccess = MODULES.map((mod) => ({
      module: mod,
      label: MODULE_LABELS[mod] || mod,
      actions: ACTIONS.filter((action) => (perms[mod] || []).includes(action)),
      hasView: (perms[mod] || []).includes("view"),
    }));
    return {
      role,
      label: ROLE_LABELS[role] || role,
      moduleCount: moduleAccess.filter((m) => m.hasView).length,
      totalActions: moduleAccess.reduce((s, m) => s + m.actions.length, 0),
      modules: moduleAccess,
    };
  });
  return NextResponse.json({ matrix, modules: MODULES, actions: ACTIONS, roles: ROLE_TYPES, roleLabels: ROLE_LABELS, moduleLabels: MODULE_LABELS });
}
