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
  CheckSquare,
  Clock,
  AlertCircle,
  Calendar,
  Filter,
  RefreshCw,
  Send,
  Play,
  Square as SquareIcon,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { TASK_STATUSES, TASK_PRIORITIES } from "@/lib/constants";
import { timeAgo } from "./dashboard";

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: string | null;
  startDate: string | null;
  estimatedTime: number | null;
  actualTime: number;
  projectId: string | null;
  assigneeId: string | null;
  reporterId: string | null;
  labels: string | null;
  tags: string | null;
  checklist: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  assignee: { id: string; name: string; avatarColor: string } | null;
  reporter: { id: string; name: true; avatarColor: string } | null;
  project: { id: string; name: string } | null;
  _count: { comments: number; subtasks: number; timeEntries: number };
}

const initials = (n: string) => n.split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase();

export function TasksModule() {
  const { user, hasPermission, setActiveModule } = useAppStore();
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [filterStatus, setFilterStatus] = React.useState("all");
  const [filterPriority, setFilterPriority] = React.useState("all");
  const [view, setView] = React.useState<"board" | "list">("board");
  const [showNew, setShowNew] = React.useState(false);
  const [selected, setSelected] = React.useState<Task | null>(null);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const canCreate = hasPermission("tasks", "create");

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/tasks");
      const data = await res.json();
      setTasks(data.tasks || []);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const filtered = tasks.filter((t) => {
    if (filterStatus !== "all" && t.status !== filterStatus) return false;
    if (filterPriority !== "all" && t.priority !== filterPriority) return false;
    return true;
  });

  const openTask = (t: Task) => {
    setSelected(t);
    setSheetOpen(true);
  };

  const updateStatus = async (taskId: string, status: string) => {
    await fetch(`/api/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  };

  // Board view: group by status
  const boardColumns = TASK_STATUSES.filter((s) => !["cancelled", "reopened"].includes(s.id));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-black">Tasks</h2>
          <p className="text-sm text-zinc-600 mt-1">
            Plan, assign, and track work across the team.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={load} className="border-zinc-300">
            <RefreshCw className="h-4 w-4 mr-1.5" />
            Refresh
          </Button>
          {canCreate && (
            <Button
              onClick={() => setShowNew(true)}
              className="bg-[#f1c24e] text-black hover:bg-[#e9b73a] font-semibold"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              New Task
            </Button>
          )}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiTile icon={CheckSquare} label="Total Tasks" value={tasks.length} accent="#0891b2" />
        <KpiTile icon={Clock} label="In Progress" value={tasks.filter((t) => t.status === "in_progress").length} accent="#c79a2e" />
        <KpiTile icon={CheckSquare} label="Completed" value={tasks.filter((t) => t.status === "completed").length} accent="#16a34a" />
        <KpiTile icon={AlertCircle} label="Overdue" value={tasks.filter((t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "completed").length} accent="#dc2626" />
      </div>

      {/* Filters + view toggle */}
      <Card className="border-zinc-200">
        <CardContent className="p-4 flex flex-wrap items-center gap-3">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[160px]">
              <Filter className="h-3.5 w-3.5 mr-1.5 text-zinc-500" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {TASK_STATUSES.map((s) => (
                <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All priorities</SelectItem>
              {TASK_PRIORITIES.map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex gap-1 ml-auto">
            <Button size="sm" variant={view === "board" ? "default" : "outline"} onClick={() => setView("board")} className={view === "board" ? "bg-[#f1c24e] text-black" : ""}>
              Board
            </Button>
            <Button size="sm" variant={view === "list" ? "default" : "outline"} onClick={() => setView("list")} className={view === "list" ? "bg-[#f1c24e] text-black" : ""}>
              List
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Board view */}
      {view === "board" ? (
        <div className="overflow-x-auto thin-scroll pb-2">
          <div className="flex gap-3 min-w-max">
            {boardColumns.map((col) => {
              const colTasks = filtered.filter((t) => t.status === col.id);
              return (
                <div key={col.id} className="w-[280px] shrink-0 bg-zinc-50 rounded-xl border border-zinc-200">
                  <div className="p-3 border-b border-zinc-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full" style={{ background: col.color }} />
                      <h3 className="font-semibold text-sm">{col.label}</h3>
                    </div>
                    <Badge variant="secondary" className="text-xs">{colTasks.length}</Badge>
                  </div>
                  <div className="p-2 space-y-2 max-h-[500px] overflow-y-auto thin-scroll">
                    {colTasks.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => openTask(t)}
                        className="w-full text-left bg-white border border-zinc-200 hover:border-[#f1c24e] rounded-lg p-3 transition shadow-sm"
                      >
                        <div className="font-semibold text-sm mb-1.5">{t.title}</div>
                        {t.description && (
                          <div className="text-xs text-zinc-500 line-clamp-2 mb-2">{t.description}</div>
                        )}
                        <div className="flex items-center gap-2 flex-wrap">
                          <PriorityBadge priority={t.priority} />
                          {t.project && (
                            <Badge variant="outline" className="text-[10px]">{t.project.name}</Badge>
                          )}
                          {t.dueDate && (
                            <span className="text-[10px] text-zinc-500 flex items-center gap-0.5">
                              <Calendar className="h-3 w-3" />
                              {new Date(t.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            </span>
                          )}
                        </div>
                        {t.assignee && (
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-100">
                            <div className="flex items-center gap-1.5">
                              <Avatar className="h-5 w-5">
                                <AvatarFallback style={{ background: t.assignee.avatarColor, color: "#fff" }} className="text-[9px]">
                                  {initials(t.assignee.name)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-[10px] text-zinc-500">{t.assignee.name}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-zinc-400">
                              {t._count.comments > 0 && <span>💬 {t._count.comments}</span>}
                              {t._count.subtasks > 0 && <span>✓ {t._count.subtasks}</span>}
                            </div>
                          </div>
                        )}
                      </button>
                    ))}
                    {colTasks.length === 0 && (
                      <div className="text-center text-xs text-zinc-400 py-6">No tasks</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* List view */
        <Card className="border-zinc-200">
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center text-zinc-500">Loading...</div>
            ) : filtered.length === 0 ? (
              <div className="p-12 text-center">
                <CheckSquare className="h-10 w-10 mx-auto text-zinc-300 mb-3" />
                <p className="text-zinc-600 font-medium">No tasks found</p>
              </div>
            ) : (
              <div className="divide-y divide-zinc-100">
                {filtered.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => openTask(t)}
                    className="w-full text-left p-4 hover:bg-zinc-50 transition flex items-start gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">{t.title}</span>
                        <PriorityBadge priority={t.priority} />
                      </div>
                      {t.description && <p className="text-xs text-zinc-500 line-clamp-1">{t.description}</p>}
                      <div className="flex items-center gap-3 mt-2 text-xs text-zinc-500">
                        {t.project && <span>{t.project.name}</span>}
                        {t.dueDate && <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(t.dueDate).toLocaleDateString()}</span>}
                        {t.assignee && <span>{t.assignee.name}</span>}
                      </div>
                    </div>
                    <StatusBadge status={t.status} />
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* AI Productivity CTA */}
      <div className="magnence-soft-bg border border-[#f1c24e]/30 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold text-black">Need help planning your day?</h3>
          <p className="text-sm text-zinc-600 mt-1">
            Ask the Productivity AI to prioritize tasks, break down big tasks, or find blockers.
          </p>
        </div>
        <Button
          onClick={() => setActiveModule("assistant")}
          className="bg-[#f1c24e] text-black hover:bg-[#e9b73a] font-semibold"
        >
          Ask Productivity AI
        </Button>
      </div>

      <NewTaskDialog
        open={showNew}
        onOpenChange={setShowNew}
        userId={user?.id || ""}
        onCreated={() => {
          setShowNew(false);
          load();
          toast.success("Task created");
        }}
      />

      <TaskDetailSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        task={selected}
        currentUserId={user?.id || ""}
        currentUserName={user?.name || ""}
        onStatusChange={updateStatus}
        onUpdated={load}
      />
    </div>
  );
}

function KpiTile({ icon: Icon, label, value, accent }: { icon: React.ElementType; label: string; value: number; accent: string }) {
  return (
    <Card className="border-zinc-200">
      <CardContent className="p-4">
        <div className="h-9 w-9 rounded-lg flex items-center justify-center mb-2" style={{ background: `${accent}15`, color: accent }}>
          <Icon className="h-4.5 w-4.5" />
        </div>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-xs text-zinc-500">{label}</div>
      </CardContent>
    </Card>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const p = TASK_PRIORITIES.find((x) => x.id === priority) || TASK_PRIORITIES[1];
  return (
    <Badge variant="secondary" className="text-[10px]" style={{ background: `${p.color}20`, color: p.color }}>
      {p.label}
    </Badge>
  );
}

function StatusBadge({ status }: { status: string }) {
  const s = TASK_STATUSES.find((x) => x.id === status) || TASK_STATUSES[0];
  return (
    <Badge variant="secondary" className="text-[10px] shrink-0" style={{ background: `${s.color}20`, color: s.color }}>
      {s.label}
    </Badge>
  );
}

function NewTaskDialog({
  open,
  onOpenChange,
  userId,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  userId: string;
  onCreated: () => void;
}) {
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [priority, setPriority] = React.useState("medium");
  const [status, setStatus] = React.useState("todo");
  const [dueDate, setDueDate] = React.useState("");
  const [assigneeId, setAssigneeId] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [users, setUsers] = React.useState<Array<{ id: string; name: string }>>([]);

  React.useEffect(() => {
    if (open) {
      fetch("/api/employees").then((r) => r.json()).then((d) => setUsers(d.employees?.map((e: any) => ({ id: e.user.id, name: e.user.name })) || [])).catch(() => {});
    }
  }, [open]);

  const submit = async () => {
    if (!title.trim()) { toast.error("Title required"); return; }
    setSubmitting(true);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          priority,
          status,
          dueDate: dueDate || null,
          assigneeId: assigneeId || userId,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setTitle(""); setDescription(""); setDueDate(""); setAssigneeId("");
      onCreated();
    } catch { toast.error("Failed to create task"); }
    finally { setSubmitting(false); }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>New Task</DialogTitle>
          <DialogDescription>Create a task and assign it to a team member.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="space-y-2">
            <Label>Title *</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Design homepage hero" />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TASK_PRIORITIES.map((p) => <SelectItem key={p.id} value={p.id}>{p.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TASK_STATUSES.map((s) => <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Assignee</Label>
              <Select value={assigneeId} onValueChange={setAssigneeId}>
                <SelectTrigger><SelectValue placeholder="Yourself" /></SelectTrigger>
                <SelectContent>
                  {users.map((u) => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
          <Button onClick={submit} disabled={submitting} className="bg-[#f1c24e] text-black hover:bg-[#e9b73a] font-semibold">
            {submitting ? "Creating..." : "Create Task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function TaskDetailSheet({
  open,
  onOpenChange,
  task,
  currentUserId,
  currentUserName,
  onStatusChange,
  onUpdated,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  task: Task | null;
  currentUserId: string;
  currentUserName: string;
  onStatusChange: (id: string, status: string) => void;
  onUpdated: () => void;
}) {
  const [newStatus, setNewStatus] = React.useState("");
  const [comment, setComment] = React.useState("");
  const [comments, setComments] = React.useState<any[]>([]);
  const [sendingComment, setSendingComment] = React.useState(false);
  const [timerRunning, setTimerRunning] = React.useState(false);
  const [timerEntryId, setTimerEntryId] = React.useState<string | null>(null);
  const [elapsed, setElapsed] = React.useState(0);

  React.useEffect(() => {
    if (task) {
      setNewStatus(task.status);
      setComment("");
      // Load comments
      fetch(`/api/tasks/${task.id}/comments`, { method: "GET" }).then((r) => r.json()).then((d) => setComments(d.comments || [])).catch(() => setComments([]));
    }
  }, [task]);

  React.useEffect(() => {
    if (!timerRunning) return;
    const interval = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(interval);
  }, [timerRunning]);

  if (!task) return null;

  const startTimer = async () => {
    try {
      const res = await fetch("/api/time", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "start", taskId: task.id }),
      });
      const data = await res.json();
      setTimerEntryId(data.entry?.id || null);
      setTimerRunning(true);
      setElapsed(0);
      toast.success("Timer started");
    } catch { toast.error("Failed to start timer"); }
  };

  const stopTimer = async () => {
    if (!timerEntryId) return;
    try {
      await fetch("/api/time", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "stop", id: timerEntryId }),
      });
      setTimerRunning(false);
      setTimerEntryId(null);
      setElapsed(0);
      toast.success("Timer stopped");
      onUpdated();
    } catch { toast.error("Failed to stop timer"); }
  };

  const sendComment = async () => {
    if (!comment.trim()) return;
    setSendingComment(true);
    try {
      const res = await fetch(`/api/tasks/${task.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: comment }),
      });
      const data = await res.json();
      setComments([...comments, { ...data.comment, author: { id: currentUserId, name: currentUserName, avatarColor: "#f1c24e" } }]);
      setComment("");
    } catch { toast.error("Failed to send"); }
    finally { setSendingComment(false); }
  };

  const fmtTime = (s: number) => `${Math.floor(s / 60)}m ${s % 60}s`;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[560px] overflow-y-auto thin-scroll">
        <SheetHeader>
          <div className="flex items-center gap-2 flex-wrap">
            <PriorityBadge priority={task.priority} />
            <StatusBadge status={task.status} />
            {task.project && <Badge variant="outline" className="text-xs">{task.project.name}</Badge>}
          </div>
          <SheetTitle className="text-xl pt-2">{task.title}</SheetTitle>
          <SheetDescription>
            Created {timeAgo(task.createdAt)} by {task.reporter?.name || "Unknown"}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {task.description && (
            <div>
              <div className="text-xs font-semibold text-zinc-500 uppercase mb-1">Description</div>
              <div className="text-sm text-zinc-800 whitespace-pre-wrap bg-zinc-50 rounded-md p-3 border border-zinc-100">{task.description}</div>
            </div>
          )}

          {/* Time tracking */}
          <div className="bg-zinc-50 rounded-lg p-3 border border-zinc-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-zinc-500">Time tracking</div>
                <div className="font-semibold">{task.actualTime}m logged</div>
                {timerRunning && <div className="text-sm text-[#c79a2e] font-mono">{fmtTime(elapsed)}</div>}
              </div>
              {timerRunning ? (
                <Button size="sm" onClick={stopTimer} className="bg-red-500 hover:bg-red-600 text-white">
                  <SquareIcon className="h-3.5 w-3.5 mr-1" /> Stop
                </Button>
              ) : (
                <Button size="sm" onClick={startTimer} className="bg-[#f1c24e] text-black hover:bg-[#e9b73a]">
                  <Play className="h-3.5 w-3.5 mr-1" /> Start
                </Button>
              )}
            </div>
          </div>

          {/* Status changer */}
          <div>
            <div className="text-xs font-semibold text-zinc-500 uppercase mb-2">Move to status</div>
            <div className="grid grid-cols-2 gap-1.5">
              {TASK_STATUSES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setNewStatus(s.id);
                    onStatusChange(task.id, s.id);
                  }}
                  className={`flex items-center gap-2 p-2 rounded-md border text-xs transition ${
                    s.id === newStatus ? "border-[#f1c24e] bg-[#fef8e7] font-semibold" : "border-zinc-200 hover:bg-zinc-50"
                  }`}
                >
                  <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Comments */}
          <div>
            <div className="text-xs font-semibold text-zinc-500 uppercase mb-2">Comments ({comments.length})</div>
            <div className="space-y-2 max-h-[200px] overflow-y-auto thin-scroll mb-2">
              {comments.length === 0 ? (
                <p className="text-xs text-zinc-400 text-center py-4">No comments yet</p>
              ) : (
                comments.map((c) => (
                  <div key={c.id} className="bg-zinc-100 rounded-md p-2 text-sm">
                    <div className="text-xs font-semibold text-zinc-700 mb-0.5">{c.author?.name || "Unknown"}</div>
                    <div className="text-zinc-800">{c.content}</div>
                  </div>
                ))
              )}
            </div>
            <div className="flex gap-2">
              <Input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Add a comment..." onKeyDown={(e) => e.key === "Enter" && sendComment()} />
              <Button size="sm" onClick={sendComment} disabled={sendingComment || !comment.trim()} className="bg-[#f1c24e] text-black hover:bg-[#e9b73a]">
                <Send className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
