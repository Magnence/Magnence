import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser, requirePermission } from "@/lib/auth";
export const runtime = "nodejs";
export async function GET() {
  const user = await getSessionUser();
  const auth = requirePermission(user, "ai-reporting", "view");
  if (auth) return auth;

  const [tasks, deals, meetings, tickets, timeEntries, campaigns, invoices, expenses] = await Promise.all([
    db.task.findMany({ select: { status: true, createdAt: true, priority: true, dueDate: true } }),
    db.deal.findMany({ select: { stage: true, value: true, title: true } }),
    db.meeting.findMany({ select: { status: true, startTime: true } }),
    db.ticket.findMany({ select: { status: true, priority: true, createdAt: true } }),
    db.timeEntry.findMany({ select: { duration: true, startTime: true } }),
    db.campaign.findMany({ select: { revenue: true, spent: true, name: true, status: true } }),
    db.invoice.findMany({ select: { total: true, paidAmount: true, status: true } }),
    db.expense.findMany({ select: { amount: true, status: true, category: true } }),
  ]);

  const tasksCompleted = tasks.filter(t => t.status === "completed").length;
  const tasksCreated = tasks.length;
  const meetingsHeld = meetings.filter(m => m.status === "completed").length;
  const ticketsResolved = tickets.filter(t => t.status === "resolved" || t.status === "closed").length;
  const hoursTracked = Math.round(timeEntries.reduce((s, e) => s + e.duration, 0) / 60);

  const wonRevenue = deals.filter(d => d.stage === "won").reduce((s, d) => s + d.value, 0);
  const pipelineValue = deals.filter(d => !["won", "lost"].includes(d.stage)).reduce((s, d) => s + d.value, 0);
  const openTickets = tickets.filter(t => t.status === "open" || t.status === "new").length;
  const pendingTasks = tasks.filter(t => t.status !== "completed" && t.status !== "cancelled").length;
  const overdueTasks = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "completed").length;
  const negotiationDeals = deals.filter(d => d.stage === "negotiation").length;
  const totalRevenue = invoices.reduce((s, i) => s + i.paidAmount, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const pendingExpenses = expenses.filter(e => e.status === "pending").length;
  const overdueInvoices = invoices.filter(i => i.status === "overdue").length;
  const campaignROI = campaigns.reduce((s, c) => s + c.spent, 0) > 0
    ? Math.round(((campaigns.reduce((s, c) => s + c.revenue, 0) - campaigns.reduce((s, c) => s + c.spent, 0)) / campaigns.reduce((s, c) => s + c.spent, 0)) * 100)
    : 0;

  // Build 7-day trend from real task creation dates
  const weeklyTrend = Array.from({ length: 7 }).map((_, i) => {
    const day = new Date(); day.setDate(day.getDate() - (6 - i));
    const dayStr = day.toLocaleDateString("en-US", { weekday: "short" });
    const dayStart = new Date(day); dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dayStart); dayEnd.setDate(dayEnd.getDate() + 1);
    const dayTasks = tasks.filter(t => { const d = new Date(t.createdAt); return d >= dayStart && d < dayEnd; }).length;
    const dayMeetings = meetings.filter(m => { const d = new Date(m.startTime); return d >= dayStart && d < dayEnd; }).length;
    return { day: dayStr, Tasks: dayTasks, Meetings: dayMeetings, Revenue: Math.round(wonRevenue / 7) };
  });

  // Generate real insights from DB data
  const insights: string[] = [];
  insights.push(`Task completion rate is ${tasksCreated > 0 ? Math.round(tasksCompleted / tasksCreated * 100) : 0}% (${tasksCompleted}/${tasksCreated})`);
  if (pipelineValue > 0) insights.push(`${deals.filter(d => !["won", "lost"].includes(d.stage)).length} active deals worth $${(pipelineValue / 1000).toFixed(0)}k in pipeline`);
  if (campaignROI !== 0) insights.push(`Campaign ROI: ${campaignROI}% across ${campaigns.length} campaigns`);
  if (totalRevenue > 0) insights.push(`Total revenue collected: $${totalRevenue.toLocaleString()}`);

  // Generate real risks from DB data
  const risks: string[] = [];
  if (openTickets > 0) risks.push(`${openTickets} support tickets need attention`);
  if (pendingTasks > 0) risks.push(`${pendingTasks} tasks still pending`);
  if (overdueTasks > 0) risks.push(`${overdueTasks} tasks are overdue`);
  if (negotiationDeals > 0) risks.push(`${negotiationDeals} deals in negotiation — monitor closely`);
  if (overdueInvoices > 0) risks.push(`${overdueInvoices} overdue invoices need follow-up`);
  if (pendingExpenses > 0) risks.push(`${pendingExpenses} expense approvals pending`);

  // Generate real recommendations
  const recommendations: string[] = [];
  if (overdueTasks > 0) recommendations.push(`Prioritize ${overdueTasks} overdue tasks today`);
  if (negotiationDeals > 0) recommendations.push(`Follow up on ${negotiationDeals} deals in negotiation stage`);
  if (openTickets > 0) recommendations.push(`Resolve ${openTickets} open support tickets`);
  if (overdueInvoices > 0) recommendations.push(`Follow up on ${overdueInvoices} overdue invoices`);
  if (pendingExpenses > 0) recommendations.push(`Review ${pendingExpenses} pending expense approvals`);
  if (recommendations.length === 0) recommendations.push("All clear — focus on pipeline growth and new campaigns");

  return NextResponse.json({
    dailySummary: { tasksCompleted, tasksCreated, meetingsHeld, ticketsResolved, hoursTracked },
    weeklyTrend,
    insights: insights.slice(0, 5),
    risks: risks.slice(0, 5),
    recommendations: recommendations.slice(0, 5),
  });
}
