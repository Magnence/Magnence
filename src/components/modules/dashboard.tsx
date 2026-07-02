"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  LifeBuoy,
  Megaphone,
  TrendingUp,
  Share2,
  Ticket as TicketIcon,
  Activity,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  Clock,
  AlertTriangle,
  CheckSquare,
  Palmtree,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useAppStore } from "@/lib/store";
import { ROLE_LABELS } from "@/lib/constants";

interface DashboardData {
  kpis: {
    totalUsers: number;
    openTickets: number;
    inProgressTickets: number;
    resolvedTickets: number;
    activeCampaigns: number;
    totalLeads: number;
    wonDeals: number;
    totalPosts: number;
    totalFollowers: number;
    pipelineValue: number;
    wonValue: number;
  };
  ticketsByCategory: { category: string; count: number }[];
  leadsByStage: { stage: string; count: number; value: number }[];
  socialAccounts: {
    id: string;
    platform: string;
    handle: string;
    followers: number;
    engagement: number;
  }[];
  recentTickets: {
    id: string;
    title: string;
    status: string;
    priority: string;
    createdAt: string;
    openedBy: { name: string; avatarColor: string; role: string };
  }[];
  recentActivity: {
    id: string;
    action: string;
    target: string | null;
    createdAt: string;
    user: { name: string; avatarColor: string };
  }[];
}

const CATEGORY_COLORS: Record<string, string> = {
  bug: "#dc2626",
  account: "#0891b2",
  billing: "#7c3aed",
  feature: "#16a34a",
  hr: "#ea580c",
  it: "#c026d3",
  other: "#52525b",
};

