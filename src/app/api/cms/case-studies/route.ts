import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { getSessionUser, requirePermission } from "@/lib/auth";

const createSchema = z.object({
  name: z.string().min(1, "Name required"),
  slug: z.string().min(1, "Slug required"),
  category: z.string().min(1, "Category required"),
  industry: z.string().min(1, "Industry required"),
  tagline: z.string().min(1, "Tagline required"),
  resultMetric: z.string().min(1, "Result metric required"),
  description: z.string().min(1, "Description required"),
  challenge: z.string().min(1, "Challenge required"),
  approach: z.string().min(1, "Approach required"),
  solution: z.string().min(1, "Solution required"),
  results: z.string(), // JSON string
  imageUrl: z.string().optional().nullable(),
  imageGradient: z.string().default("linear-gradient(135deg, #fbc607, #f59e0b)"),
  technologies: z.string().default(""),
  services: z.string().default(""),
  timeline: z.string().default(""),
  client: z.string().default(""),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  featured: z.boolean().default(false),
  publishedAt: z.string().optional().nullable(),
});

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const user = await getSessionUser();
  const auth = requirePermission(user, "cms-case-studies", "view");
  if (auth) return auth;

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || undefined;
    const category = searchParams.get("category") || undefined;

    const studies = await db.caseStudy.findMany({
      where: {
        ...(status && status !== "all" ? { status } : {}),
        ...(category && category !== "all" ? { category } : {}),
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ ok: true, studies });
  } catch (err) {
    console.error("[/api/cms/case-studies GET]", err);
    return NextResponse.json({ ok: false, error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  const auth = requirePermission(user, "cms-case-studies", "view");
  if (auth) return auth;

  try {
    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid" },
        { status: 400 }
      );
    }
    const data = parsed.data;

    const existing = await db.caseStudy.findUnique({ where: { slug: data.slug } });
    if (existing) {
      return NextResponse.json({ ok: false, error: "Slug already exists" }, { status: 400 });
    }

    const study = await db.caseStudy.create({
      data: {
        ...data,
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : data.status === "published" ? new Date() : null,
      },
    });

    // Notify sales/marketing team
    try {
      const teamUsers = await db.user.findMany({
        where: { OR: [
          { role: { contains: "admin" } },
          { role: { contains: "sales" } },
          { role: { contains: "marketing" } },
        ]},
        select: { id: true },
      });
      if (teamUsers.length > 0) {
        await db.notification.createMany({
          data: teamUsers.map((u) => ({
            userId: u.id,
            type: "system",
            title: `New case study: ${data.name}`,
            body: `Status: ${data.status} · Industry: ${data.industry}`,
            read: false,
            createdAt: new Date(),
          })),
        });
      }
    } catch {}

    return NextResponse.json({ ok: true, id: study.id });
  } catch (err) {
    console.error("[/api/cms/case-studies POST]", err);
    return NextResponse.json({ ok: false, error: "Failed to create" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const user = await getSessionUser();
  const auth = requirePermission(user, "cms-case-studies", "view");
  if (auth) return auth;

  try {
    const body = await req.json();
    const { id, action, ...updates } = body;

    if (!id) return NextResponse.json({ ok: false, error: "ID required" }, { status: 400 });

    if (action === "delete") {
      await db.caseStudy.delete({ where: { id } });
      return NextResponse.json({ ok: true });
    }

    if (action === "toggle-publish") {
      const study = await db.caseStudy.findUnique({ where: { id } });
      if (!study) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
      const newStatus = study.status === "published" ? "draft" : "published";
      await db.caseStudy.update({
        where: { id },
        data: {
          status: newStatus,
          publishedAt: newStatus === "published" && !study.publishedAt ? new Date() : study.publishedAt,
        },
      });
      return NextResponse.json({ ok: true, status: newStatus });
    }

    const allowedFields = [
      "name", "slug", "category", "industry", "tagline", "resultMetric", "description",
      "challenge", "approach", "solution", "results", "imageUrl", "imageGradient",
      "technologies", "services", "timeline", "client", "status", "featured",
    ];
    const cleanUpdates: any = {};
    for (const key of allowedFields) {
      if (key in updates) cleanUpdates[key] = updates[key];
    }
    if (updates.publishedAt) cleanUpdates.publishedAt = new Date(updates.publishedAt);
    if (cleanUpdates.status === "published") {
      const study = await db.caseStudy.findUnique({ where: { id } });
      if (study && !study.publishedAt) cleanUpdates.publishedAt = new Date();
    }

    if (cleanUpdates.slug) {
      const existing = await db.caseStudy.findFirst({
        where: { slug: cleanUpdates.slug, NOT: { id } },
      });
      if (existing) {
        return NextResponse.json({ ok: false, error: "Slug already exists" }, { status: 400 });
      }
    }

    await db.caseStudy.update({ where: { id }, data: cleanUpdates });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[/api/cms/case-studies PATCH]", err);
    return NextResponse.json({ ok: false, error: "Failed to update" }, { status: 500 });
  }
}
