import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const Body = z.object({
  sessionId: z.string().min(1),
  event: z.enum(["page_view", "session_start", "session_end", "click"]),
  page: z.string().optional(),
  referrer: z.string().optional(),
  deviceType: z.string().optional(),
  browser: z.string().optional(),
  os: z.string().optional(),
  duration: z.number().optional(),
});

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = Body.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Invalid" }, { status: 400 });
    }

    const data = parsed.data;
    const ipAddress =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      null;
    const userAgent = req.headers.get("user-agent") ?? null;

    await db.websiteAnalytics.create({
      data: {
        sessionId: data.sessionId,
        event: data.event,
        page: data.page ?? null,
        referrer: data.referrer ?? null,
        userAgent,
        ipAddress,
        deviceType: data.deviceType ?? null,
        browser: data.browser ?? null,
        os: data.os ?? null,
        duration: data.duration ?? null,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[/api/site/analytics] Error:", err);
    return NextResponse.json({ ok: false, error: "Failed" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  // Admin-only: analytics summary
  try {
    const now = new Date();
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const today = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const [totalPageViews, pageViews30d, pageViews7d, pageViewsToday, uniqueSessions, byDevice, topPages] = await Promise.all([
      db.websiteAnalytics.count({ where: { event: "page_view" } }),
      db.websiteAnalytics.count({ where: { event: "page_view", createdAt: { gte: last30Days } } }),
      db.websiteAnalytics.count({ where: { event: "page_view", createdAt: { gte: last7Days } } }),
      db.websiteAnalytics.count({ where: { event: "page_view", createdAt: { gte: today } } }),
      db.websiteAnalytics.groupBy({
        by: ["sessionId"],
        where: { event: "page_view", createdAt: { gte: last7Days } },
      }),
      db.websiteAnalytics.groupBy({
        by: ["deviceType"],
        where: { event: "page_view", createdAt: { gte: last7Days } },
        _count: { deviceType: true },
      }),
      db.websiteAnalytics.groupBy({
        by: ["page"],
        where: { event: "page_view", createdAt: { gte: last7Days } },
        _count: { page: true },
        orderBy: { _count: { page: "desc" } },
        take: 10,
      }),
    ]);

    return NextResponse.json({
      ok: true,
      totalPageViews,
      pageViews30d,
      pageViews7d,
      pageViewsToday,
      uniqueSessions7d: uniqueSessions.length,
      byDevice: byDevice.reduce((acc, d) => {
        acc[d.deviceType ?? "unknown"] = d._count.deviceType;
        return acc;
      }, {} as Record<string, number>),
      topPages: topPages.map((p) => ({ page: p.page, views: p._count.page })),
    });
  } catch (err) {
    console.error("[/api/site/analytics GET] Error:", err);
    return NextResponse.json({ ok: false, error: "Failed" }, { status: 500 });
  }
}
