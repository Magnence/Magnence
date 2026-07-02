import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser, requirePermission } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  const user = await getSessionUser();
  const auth = requirePermission(user, "dashboard", "view");
  if (auth) return auth;

  const [
    totalUsers,
    openTickets,
    inProgressTickets,
    resolvedTickets,
    activeCampaigns,
    totalLeads,
    wonDeals,
    totalPosts,
    socialAccounts,
    ticketsByCategory,
    recentTickets,
    leadsByStage,
    socialAccountsList,
    recentActivity,
  ] = await Promise.all([
    db.user.count(),
    db.ticket.count({ where: { status: "open" } }),
    db.ticket.count({ where: { status: "in_progress" } }),
    db.ticket.count({ where: { status: { in: ["resolved", "closed"] } } }),
    db.campaign.count({ where: { status: "active" } }),
    db.lead.count(),
    db.lead.count({ where: { stage: "won" } }),
    db.socialPost.count(),
    db.socialAccount.findMany(),
    db.ticket.groupBy({ by: ["category"], _count: true }),
    db.ticket.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: {
        openedBy: { select: { name: true, avatarColor: true, role: true } },
      },
    }),
    db.lead.groupBy({ by: ["stage"], _count: true, _sum: { value: true } }),
    db.socialAccount.findMany({ orderBy: { followers: "desc" } }),
    db.activityLog.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, avatarColor: true } } },
    }),
  ]);

  const totalFollowers = socialAccountsList.reduce(
    (s, a) => s + a.followers,
    0
  );
  const pipelineValue =
    leadsByStage
      .filter((l) => !["won", "lost"].includes(l.stage))
      .reduce((s, l) => s + (l._sum.value || 0), 0) || 0;
  const wonValue =
    leadsByStage.find((l) => l.stage === "won")?._sum.value || 0;

  return NextResponse.json({
    kpis: {
      totalUsers,
      openTickets,
      inProgressTickets,
      resolvedTickets,
      activeCampaigns,
      totalLeads,
      wonDeals,
      totalPosts,
      totalFollowers,
      pipelineValue,
      wonValue,
    },
    ticketsByCategory: ticketsByCategory.map((t) => ({
      category: t.category,
      count: t._count,
    })),
    leadsByStage: leadsByStage.map((l) => ({
      stage: l.stage,
      count: l._count,
      value: l._sum.value || 0,
    })),
    socialAccounts: socialAccountsList,
    recentTickets,
    recentActivity,
  });
}
