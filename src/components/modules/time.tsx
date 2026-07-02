"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Play, Square as StopIcon, Clock, DollarSign, TrendingUp, RefreshCw } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { timeAgo } from "./dashboard";

interface TimeEntry {
  id: string;
  startTime: string;
  endTime: string | null;
  duration: number;
  billable: boolean;
  notes: string | null;
  task: { id: string; title: string } | null;
  project: { id: string; name: string } | null;
}

export function TimeModule() {
  const { user } = useAppStore();
  const [entries, setEntries] = React.useState<TimeEntry[]>([]);
  const [totalMinutes, setTotalMinutes] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [running, setRunning] = React.useState(false);
  const [elapsed, setElapsed] = React.useState(0);
  const [runningEntryId, setRunningEntryId] = React.useState<string | null>(null);
  const [taskId, setTaskId] = React.useState("");
  const [projectId, setProjectId] = React.useState("");
  const [tasks, setTasks] = React.useState<Array<{ id: string; title: string }>>([]);
  const [projects, setProjects] = React.useState<Array<{ id: string; name: string }>>([]);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/time");
      const data = await res.json();
      setEntries(data.entries || []);
      setTotalMinutes(data.totalMinutes || 0);
      // Check for running entry
      const runningEntry = (data.entries || []).find((e: TimeEntry) => !e.endTime);
      if (runningEntry) {
        setRunning(true);
        setRunningEntryId(runningEntry.id);
        const elapsedSec = Math.round((Date.now() - new Date(runningEntry.startTime).getTime()) / 1000);
        setElapsed(elapsedSec);
      }
    } finally { setLoading(false); }
  }, []);

  React.useEffect(() => {
    load();
    fetch("/api/tasks").then((r) => r.json()).then((d) => setTasks(d.tasks?.map((t: any) => ({ id: t.id, title: t.title })) || [])).catch(() => {});
    fetch("/api/projects").then((r) => r.json()).then((d) => setProjects(d.projects?.map((p: any) => ({ id: p.id, name: p.name })) || [])).catch(() => {});
  }, [load]);

  React.useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(interval);
  }, [running]);

  const start = async () => {
    try {
      const res = await fetch("/api/time", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "start", taskId: taskId || null, projectId: projectId || null }),
      });
      const data = await res.json();
      setRunningEntryId(data.entry?.id || null);
      setRunning(true);
      setElapsed(0);
      toast.success("Timer started");
    } catch { toast.error("Failed to start"); }
  };

  const stop = async () => {
    if (!runningEntryId) return;
    try {
      await fetch("/api/time", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "stop", id: runningEntryId }),
      });
      setRunning(false);
      setRunningEntryId(null);
      setElapsed(0);
      toast.success("Timer stopped");
      load();
    } catch { toast.error("Failed to stop"); }
  };

  const fmtDuration = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  };

  const fmtTimer = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const billableMinutes = entries.filter((e) => e.billable).reduce((s, e) => s + e.duration, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-black">Time Tracking</h2>
          <p className="text-sm text-zinc-600 mt-1">Track time on tasks and projects. Generate timesheets.</p>
        </div>
        <Button variant="outline" onClick={load} className="border-zinc-300"><RefreshCw className="h-4 w-4 mr-1.5" />Refresh</Button>
      </div>

      {/* Timer card */}
      <Card className={`border-2 ${running ? "border-[#f1c24e] bg-[#fef8e7]" : "border-zinc-200"}`}>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex-1 w-full">
              <div className="text-xs font-semibold text-zinc-500 uppercase mb-2">{running ? "Tracking time" : "Ready to track"}</div>
              <div className="font-mono text-5xl font-bold text-black tabular-nums">{fmtTimer(elapsed)}</div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Select value={taskId} onValueChange={setTaskId} disabled={running}>
                  <SelectTrigger className="w-[200px]"><SelectValue placeholder="Select task" /></SelectTrigger>
                  <SelectContent>{tasks.map((t) => <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>)}</SelectContent>
                </Select>
                <Select value={projectId} onValueChange={setProjectId} disabled={running}>
                  <SelectTrigger className="w-[200px]"><SelectValue placeholder="Select project" /></SelectTrigger>
                  <SelectContent>{projects.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            {running ? (
              <Button onClick={stop} size="lg" className="bg-red-500 hover:bg-red-600 text-white font-semibold h-16 w-16 rounded-full">
                <StopIcon className="h-7 w-7" />
              </Button>
            ) : (
              <Button onClick={start} size="lg" className="bg-[#f1c24e] text-black hover:bg-[#e9b73a] font-semibold h-16 w-16 rounded-full">
                <Play className="h-7 w-7 ml-1" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiTile icon={Clock} label="Total Hours" value={fmtDuration(totalMinutes)} accent="#0891b2" />
        <KpiTile icon={DollarSign} label="Billable Hours" value={fmtDuration(billableMinutes)} accent="#16a34a" />
        <KpiTile icon={TrendingUp} label="Entries" value={entries.length} accent="#7c3aed" />
        <KpiTile icon={Clock} label="Avg / Entry" value={entries.length ? fmtDuration(Math.round(totalMinutes / entries.length)) : "0h 0m"} accent="#c79a2e" />
      </div>

      {/* Entries */}
      <Card className="border-zinc-200">
        <CardHeader><CardTitle className="text-base">Recent Entries</CardTitle><CardDescription>Your last 100 time entries</CardDescription></CardHeader>
        <CardContent className="p-0">
          {loading ? <div className="p-8 text-center text-zinc-500">Loading...</div> : entries.length === 0 ? (
            <div className="p-12 text-center"><Clock className="h-10 w-10 mx-auto text-zinc-300 mb-3" /><p className="text-zinc-600 font-medium">No time entries yet</p></div>
          ) : (
            <div className="divide-y divide-zinc-100">
              {entries.slice(0, 30).map((e) => (
                <div key={e.id} className="p-4 hover:bg-zinc-50 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{e.task?.title || e.project?.name || "General"}</div>
                    <div className="text-xs text-zinc-500">
                      {e.project?.name && <span>{e.project.name} · </span>}
                      {new Date(e.startTime).toLocaleString()}
                      {e.endTime && ` → ${new Date(e.endTime).toLocaleTimeString()}`}
                    </div>
                    {e.notes && <div className="text-xs text-zinc-500 mt-0.5">{e.notes}</div>}
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-sm">{fmtDuration(e.duration)}</div>
                    <Badge variant="secondary" className={`text-[10px] ${e.billable ? "bg-green-100 text-green-700" : "bg-zinc-100 text-zinc-500"}`}>
                      {e.billable ? "Billable" : "Non-billable"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function KpiTile({ icon: Icon, label, value, accent }: { icon: React.ElementType; label: string; value: string | number; accent: string }) {
  return <Card className="border-zinc-200"><CardContent className="p-4"><div className="h-9 w-9 rounded-lg flex items-center justify-center mb-2" style={{ background: `${accent}15`, color: accent }}><Icon className="h-4.5 w-4.5" /></div><div className="text-2xl font-bold">{value}</div><div className="text-xs text-zinc-500">{label}</div></CardContent></Card>;
}
