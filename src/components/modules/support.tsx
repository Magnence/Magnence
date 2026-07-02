"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import {
  Plus,
  LifeBuoy,
  Filter,
  Search,
  Send,
  Sparkles,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Inbox,
  RefreshCw,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import {
  TICKET_TYPES,
  TICKET_PRIORITIES,
  TICKET_STATUSES,
  ROLE_LABELS,
} from "@/lib/constants";
import { PriorityBadge, StatusBadge, timeAgo } from "./dashboard";

interface Ticket {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  openedById: string;
  assignedToId: string | null;
  response: string | null;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
  openedBy: { id: string; name: string; avatarColor: string; role: string };
  assignedTo: { id: string; name: string; avatarColor: string } | null;
  messages?: TicketMessage[];
}
interface TicketMessage {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  isStaff: boolean;
  createdAt: string;
}

const CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  TICKET_TYPES.map((t) => [t.id, t.label])
);

export function SupportModule() {
  const { user } = useAppStore();
  const [tickets, setTickets] = React.useState<Ticket[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [filterStatus, setFilterStatus] = React.useState<string>("all");
  const [filterCategory, setFilterCategory] = React.useState<string>("all");
  const [search, setSearch] = React.useState("");
  const [showNew, setShowNew] = React.useState(false);
  const [selectedTicket, setSelectedTicket] = React.useState<Ticket | null>(null);
  const [sheetOpen, setSheetOpen] = React.useState(false);

  const isSupport = user?.role === "SUPPORT" || user?.role === "MANAGER";

  const loadTickets = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/tickets");
      const data = await res.json();
      setTickets(data.tickets || []);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  const filtered = tickets.filter((t) => {
    if (filterStatus !== "all" && t.status !== filterStatus) return false;
    if (filterCategory !== "all" && t.category !== filterCategory) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const stats = {
    open: tickets.filter((t) => t.status === "open").length,
    inProgress: tickets.filter((t) => t.status === "in_progress").length,
    waiting: tickets.filter((t) => t.status === "waiting").length,
    resolved: tickets.filter((t) => t.status === "resolved" || t.status === "closed").length,
  };

  const openTicketDetail = async (t: Ticket) => {
    // Fetch fresh ticket with messages
    try {
      const res = await fetch(`/api/tickets/${t.id}`);
      const data = await res.json();
      setSelectedTicket(data.ticket || t);
    } catch {
      setSelectedTicket(t);
    }
    setSheetOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-black">Support Center</h2>
          <p className="text-sm text-zinc-600 mt-1">
            {isSupport
              ? "All company tickets. Solve them here — your team is counting on you."
              : "Report an issue and our Support team will jump on it. Track progress in real time."}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadTickets} className="border-zinc-300">
            <RefreshCw className="h-4 w-4 mr-1.5" />
            Refresh
          </Button>
          <Button
            onClick={() => setShowNew(true)}
            className="bg-[#f1c24e] text-black hover:bg-[#e9b73a] font-semibold"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            New Ticket
          </Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={Inbox} label="Open" value={stats.open} color="#52525b" />
        <StatCard icon={Clock} label="In Progress" value={stats.inProgress} color="#c79a2e" />
        <StatCard icon={AlertTriangle} label="Waiting" value={stats.waiting} color="#ea580c" />
        <StatCard icon={CheckCircle2} label="Resolved" value={stats.resolved} color="#16a34a" />
      </div>

      {/* Filters */}
      <Card className="border-zinc-200">
        <CardContent className="p-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="Search tickets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[160px]">
              <Filter className="h-3.5 w-3.5 mr-1.5 text-zinc-500" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {TICKET_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s.replace("_", " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {TICKET_TYPES.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Ticket list */}
      <Card className="border-zinc-200">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-zinc-500">Loading tickets...</div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center">
              <LifeBuoy className="h-10 w-10 mx-auto text-zinc-300 mb-3" />
              <p className="text-zinc-600 font-medium">No tickets found</p>
              <p className="text-sm text-zinc-500 mt-1">
                Try clearing filters or create a new ticket.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-100">
              {filtered.map((t) => (
                <button
                  key={t.id}
                  onClick={() => openTicketDetail(t)}
                  className="w-full text-left p-4 hover:bg-zinc-50 transition flex items-start gap-3"
                >
                  <Avatar className="h-10 w-10 mt-0.5">
                    <AvatarFallback
                      style={{ background: t.openedBy.avatarColor, color: "#fff" }}
                      className="text-xs"
                    >
                      {(t.openedBy.name || "?").split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-sm truncate">{t.title}</h3>
                      <span className="text-xs text-zinc-400 shrink-0">
                        {timeAgo(t.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-600 line-clamp-1 mt-0.5">
                      {t.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <PriorityBadge priority={t.priority} />
                      <StatusBadge status={t.status} />
                      <Badge variant="outline" className="text-xs">
                        {CATEGORY_LABELS[t.category] || t.category}
                      </Badge>
                      <span className="text-xs text-zinc-500">
                        by {t.openedBy.name} · {ROLE_LABELS[t.openedBy.role]}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <NewTicketDialog
        open={showNew}
        onOpenChange={setShowNew}
        userId={user?.id || ""}
        userName={user?.name || ""}
        onCreated={() => {
          setShowNew(false);
          loadTickets();
          toast.success("Ticket created — Support team notified!");
        }}
      />

      <TicketDetailSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        ticket={selectedTicket}
        isSupport={isSupport}
        currentUserId={user?.id || ""}
        currentUserName={user?.name || ""}
        onUpdated={() => {
          loadTickets();
        }}
      />
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <Card className="border-zinc-200">
      <CardContent className="p-4 flex items-center gap-3">
        <div
          className="h-10 w-10 rounded-lg flex items-center justify-center"
          style={{ background: `${color}15`, color }}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="text-2xl font-bold">{value}</div>
          <div className="text-xs text-zinc-500">{label}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function NewTicketDialog({
  open,
  onOpenChange,
  userId,
  userName,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  userId: string;
  userName: string;
  onCreated: () => void;
}) {
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [category, setCategory] = React.useState("bug");
  const [priority, setPriority] = React.useState("medium");
  const [submitting, setSubmitting] = React.useState(false);

  const submit = async () => {
    if (!title.trim() || !description.trim()) {
      toast.error("Please fill in title and description");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          category,
          priority,
          openedById: userId,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setTitle("");
      setDescription("");
      setCategory("bug");
      setPriority("medium");
      onCreated();
    } catch {
      toast.error("Failed to create ticket");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Report an issue</DialogTitle>
          <DialogDescription>
            Tell us what's wrong. Our Support team typically responds within 2 business hours.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="t-title">Title *</Label>
            <Input
              id="t-title"
              placeholder="Short summary, e.g. 'Cannot reset password'"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TICKET_TYPES.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TICKET_PRIORITIES.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="t-desc">Description *</Label>
            <Textarea
              id="t-desc"
              placeholder="Describe what happened, what you expected, and any error messages."
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-500 bg-[#fef8e7] rounded-md p-2.5 border border-[#f1c24e]/30">
            <Sparkles className="h-4 w-4 text-[#c79a2e] shrink-0" />
            <span>
              Need help describing the issue? Ask the <strong>Feature Support</strong> or{" "}
              <strong>Screen Helper</strong> AI agent in the AI Assistant tab.
            </span>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            onClick={submit}
            disabled={submitting}
            className="bg-[#f1c24e] text-black hover:bg-[#e9b73a] font-semibold"
          >
            {submitting ? "Creating..." : "Submit Ticket"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function TicketDetailSheet({
  open,
  onOpenChange,
  ticket,
  isSupport,
  currentUserId,
  currentUserName,
  onUpdated,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  ticket: Ticket | null;
  isSupport: boolean;
  currentUserId: string;
  currentUserName: string;
  onUpdated: () => void;
}) {
  const [newStatus, setNewStatus] = React.useState("");
  const [newPriority, setNewPriority] = React.useState("");
  const [response, setResponse] = React.useState("");
  const [reply, setReply] = React.useState("");
  const [sendingReply, setSendingReply] = React.useState(false);

  React.useEffect(() => {
    if (ticket) {
      setNewStatus(ticket.status);
      setNewPriority(ticket.priority);
      setResponse(ticket.response || "");
      setReply("");
    }
  }, [ticket]);

  if (!ticket) return null;

  const updateTicket = async (patch: Record<string, unknown>) => {
    try {
      const res = await fetch(`/api/tickets/${ticket.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      toast.success("Ticket updated");
      onUpdated();
      return data.ticket;
    } catch {
      toast.error("Update failed");
      return null;
    }
  };

  const sendReply = async () => {
    if (!reply.trim()) return;
    setSendingReply(true);
    try {
      await fetch(`/api/tickets/${ticket.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorId: currentUserId,
          authorName: currentUserName,
          content: reply,
          isStaff,
        }),
      });
      setReply("");
      // Refresh ticket
      const res = await fetch(`/api/tickets/${ticket.id}`);
      const data = await res.json();
      if (data.ticket) {
        // update parent state via callback indirectly
        onUpdated();
      }
      toast.success("Message sent");
    } catch {
      toast.error("Failed to send message");
    } finally {
      setSendingReply(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[600px] w-full overflow-y-auto thin-scroll">
        <SheetHeader>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {CATEGORY_LABELS[ticket.category]}
            </Badge>
            <PriorityBadge priority={ticket.priority} />
            <StatusBadge status={ticket.status} />
          </div>
          <SheetTitle className="text-xl">{ticket.title}</SheetTitle>
          <SheetDescription>
            Opened {timeAgo(ticket.createdAt)} by {ticket.openedBy.name} (
            {ROLE_LABELS[ticket.openedBy.role]})
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-5">
          {/* Description */}
          <div>
            <div className="text-xs font-semibold text-zinc-500 uppercase mb-1">
              Description
            </div>
            <div className="text-sm text-zinc-800 whitespace-pre-wrap bg-zinc-50 rounded-md p-3 border border-zinc-100">
              {ticket.description}
            </div>
          </div>

          {/* Conversation */}
          <div>
            <div className="text-xs font-semibold text-zinc-500 uppercase mb-2">
              Conversation
            </div>
            <div className="space-y-3 max-h-[300px] overflow-y-auto thin-scroll pr-1">
              {ticket.messages && ticket.messages.length > 0 ? (
                ticket.messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.authorId === currentUserId ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 text-sm ${
                        m.isStaff
                          ? "bg-[#fef8e7] border border-[#f1c24e]/40"
                          : m.authorId === currentUserId
                          ? "bg-zinc-900 text-white"
                          : "bg-zinc-100"
                      }`}
                    >
                      <div className="text-xs font-semibold mb-1 opacity-70">
                        {m.authorName} {m.isStaff && "· Support"}
                      </div>
                      <div className="whitespace-pre-wrap">{m.content}</div>
                      <div className="text-[10px] mt-1 opacity-60">
                        {timeAgo(m.createdAt)}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-zinc-500 text-center py-4">
                  No messages yet. Start the conversation below.
                </p>
              )}
            </div>

            {/* Reply box */}
            <div className="mt-3 flex gap-2">
              <Textarea
                placeholder="Write a reply..."
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                rows={2}
                className="resize-none"
              />
              <Button
                onClick={sendReply}
                disabled={sendingReply || !reply.trim()}
                className="bg-[#f1c24e] text-black hover:bg-[#e9b73a] shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Support controls */}
          {isSupport && (
            <div className="border-t border-zinc-200 pt-4 space-y-3">
              <div className="text-xs font-semibold text-zinc-500 uppercase">
                Support Controls
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Status</Label>
                  <Select
                    value={newStatus}
                    onValueChange={(v) => {
                      setNewStatus(v);
                      updateTicket({ status: v });
                    }}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TICKET_STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s.replace("_", " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Priority</Label>
                  <Select
                    value={newPriority}
                    onValueChange={(v) => {
                      setNewPriority(v);
                      updateTicket({ priority: v });
                    }}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TICKET_PRIORITIES.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p.charAt(0).toUpperCase() + p.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label className="text-xs">Internal Response / Resolution Note</Label>
                <Textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  rows={3}
                  placeholder="Summary of resolution for the user..."
                />
                <Button
                  size="sm"
                  className="mt-2 bg-[#f1c24e] text-black hover:bg-[#e9b73a]"
                  onClick={() => updateTicket({ response })}
                >
                  Save Response
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
