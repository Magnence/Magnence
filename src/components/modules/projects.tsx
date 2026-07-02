"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { toast } from "sonner";
import { Plus, FolderKanban, RefreshCw, Calendar, DollarSign, TrendingUp, CheckSquare } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { PROJECT_STATUSES, PROJECT_CATEGORIES } from "@/lib/constants";
import { timeAgo } from "./dashboard";

interface Project {
  id: string;
  name: string;
  description: string | null;
  category: string;
  department: string | null;
  status: string;
  budget: number;
  spent: number;
  progress: number;
  startDate: string | null;
  endDate: string | null;
  objectives: string | null;
  deliverables: string | null;
  createdAt: string;
  _count: { tasks: number; milestones: number };
  taskStats: { total: number; completed: number; pending: number };
}

export function ProjectsModule() {
  const { hasPermission, setActiveModule } = useAppStore();
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showNew, setShowNew] = React.useState(false);
  const [selected, setSelected] = React.useState<Project | null>(null);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const canCreate = hasPermission("projects", "create");

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      setProjects(data.projects || []);
    } finally { setLoading(false); }
  }, []);

  React.useEffect(() => { load(); }, [load]);

  const openProject = (p: Project) => { setSelected(p); setSheetOpen(true); };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-black">Projects</h2>
          <p className="text-sm text-zinc-600 mt-1">Plan, track, and ship projects with milestones and task boards.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={load} className="border-zinc-300"><RefreshCw className="h-4 w-4 mr-1.5" />Refresh</Button>
          {canCreate && (
            <Button onClick={() => setShowNew(true)} className="bg-[#f1c24e] text-black hover:bg-[#e9b73a] font-semibold">
              <Plus className="h-4 w-4 mr-1.5" />New Project
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiTile icon={FolderKanban} label="Total Projects" value={projects.length} accent="#0891b2" />
        <KpiTile icon={TrendingUp} label="Active" value={projects.filter((p) => p.status === "active").length} accent="#16a34a" />
        <KpiTile icon={CheckSquare} label="Completed" value={projects.filter((p) => p.status === "completed").length} accent="#7c3aed" />
        <KpiTile icon={DollarSign} label="Total Budget" value={`$${projects.reduce((s, p) => s + p.budget, 0).toLocaleString()}`} accent="#c79a2e" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full text-center py-12 text-zinc-500">Loading...</div>
        ) : projects.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <FolderKanban className="h-10 w-10 mx-auto text-zinc-300 mb-3" />
            <p className="text-zinc-600 font-medium">No projects yet</p>
          </div>
        ) : (
          projects.map((p) => {
            const status = PROJECT_STATUSES.find((s) => s.id === p.status) || PROJECT_STATUSES[0];
            return (
              <Card key={p.id} className="border-zinc-200 hover:border-[#f1c24e] hover:shadow-md transition cursor-pointer" onClick={() => openProject(p)}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="h-10 w-10 rounded-lg bg-[#fef8e7] flex items-center justify-center">
                      <FolderKanban className="h-5 w-5 text-[#c79a2e]" />
                    </div>
                    <Badge variant="secondary" className="text-[10px]" style={{ background: `${status.color}20`, color: status.color }}>{status.label}</Badge>
                  </div>
                  <h3 className="font-semibold text-base mb-1">{p.name}</h3>
                  {p.description && <p className="text-xs text-zinc-500 line-clamp-2 mb-3">{p.description}</p>}
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-xs text-zinc-500 mb-1">
                        <span>Progress</span><span>{p.progress}%</span>
                      </div>
                      <Progress value={p.progress} className="h-1.5" />
                    </div>
                    <div className="flex items-center justify-between text-xs pt-2 border-t border-zinc-100">
                      <span className="text-zinc-500">{p.taskStats.total} tasks ({p.taskStats.completed} done)</span>
                      {p.endDate && <span className="text-zinc-500 flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(p.endDate).toLocaleDateString()}</span>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      <NewProjectDialog open={showNew} onOpenChange={setShowNew} onCreated={() => { setShowNew(false); load(); toast.success("Project created"); }} />
      <ProjectDetailSheet open={sheetOpen} onOpenChange={setSheetOpen} project={selected} onGoToTasks={() => setActiveModule("tasks")} />
    </div>
  );
}

function KpiTile({ icon: Icon, label, value, accent }: { icon: React.ElementType; label: string; value: string | number; accent: string }) {
  return (
    <Card className="border-zinc-200"><CardContent className="p-4">
      <div className="h-9 w-9 rounded-lg flex items-center justify-center mb-2" style={{ background: `${accent}15`, color: accent }}><Icon className="h-4.5 w-4.5" /></div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-zinc-500">{label}</div>
    </CardContent></Card>
  );
}

function NewProjectDialog({ open, onOpenChange, onCreated }: { open: boolean; onOpenChange: (v: boolean) => void; onCreated: () => void }) {
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [category, setCategory] = React.useState("internal");
  const [status, setStatus] = React.useState("planning");
  const [budget, setBudget] = React.useState("10000");
  const [endDate, setEndDate] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const submit = async () => {
    if (!name.trim()) { toast.error("Name required"); return; }
    setSubmitting(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, category, status, budget: Number(budget) || 0, endDate: endDate || null }),
      });
      if (!res.ok) throw new Error("Failed");
      setName(""); setDescription(""); setEndDate("");
      onCreated();
    } catch { toast.error("Failed"); } finally { setSubmitting(false); }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader><DialogTitle>New Project</DialogTitle><DialogDescription>Create a new project.</DialogDescription></DialogHeader>
        <div className="space-y-3 py-2">
          <div className="space-y-2"><Label>Name *</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div className="space-y-2"><Label>Description</Label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2"><Label>Category</Label><Select value={category} onValueChange={setCategory}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{PROJECT_CATEGORIES.map((c) => <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-2"><Label>Status</Label><Select value={status} onValueChange={setStatus}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{PROJECT_STATUSES.map((s) => <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>)}</SelectContent></Select></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2"><Label>Budget ($)</Label><Input type="number" value={budget} onChange={(e) => setBudget(e.target.value)} /></div>
            <div className="space-y-2"><Label>End Date</Label><Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} /></div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
          <Button onClick={submit} disabled={submitting} className="bg-[#f1c24e] text-black hover:bg-[#e9b73a] font-semibold">{submitting ? "Creating..." : "Create"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ProjectDetailSheet({ open, onOpenChange, project, onGoToTasks }: { open: boolean; onOpenChange: (v: boolean) => void; project: Project | null; onGoToTasks: () => void }) {
  if (!project) return null;
  const status = PROJECT_STATUSES.find((s) => s.id === project.status) || PROJECT_STATUSES[0];
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[540px] overflow-y-auto thin-scroll">
        <SheetHeader>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs" style={{ background: `${status.color}20`, color: status.color }}>{status.label}</Badge>
            <Badge variant="outline" className="text-xs capitalize">{project.category}</Badge>
          </div>
          <SheetTitle className="text-xl pt-2">{project.name}</SheetTitle>
          <SheetDescription>{project.description || "No description"}</SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Info label="Budget" value={`$${project.budget.toLocaleString()}`} />
            <Info label="Spent" value={`$${project.spent.toLocaleString()}`} />
            <Info label="Tasks" value={`${project.taskStats.completed}/${project.taskStats.total}`} />
            <Info label="Progress" value={`${project.progress}%`} />
          </div>
          <div>
            <div className="text-xs font-semibold text-zinc-500 uppercase mb-1">Progress</div>
            <Progress value={project.progress} className="h-2" />
          </div>
          {project.objectives && (
            <div><div className="text-xs font-semibold text-zinc-500 uppercase mb-1">Objectives</div><div className="text-sm text-zinc-700 whitespace-pre-wrap">{project.objectives}</div></div>
          )}
          <Button onClick={onGoToTasks} className="w-full bg-[#f1c24e] text-black hover:bg-[#e9b73a] font-semibold">View Tasks</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="bg-zinc-50 rounded-lg p-3 border border-zinc-100"><div className="text-xs text-zinc-500">{label}</div><div className="font-semibold mt-0.5">{value}</div></div>;
}
