import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const [total, active, unsubscribed, last30Days, bySource] = await Promise.all([
      db.newsletterSubscriber.count(),
      db.newsletterSubscriber.count({ where: { status: "active" } }),
      db.newsletterSubscriber.count({ where: { status: "unsubscribed" } }),
      db.newsletterSubscriber.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
          status: "active",
        },
      }),
      db.newsletterSubscriber.groupBy({
        by: ["source"],
        _count: { source: true },
        where: { status: "active" },
      }),
    ]);

    return NextResponse.json({
      ok: true,
      total,
      active,
      unsubscribed,
      last30Days,
      bySource: bySource.reduce((acc, s) => {
        acc[s.source] = s._count.source;
        return acc;
      }, {} as Record<string, number>),
    });
  } catch (err) {
    console.error("[/api/newsletter/stats] Error:", err);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
