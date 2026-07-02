import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { getSessionUser, requirePermission } from "@/lib/auth";

const createSchema = z.object({
  title: z.string().min(1, "Title required"),
  slug: z.string().min(1, "Slug required"),
  excerpt: z.string().min(1, "Excerpt required"),
  category: z.string().min(1, "Category required"),
  content: z.string(), // JSON string
  authorName: z.string().min(1, "Author name required"),
  authorRole: z.string().min(1, "Author role required"),
  authorGradient: z.string().default("linear-gradient(135deg, #fbc607, #f59e0b)"),
  imageUrl: z.string().optional().nullable(),
  imageGradient: z.string().default("linear-gradient(135deg, #fbc607, #f59e0b)"),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  featured: z.boolean().default(false),
  tags: z.string().optional().nullable(),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  publishedAt: z.string().optional().nullable(),
});

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const user = await getSessionUser();
  const auth = requirePermission(user, "cms-blog", "view");
  if (auth) return auth;

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || undefined;
    const category = searchParams.get("category") || undefined;

    const posts = await db.blogPost.findMany({
      where: {
        ...(status && status !== "all" ? { status } : {}),
        ...(category && category !== "all" ? { category } : {}),
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ ok: true, posts });
  } catch (err) {
    console.error("[/api/cms/blog GET]", err);
    return NextResponse.json({ ok: false, error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  const auth = requirePermission(user, "cms-blog", "view");
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

    // Check slug uniqueness
    const existing = await db.blogPost.findUnique({ where: { slug: data.slug } });
    if (existing) {
      return NextResponse.json({ ok: false, error: "Slug already exists" }, { status: 400 });
    }

    const post = await db.blogPost.create({
      data: {
        ...data,
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : data.status === "published" ? new Date() : null,
      },
    });

    // Notify content team
    try {
      const contentUsers = await db.user.findMany({
        where: { OR: [
          { role: { contains: "admin" } },
          { role: { contains: "marketing" } },
          { role: { contains: "content" } },
        ]},
        select: { id: true },
      });
      if (contentUsers.length > 0) {
        await db.notification.createMany({
          data: contentUsers.map((u) => ({
            userId: u.id,
            type: "system",
            title: `New blog post: ${data.title}`,
            body: `Status: ${data.status} · Category: ${data.category}`,
            read: false,
            createdAt: new Date(),
          })),
        });
      }
    } catch {}

    return NextResponse.json({ ok: true, id: post.id });
  } catch (err) {
    console.error("[/api/cms/blog POST]", err);
    return NextResponse.json({ ok: false, error: "Failed to create" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const user = await getSessionUser();
  const auth = requirePermission(user, "cms-blog", "view");
  if (auth) return auth;

  try {
    const body = await req.json();
    const { id, action, ...updates } = body;

    if (!id) return NextResponse.json({ ok: false, error: "ID required" }, { status: 400 });

    if (action === "delete") {
      await db.blogPost.delete({ where: { id } });
      return NextResponse.json({ ok: true });
    }

    if (action === "toggle-publish") {
      const post = await db.blogPost.findUnique({ where: { id } });
      if (!post) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
      const newStatus = post.status === "published" ? "draft" : "published";
      await db.blogPost.update({
        where: { id },
        data: {
          status: newStatus,
          publishedAt: newStatus === "published" && !post.publishedAt ? new Date() : post.publishedAt,
        },
      });
      return NextResponse.json({ ok: true, status: newStatus });
    }

    // General update
    const allowedFields = [
      "title", "slug", "excerpt", "category", "content", "authorName", "authorRole",
      "authorGradient", "imageUrl", "imageGradient", "status", "featured", "tags",
      "seoTitle", "seoDescription",
    ];
    const cleanUpdates: any = {};
    for (const key of allowedFields) {
      if (key in updates) cleanUpdates[key] = updates[key];
    }
    if (updates.publishedAt) cleanUpdates.publishedAt = new Date(updates.publishedAt);
    if (cleanUpdates.status === "published") {
      const post = await db.blogPost.findUnique({ where: { id } });
      if (post && !post.publishedAt) cleanUpdates.publishedAt = new Date();
    }

    // Check slug uniqueness if changing
    if (cleanUpdates.slug) {
      const existing = await db.blogPost.findFirst({
        where: { slug: cleanUpdates.slug, NOT: { id } },
      });
      if (existing) {
        return NextResponse.json({ ok: false, error: "Slug already exists" }, { status: 400 });
      }
    }

    await db.blogPost.update({ where: { id }, data: cleanUpdates });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[/api/cms/blog PATCH]", err);
    return NextResponse.json({ ok: false, error: "Failed to update" }, { status: 500 });
  }
}