export function DashboardModule() {
  const { user, setActiveModule, hasPermission } = useAppStore();
  const [data, setData] = React.useState<DashboardData | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/dashboard");
        if (!res.ok) return;
        const d = await res.json();
        if (!cancelled && d && d.kpis) setData(d);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading || !data || !data.kpis) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 rounded-xl bg-zinc-100 animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-72 rounded-xl bg-zinc-100 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const kpis = data.kpis;

  const initials = (n: string) =>
    n.split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase();

  const trend = Array.from({ length: 7 }).map((_, i) => {
    const day = new Date();
    day.setDate(day.getDate() - (6 - i));
    return {
      day: day.toLocaleDateString("en-US", { weekday: "short" }),
      tickets: Math.max(1, Math.round((kpis.openTickets / 7) * (i + 1) + (i % 3))),
      posts: Math.max(1, Math.round((kpis.totalPosts / 7) * (i + 1))),
    };
  });

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="magnence-soft-bg border border-[#f1c24e]/30 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-[#8a6d1f] mb-1">
            {ROLE_LABELS[user?.role || "EMPLOYEE"]} · {user?.department}
          </div>
          <h2 className="text-2xl font-bold text-black">
            Welcome back, {user?.name?.split(" ")[0]} 👋
          </h2>
          <p className="text-sm text-zinc-600 mt-1">
            Here's what's happening across Magnence today. Everything in one place — no more app-hopping.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {/* Dynamic quick actions based on role */}
          {hasPermission("support", "create") && (
            <Button onClick={() => setActiveModule("support")} className="bg-[#f1c24e] text-black hover:bg-[#e9b73a] font-semibold">
              <LifeBuoy className="h-4 w-4 mr-1.5" />New Ticket
            </Button>
          )}
          {hasPermission("tasks", "create") && (
            <Button onClick={() => setActiveModule("tasks")} variant="outline" className="border-[#f1c24e] text-black hover:bg-[#fef8e7]">
              <CheckSquare className="h-4 w-4 mr-1.5" />New Task
            </Button>
          )}
          {hasPermission("crm", "create") && (
            <Button onClick={() => setActiveModule("crm")} variant="outline" className="border-[#f1c24e] text-black hover:bg-[#fef8e7]">
              <Users className="h-4 w-4 mr-1.5" />Add Lead
            </Button>
          )}
          {hasPermission("leave", "create") && (
            <Button onClick={() => setActiveModule("leave")} variant="outline" className="border-[#f1c24e] text-black hover:bg-[#fef8e7]">
              <Palmtree className="h-4 w-4 mr-1.5" />Apply Leave
            </Button>
          )}
          <Button
            onClick={() => setActiveModule("assistant")}
            variant="outline"
            className="border-[#f1c24e] text-black hover:bg-[#fef8e7]"
          >
            <Sparkles className="h-4 w-4 mr-1.5 text-[#c79a2e]" />
            Ask AI
          </Button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          icon={Users}
          label="Team Members"
          value={kpis.totalUsers}
          accent="#0891b2"
          hint="Across all departments"
          onClick={() => setActiveModule("people")}
        />
        <KpiCard
          icon={LifeBuoy}
          label="Open Tickets"
          value={kpis.openTickets + kpis.inProgressTickets}
          accent="#dc2626"
          hint={`${kpis.resolvedTickets} resolved`}
          onClick={() => setActiveModule("support")}
        />
        <KpiCard
          icon={Megaphone}
          label="Active Campaigns"
          value={kpis.activeCampaigns}
          accent="#7c3aed"
          hint="Marketing in flight"
          onClick={() => setActiveModule("marketing")}
        />
        <KpiCard
          icon={TrendingUp}
          label="Pipeline Value"
          value={`$${(kpis.pipelineValue / 1000).toFixed(0)}k`}
          accent="#16a34a"
          hint={`${kpis.wonDeals} deals won · $${(kpis.wonValue / 1000).toFixed(0)}k`}
          onClick={() => setActiveModule("sales")}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 border-zinc-200">
          <CardHeader>
            <CardTitle className="text-base">Weekly Activity</CardTitle>
            <CardDescription>Tickets opened & social posts published</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trend}>
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f1c24e" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="#f1c24e" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0891b2" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="#0891b2" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #eee", fontSize: 12 }} />
                  <Area type="monotone" dataKey="tickets" stroke="#c79a2e" fill="url(#g1)" strokeWidth={2} name="Tickets" />
                  <Area type="monotone" dataKey="posts" stroke="#0891b2" fill="url(#g2)" strokeWidth={2} name="Social Posts" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-200">
          <CardHeader>
            <CardTitle className="text-base">Tickets by Category</CardTitle>
            <CardDescription>Where support load is concentrated</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.ticketsByCategory}
                    dataKey="count"
                    nameKey="category"
                    innerRadius={45}
                    outerRadius={80}
                    paddingAngle={2}
                  >
                    {data.ticketsByCategory.map((entry) => (
                      <Cell key={entry.category} fill={CATEGORY_COLORS[entry.category] || "#52525b"} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #eee", fontSize: 12 }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 border-zinc-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Recent Activity</CardTitle>
              <CardDescription>Across the company</CardDescription>
            </div>
            <Activity className="h-4 w-4 text-[#c79a2e]" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-72 overflow-y-auto thin-scroll pr-2">
              {data.recentActivity.map((a) => (
                <div key={a.id} className="flex items-center gap-3 text-sm">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback style={{ background: a.user.avatarColor, color: "#fff" }} className="text-xs">
                      {initials(a.user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <span className="font-medium">{a.user.name}</span>{" "}
                    <span className="text-zinc-600">{a.action}</span>{" "}
                    {a.target && <span className="text-zinc-900 font-medium">{a.target}</span>}
                  </div>
                  <span className="text-xs text-zinc-400 shrink-0">{timeAgo(a.createdAt)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Social Reach</CardTitle>
              <CardDescription>{kpis.totalFollowers.toLocaleString()} total followers</CardDescription>
            </div>
            <Share2 className="h-4 w-4 text-[#c79a2e]" />
          </CardHeader>
          <CardContent className="space-y-3">
            {data.socialAccounts.slice(0, 5).map((acc) => (
              <div key={acc.id} className="flex items-center justify-between text-sm">
                <span className="capitalize font-medium">{acc.platform}</span>
                <div className="flex items-center gap-3">
                  <span className="text-zinc-600">{acc.followers.toLocaleString()}</span>
                  <Badge variant="secondary" className="bg-[#fef8e7] text-[#8a6d1f] text-xs">
                    {acc.engagement.toFixed(1)}%
                  </Badge>
                </div>
              </div>
            ))}
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-[#c79a2e] hover:bg-[#fef8e7]"
              onClick={() => setActiveModule("social")}
            >
              Manage social <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent tickets */}
      <Card className="border-zinc-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Recent Tickets</CardTitle>
            <CardDescription>Latest support requests</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-[#c79a2e] hover:bg-[#fef8e7]"
            onClick={() => setActiveModule("support")}
          >
            View all <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-zinc-500 border-b border-zinc-100">
                  <th className="py-2 font-medium">Ticket</th>
                  <th className="py-2 font-medium">Opened by</th>
                  <th className="py-2 font-medium">Priority</th>
                  <th className="py-2 font-medium">Status</th>
                  <th className="py-2 font-medium">Opened</th>
                </tr>
              </thead>
              <tbody>
                {data.recentTickets.map((t) => (
                  <tr
                    key={t.id}
                    className="border-b border-zinc-50 hover:bg-zinc-50 cursor-pointer"
                    onClick={() => setActiveModule("support")}
                  >
                    <td className="py-3 pr-4 font-medium max-w-xs truncate">{t.title}</td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback
                            style={{ background: t.openedBy.avatarColor, color: "#fff" }}
                            className="text-[10px]"
                          >
                            {initials(t.openedBy.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-zinc-700">{t.openedBy.name}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <PriorityBadge priority={t.priority} />
                    </td>
                    <td className="py-3 pr-4">
                      <StatusBadge status={t.status} />
                    </td>
                    <td className="py-3 text-zinc-500 text-xs">{timeAgo(t.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function KpiCard({
  icon: Icon,
  label,
  value,
  hint,
  accent,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  hint?: string;
  accent: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="text-left bg-white border border-zinc-200 rounded-xl p-4 hover:border-[#f1c24e] hover:shadow-md transition-all group"
    >
      <div className="flex items-center justify-between mb-3">
        <div
          className="h-10 w-10 rounded-lg flex items-center justify-center"
          style={{ background: `${accent}15`, color: accent }}
        >
          <Icon className="h-5 w-5" />
        </div>
        <ArrowUpRight className="h-4 w-4 text-zinc-300 group-hover:text-[#c79a2e] transition" />
      </div>
      <div className="text-2xl font-bold text-black">{value}</div>
      <div className="text-xs text-zinc-500 mt-0.5">{label}</div>
      {hint && <div className="text-[11px] text-zinc-400 mt-1">{hint}</div>}
    </button>
  );
}

export function PriorityBadge({ priority }: { priority: string }) {
  const map: Record<string, { label: string; className: string; icon?: React.ElementType }> = {
    low: { label: "Low", className: "bg-zinc-100 text-zinc-700" },
    medium: { label: "Medium", className: "bg-blue-100 text-blue-700" },
    high: { label: "High", className: "bg-orange-100 text-orange-700", icon: AlertTriangle },
    urgent: { label: "Urgent", className: "bg-red-100 text-red-700", icon: AlertTriangle },
  };
  const m = map[priority] || map.medium;
  const Icon = m.icon;
  return (
    <Badge variant="secondary" className={`${m.className} text-xs gap-1`}>
      {Icon && <Icon className="h-3 w-3" />}
      {m.label}
    </Badge>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string; icon?: React.ElementType }> = {
    open: { label: "Open", className: "bg-zinc-100 text-zinc-700", icon: TicketIcon },
    in_progress: { label: "In Progress", className: "bg-[#fef8e7] text-[#8a6d1f]", icon: Clock },
    waiting: { label: "Waiting", className: "bg-amber-100 text-amber-700", icon: Clock },
    resolved: { label: "Resolved", className: "bg-green-100 text-green-700", icon: CheckCircle2 },
    closed: { label: "Closed", className: "bg-zinc-200 text-zinc-700", icon: CheckCircle2 },
  };
  const m = map[status] || map.open;
  const Icon = m.icon;
  return (
    <Badge variant="secondary" className={`${m.className} text-xs gap-1`}>
      {Icon && <Icon className="h-3 w-3" />}
      {m.label}
    </Badge>
  );
}

export function timeAgo(d: string) {
  const date = new Date(d);
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}
