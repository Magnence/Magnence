import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser, hasPermission, logAudit } from "@/lib/auth";
import { PROVIDER_DEFAULTS } from "@/lib/ai-providers";
export const runtime = "nodejs";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const providers = await db.aIProvider.findMany({ orderBy: { name: "asc" } });
  
  // If no providers configured, return defaults
  if (providers.length === 0) {
    const defaults = Object.entries(PROVIDER_DEFAULTS).map(([name, config]) => ({
      id: name,
      name,
      displayName: config.displayName,
      apiKey: null,
      baseUrl: config.baseUrl || null,
      models: JSON.stringify(config.models),
      active: false,
      isDefault: false,
    }));
    return NextResponse.json({ providers: defaults, availableDefaults: PROVIDER_DEFAULTS });
  }
  
  return NextResponse.json({ providers, availableDefaults: PROVIDER_DEFAULTS });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!hasPermission(user, "advanced-settings", "configure")) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }
  
  const body = await req.json();
  const { name, displayName, apiKey, baseUrl, models, isDefault } = body;
  
  if (!name) return NextResponse.json({ error: "Provider name required" }, { status: 400 });
  
  // If setting as default, unset others
  if (isDefault) {
    await db.aIProvider.updateMany({ data: { isDefault: false } });
  }
  
  const provider = await db.aIProvider.upsert({
    where: { name },
    update: { displayName, apiKey, baseUrl, models: JSON.stringify(models), isDefault },
    create: {
      name,
      displayName: displayName || name,
      apiKey,
      baseUrl,
      models: JSON.stringify(models || PROVIDER_DEFAULTS[name]?.models || []),
      isDefault: !!isDefault,
      active: !!apiKey || name === "ollama",
    },
  });
  
  await logAudit(user.id, "configure_ai_provider", "config", name);
  return NextResponse.json({ provider });
}

export async function PATCH(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!hasPermission(user, "advanced-settings", "configure")) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }
  
  const body = await req.json();
  const { id, action, active, isDefault } = body;
  
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  
  if (action === "delete") {
    await db.aIProvider.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  }
  
  const update: Record<string, unknown> = {};
  if (active !== undefined) update.active = active;
  if (isDefault) {
    await db.aIProvider.updateMany({ data: { isDefault: false } });
    update.isDefault = true;
  }
  
  const provider = await db.aIProvider.update({ where: { id }, data: update });
  return NextResponse.json({ provider });
}
