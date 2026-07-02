"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Eye, EyeOff, Upload, Loader2, Briefcase, Star, Search } from "lucide-react";
import { toast } from "sonner";
import { useAppStore } from "@/lib/store";

interface CaseStudyItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  industry: string;
  tagline: string;
  resultMetric: string;
  imageUrl: string | null;
  status: string;
  featured: boolean;
  client: string;
  createdAt: string;
}

const CATEGORIES = ["AI", "Software", "Web", "Mobile", "Automation", "Design", "Marketing"];
const INDUSTRIES = ["Retail", "Healthcare", "Logistics", "Finance", "Manufacturing", "Real Estate", "SaaS", "Education", "Technology", "Media", "Food & Beverage", "Agriculture", "Automotive"];

export function CMSCaseStudiesModule() {
  const { hasPermission } = useAppStore();
  const [studies, setStudies] = React.useState<CaseStudyItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [filterStatus, setFilterStatus] = React.useState("all");
  const [filterCategory, setFilterCategory] = React.useState("all");
  const [editingStudy, setEditingStudy] = React.useState<CaseStudyItem | null>(null);
  const [showEditor, setShowEditor] = React.useState(false);

  const canManage = hasPermission("cms-case-studies", "create") || hasPermission("cms-case-studies", "edit");

  const fetchStudies = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/cms/case-studies?status=${filterStatus}&category=${filterCategory}`);
      const data = await res.json();
      if (data.ok) setStudies(data.studies);
    } catch {
      toast.error("Failed to load case studies");
    } finally {
      setLoading(false);
    }
  }, [filterStatus, filterCategory]);

  React.useEffect(() => { fetchStudies(); }, [fetchStudies]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this case study? This cannot be undone.")) return;
    try {
      await fetch("/api/cms/case-studies", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "delete" }),
      });
      toast.success("Case study deleted");
      fetchStudies();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleTogglePublish = async (id: string) => {
    try {
      const res = await fetch("/api/cms/case-studies", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "toggle-publish" }),
      });
      const data = await res.json();
      if (data.ok) {
        toast.success(`Case study ${data.status}`);
        fetchStudies();
      }
    } catch {
      toast.error("Toggle failed");
    }
  };

  const handleToggleFeatured = async (study: CaseStudyItem) => {
    try {
      await fetch("/api/cms/case-studies", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: study.id, featured: !study.featured }),
      });
      toast.success(!study.featured ? "Marked as featured" : "Unfeatured");
      fetchStudies();
    } catch {
      toast.error("Update failed");
    }
  };

  const filtered = studies.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.client.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-[#f1c24e]" />
            Case Studies
          </h1>
          <p className="text-sm text-zinc-500 mt-1">Manage website case studies — create, edit, publish, and delete.</p>
        </div>
        {canManage && (
          <Button
            onClick={() => { setEditingStudy(null); setShowEditor(true); }}
            className="bg-[#f1c24e] text-black hover:bg-[#e9b73a]"
          >
            <Plus className="h-4 w-4 mr-1" /> New Case Study
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-zinc-200 p-4">
          <p className="text-xs text-zinc-500 uppercase tracking-wider">Total</p>
          <p className="text-2xl font-bold mt-1">{studies.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-4">
          <p className="text-xs text-zinc-500 uppercase tracking-wider">Published</p>
          <p className="text-2xl font-bold mt-1 text-green-600">{studies.filter(s => s.status === "published").length}</p>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-4">
          <p className="text-xs text-zinc-500 uppercase tracking-wider">Drafts</p>
          <p className="text-2xl font-bold mt-1 text-amber-600">{studies.filter(s => s.status === "draft").length}</p>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-4">
          <p className="text-xs text-zinc-500 uppercase tracking-wider">Featured</p>
          <p className="text-2xl font-bold mt-1 text-[#c79a2e]">{studies.filter(s => s.featured).length}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input placeholder="Search case studies..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-zinc-400"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-zinc-400">
            <Briefcase className="h-10 w-10 mx-auto mb-2 opacity-30" />
            <p>No case studies found. Create your first case study.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50 border-b border-zinc-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-zinc-600">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-zinc-600 hidden md:table-cell">Category</th>
                  <th className="text-left px-4 py-3 font-medium text-zinc-600">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-zinc-600 hidden lg:table-cell">Client</th>
                  <th className="text-right px-4 py-3 font-medium text-zinc-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filtered.map((study) => (
                  <tr key={study.id} className="hover:bg-zinc-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {study.featured && <Star className="h-3.5 w-3.5 text-[#f1c24e] fill-[#f1c24e]" />}
                        <div>
                          <p className="font-medium text-zinc-900 line-clamp-1">{study.name}</p>
                          <p className="text-xs text-zinc-400">{study.tagline}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <Badge variant="outline">{study.category}</Badge>
                      <span className="text-xs text-zinc-400 ml-1">{study.industry}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={study.status === "published" ? "bg-green-100 text-green-700" : study.status === "draft" ? "bg-amber-100 text-amber-700" : "bg-zinc-100 text-zinc-600"}>
                        {study.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-zinc-600">{study.client}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleToggleFeatured(study)} title="Toggle featured">
                          <Star className={`h-4 w-4 ${study.featured ? "text-[#f1c24e] fill-[#f1c24e]" : "text-zinc-400"}`} />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleTogglePublish(study.id)} title={study.status === "published" ? "Unpublish" : "Publish"}>
                          {study.status === "published" ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { setEditingStudy(study); setShowEditor(true); }} title="Edit">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:text-red-600" onClick={() => handleDelete(study.id)} title="Delete">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showEditor && (
        <CaseStudyEditor
          study={editingStudy}
          onClose={() => { setShowEditor(false); setEditingStudy(null); }}
          onSaved={() => { setShowEditor(false); setEditingStudy(null); fetchStudies(); }}
        />
      )}
    </div>
  );
}

function CaseStudyEditor({ study, onClose, onSaved }: { study: CaseStudyItem | null; onClose: () => void; onSaved: () => void }) {
  const [saving, setSaving] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [form, setForm] = React.useState({
    name: study?.name || "",
    slug: study?.slug || "",
    category: study?.category || "AI",
    industry: study?.industry || "Technology",
    tagline: study?.tagline || "",
    resultMetric: study?.resultMetric || "",
    description: "",
    challenge: "",
    approach: "",
    solution: "",
    results: "[]",
    imageUrl: study?.imageUrl || "",
    technologies: "[]",
    services: "[]",
    timeline: study?.timeline || "3 months",
    client: study?.client || "",
    status: study?.status || "draft",
    featured: study?.featured || false,
  });

  React.useEffect(() => {
    if (study) {
      fetch(`/api/cms/case-studies?status=all`).then(r => r.json()).then(data => {
        const full = data.studies?.find((s: any) => s.id === study.id);
        if (full) {
          setForm((prev) => ({
            ...prev,
            description: full.description || "",
            challenge: full.challenge || "",
            approach: full.approach || "",
            solution: full.solution || "",
            results: full.results || "[]",
            technologies: full.technologies || "[]",
            services: full.services || "[]",
            timeline: full.timeline || "3 months",
          }));
        }
      });
    }
  }, [study]);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/cms/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.ok) {
        setForm((prev) => ({ ...prev, imageUrl: data.url }));
        toast.success("Image uploaded");
      } else {
        toast.error(data.error || "Upload failed");
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.slug.trim() || !form.tagline.trim()) {
      toast.error("Name, slug, and tagline are required");
      return;
    }
    setSaving(true);
    try {
      const method = study ? "PATCH" : "POST";
      const body: any = { ...form };
      if (study) body.id = study.id;
      const res = await fetch("/api/cms/case-studies", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.ok) {
        toast.success(study ? "Case study updated" : "Case study created");
        onSaved();
      } else {
        toast.error(data.error || "Save failed");
      }
    } catch {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{study ? "Edit Case Study" : "New Case Study"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Company name" />
            </div>
            <div>
              <Label>Slug</Label>
              <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="url-slug" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Industry</Label>
              <Select value={form.industry} onValueChange={(v) => setForm({ ...form, industry: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {INDUSTRIES.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Tagline</Label>
            <Input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} placeholder="Short description" />
          </div>
          <div>
            <Label>Result Metric</Label>
            <Input value={form.resultMetric} onChange={(e) => setForm({ ...form, resultMetric: e.target.value })} placeholder="e.g. 32% reduction in stockouts" />
          </div>
          <div>
            <Label>Client</Label>
            <Input value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} placeholder="Client description" />
          </div>
          <div>
            <Label>Cover Image</Label>
            <div className="flex items-center gap-3">
              {form.imageUrl && <img src={form.imageUrl} alt="Cover" className="h-16 w-24 object-cover rounded" />}
              <label className="cursor-pointer">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-sm">
                  <Upload className="h-4 w-4" /> {uploading ? "Uploading..." : "Upload Image"}
                </span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} />
              </label>
              {form.imageUrl && <Button variant="ghost" size="sm" onClick={() => setForm({ ...form, imageUrl: "" })}>Remove</Button>}
            </div>
          </div>
          <div>
            <Label>Description</Label>
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} />
          </div>
          <div>
            <Label>Challenge</Label>
            <Textarea value={form.challenge} onChange={(e) => setForm({ ...form, challenge: e.target.value })} rows={3} />
          </div>
          <div>
            <Label>Approach</Label>
            <Textarea value={form.approach} onChange={(e) => setForm({ ...form, approach: e.target.value })} rows={3} />
          </div>
          <div>
            <Label>Solution</Label>
            <Textarea value={form.solution} onChange={(e) => setForm({ ...form, solution: e.target.value })} rows={3} />
          </div>
          <div>
            <Label>Results (JSON array)</Label>
            <Textarea value={form.results} onChange={(e) => setForm({ ...form, results: e.target.value })} placeholder='[{"value":"32%","label":"Reduction"}]' rows={3} className="font-mono text-xs" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Technologies (JSON array)</Label>
              <Textarea value={form.technologies} onChange={(e) => setForm({ ...form, technologies: e.target.value })} placeholder='["Next.js","Python"]' rows={2} className="font-mono text-xs" />
            </div>
            <div>
              <Label>Services (JSON array)</Label>
              <Textarea value={form.services} onChange={(e) => setForm({ ...form, services: e.target.value })} placeholder='["AI","Software"]' rows={2} className="font-mono text-xs" />
            </div>
          </div>
          <div>
            <Label>Timeline</Label>
            <Input value={form.timeline} onChange={(e) => setForm({ ...form, timeline: e.target.value })} placeholder="e.g. 5 months" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="featured" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
            <Label htmlFor="featured">Featured case study</Label>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving} className="bg-[#f1c24e] text-black hover:bg-[#e9b73a]">
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
              {study ? "Update" : "Create"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
