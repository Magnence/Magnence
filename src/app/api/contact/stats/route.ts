import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const [total, byStatus, byService, recent, last30Days] = await Promise.all([
      db.websiteLead.count(),
      db.websiteLead.groupBy({
        by: ["status"],
        _count: { status: true },
      }),
      db.websiteLead.groupBy({
        by: ["service"],
        _count: { service: true },
      }),
      db.websiteLead.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          fullName: true,
          email: true,
          company: true,
          service: true,
          budget: true,
          createdAt: true,
          status: true,
        },
      }),
      db.websiteLead.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      }),
    ]);

    return NextResponse.json({
      ok: true,
      total,
      last30Days,
      byStatus: byStatus.reduce((acc, s) => {
        acc[s.status] = s._count.status;
        return acc;
      }, {} as Record<string, number>),
      byService: byService.reduce((acc, s) => {
        acc[s.service] = s._count.service;
        return acc;
      }, {} as Record<string, number>),
      recent,
    });
  } catch (err) {
    console.error("[/api/contact/stats] Error:", err);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
