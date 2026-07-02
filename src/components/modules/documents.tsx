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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  Plus,
  Folder,
  File as FileIcon,
  FileText,
  FileImage,
  FileSpreadsheet,
  FileCode,
  Upload,
  Download,
  Trash2,
  ChevronRight,
  RefreshCw,
  Share2,
  Lock,
  History,
  Sparkles,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { timeAgo } from "./dashboard";

interface Doc {
  id: string;
  name: string;
  type: string;
  mimeType: string | null;
  size: number;
  url: string | null;
  parentId: string | null;
  ownerId: string;
  isShared: boolean;
  tags: string | null;
  createdAt: string;
  updatedAt: string;
  owner: { id: string; name: string; avatarColor: string };
  _count: { versions: number; children: number };
  versions?: DocVersion[];
}

interface DocVersion {
  id: string;
  version: number;
  url: string | null;
  size: number;
  note: string | null;
  createdAt: string;
  uploadedBy: { id: string; name: string; avatarColor: string } | null;
}

const initials = (n: string) =>
  n.split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase();

const fileIcon = (mime?: string | null) => {
  if (!mime) return FileIcon;
  if (mime.startsWith("image/")) return FileImage;
  if (mime.includes("spreadsheet") || mime.includes("excel") || mime.includes("csv")) return FileSpreadsheet;
  if (mime.includes("code") || mime.includes("javascript") || mime.includes("typescript") || mime.includes("json") || mime.includes("markdown")) return FileCode;
  if (mime.includes("pdf") || mime.includes("document") || mime.includes("text")) return FileText;
  return FileIcon;
};

const formatSize = (bytes: number) => {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export function DocumentsModule() {
  const { hasPermission, setActiveModule } = useAppStore();
  const [documents, setDocuments] = React.useState<Doc[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [parentId, setParentId] = React.useState<string | null>(null);
  const [breadcrumbs, setBreadcrumbs] = React.useState<{ id: string; name: string }[]>([]);
  const [showNew, setShowNew] = React.useState(false);
  const [newType, setNewType] = React.useState<"folder" | "file">("folder");
  const [selected, setSelected] = React.useState<Doc | null>(null);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const canEdit = hasPermission("documents", "create");

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const url = parentId ? `/api/documents?parentId=${parentId}` : "/api/documents?parentId=null";
      const res = await fetch(url);
      const data = await res.json();
      setDocuments(data.documents || []);
    } finally {
      setLoading(false);
    }
  }, [parentId]);

  React.useEffect(() => {
    load();
  }, [load]);

  const openFolder = (doc: Doc) => {
    if (doc.type === "folder") {
      setParentId(doc.id);
      setBreadcrumbs([...breadcrumbs, { id: doc.id, name: doc.name }]);
    } else {
      // open file detail
      setSelected(doc);
      setSheetOpen(true);
    }
  };

  const navigateTo = (idx: number) => {
    if (idx === -1) {
      setParentId(null);
      setBreadcrumbs([]);
    } else {
      const target = breadcrumbs[idx];
      setParentId(target.id);
      setBreadcrumbs(breadcrumbs.slice(0, idx + 1));
    }
  };

  const toggleShare = async (doc: Doc) => {
    await fetch("/api/documents", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: doc.id, isShared: !doc.isShared }),
    });
    load();
    toast.success(doc.isShared ? "Made private" : "Shared with team");
  };

  const deleteDoc = async (doc: Doc) => {
    await fetch("/api/documents", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: doc.id, action: "delete" }),
    });
    load();
    toast.success("Deleted");
  };

  const folders = documents.filter((d) => d.type === "folder");
  const files = documents.filter((d) => d.type === "file");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-black">Documents</h2>
          <p className="text-sm text-zinc-600 mt-1">
            Upload, organize, share, and version files. AI-powered search & summary available.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={load} className="border-zinc-300">
            <RefreshCw className="h-4 w-4 mr-1.5" />
            Refresh
          </Button>
          {canEdit && (
            <>
              <Button
                variant="outline"
                onClick={() => { setNewType("folder"); setShowNew(true); }}
                className="border-[#f1c24e] text-black hover:bg-[#fef8e7]"
              >
                <Plus className="h-4 w-4 mr-1.5" />
                Folder
              </Button>
              <Button
                onClick={() => { setNewType("file"); setShowNew(true); }}
                className="bg-[#f1c24e] text-black hover:bg-[#e9b73a] font-semibold"
              >
                <Upload className="h-4 w-4 mr-1.5" />
                Upload
              </Button>
            </>
          )}
        </div>
      </div>

      {/* AI feature banner */}
      <div className="magnence-soft-bg border border-[#f1c24e]/30 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-lg bg-[#f1c24e] flex items-center justify-center shrink-0">
            <Sparkles className="h-4 w-4 text-black" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">AI Document Features</h3>
            <p className="text-xs text-zinc-600 mt-0.5">
              Search documents semantically, get summaries, and explain complex content with AI Assistant.
            </p>
          </div>
        </div>
        <Button
          size="sm"
          onClick={() => setActiveModule("assistant")}
          className="bg-[#f1c24e] text-black hover:bg-[#e9b73a] font-semibold shrink-0"
        >
          Ask AI
        </Button>
      </div>

      {/* Breadcrumbs */}
      <div className="flex items-center gap-1 text-sm">
        <button onClick={() => navigateTo(-1)} className="text-[#c79a2e] hover:underline font-medium">
          My Documents
        </button>
        {breadcrumbs.map((b, i) => (
          <div key={b.id} className="flex items-center gap-1">
            <ChevronRight className="h-3 w-3 text-zinc-400" />
            <button onClick={() => navigateTo(i)} className="text-[#c79a2e] hover:underline">
              {b.name}
            </button>
          </div>
        ))}
      </div>

      {/* Folders */}
      {folders.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-zinc-500 uppercase mb-2">Folders</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {folders.map((d) => (
              <button
                key={d.id}
                onClick={() => openFolder(d)}
                className="group flex flex-col items-center gap-2 p-4 rounded-xl border border-zinc-200 hover:border-[#f1c24e] hover:bg-[#fef8e7] transition"
              >
                <Folder className="h-10 w-10 text-[#c79a2e]" />
                <div className="text-sm font-medium text-center truncate w-full">{d.name}</div>
                <div className="text-[10px] text-zinc-400">
                  {d._count.children} items · {d.isShared ? "Shared" : "Private"}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Files */}
      {files.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-zinc-500 uppercase mb-2">Files</h3>
          <Card className="border-zinc-200">
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-zinc-500 border-b border-zinc-100">
                    <th className="p-4 font-medium">Name</th>
                    <th className="p-4 font-medium">Size</th>
                    <th className="p-4 font-medium">Owner</th>
                    <th className="p-4 font-medium">Modified</th>
                    <th className="p-4 font-medium">Visibility</th>
                    <th className="p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {files.map((f) => {
                    const Icon = fileIcon(f.mimeType);
                    return (
                      <tr key={f.id} className="border-b border-zinc-50 hover:bg-zinc-50 group">
                        <td className="p-4">
                          <button onClick={() => openFolder(f)} className="flex items-center gap-2 text-left">
                            <Icon className="h-5 w-5 text-zinc-500" />
                            <span className="font-medium hover:text-[#c79a2e]">{f.name}</span>
                          </button>
                        </td>
                        <td className="p-4 text-zinc-600">{formatSize(f.size)}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback style={{ background: f.owner.avatarColor, color: "#fff" }} className="text-[10px]">
                                {initials(f.owner.name)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-zinc-700">{f.owner.name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-xs text-zinc-500">{timeAgo(f.updatedAt)}</td>
                        <td className="p-4">
                          {f.isShared ? (
                            <Badge variant="secondary" className="text-[10px] bg-green-100 text-green-700">
                              <Share2 className="h-3 w-3 mr-1" />Shared
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-[10px]">
                              <Lock className="h-3 w-3 mr-1" />Private
                            </Badge>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1">
                            {canEdit && (
                              <button
                                onClick={() => toggleShare(f)}
                                className="p-1.5 rounded hover:bg-zinc-100 text-zinc-500"
                                title={f.isShared ? "Make private" : "Share"}
                              >
                                {f.isShared ? <Lock className="h-3.5 w-3.5" /> : <Share2 className="h-3.5 w-3.5" />}
                              </button>
                            )}
                            {f.url && (
                              <a
                                href={f.url}
                                download
                                className="p-1.5 rounded hover:bg-zinc-100 text-zinc-500"
                                title="Download"
                              >
                                <Download className="h-3.5 w-3.5" />
                              </a>
                            )}
                            {canEdit && (
                              <button
                                onClick={() => deleteDoc(f)}
                                className="p-1.5 rounded hover:bg-red-50 text-red-500"
                                title="Delete"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-zinc-500">Loading...</div>
      ) : folders.length === 0 && files.length === 0 ? (
        <div className="text-center py-12">
          <Folder className="h-10 w-10 mx-auto text-zinc-300 mb-3" />
          <p className="text-zinc-600 font-medium">No documents here</p>
          <p className="text-sm text-zinc-500 mt-1">Create a folder or upload a file.</p>
        </div>
      ) : null}

      <NewDocDialog
        open={showNew}
        onOpenChange={setShowNew}
        type={newType}
        parentId={parentId}
        onCreated={() => {
          setShowNew(false);
          load();
          toast.success(newType === "folder" ? "Folder created" : "File uploaded");
        }}
      />

      <FileDetailSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        doc={selected}
        onUpdated={load}
      />
    </div>
  );
}

function NewDocDialog({
  open,
  onOpenChange,
  type,
  parentId,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  type: "folder" | "file";
  parentId: string | null;
  onCreated: () => void;
}) {
  const [name, setName] = React.useState("");
  const [isShared, setIsShared] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const submit = async () => {
    if (!name.trim()) {
      toast.error("Name required");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          type,
          mimeType: type === "file" ? "application/octet-stream" : null,
          size: type === "file" ? Math.floor(Math.random() * 1000000) + 1000 : 0,
          url: type === "file" ? `/uploads/${name}` : null,
          parentId,
          isShared,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setName("");
      setIsShared(false);
      onCreated();
    } catch {
      toast.error("Failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>{type === "folder" ? "New Folder" : "Upload File"}</DialogTitle>
          <DialogDescription>
            {type === "folder" ? "Create a new folder to organize documents." : "Upload a new file (simulated for demo)."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="space-y-2">
            <Label>{type === "folder" ? "Folder name" : "File name"} *</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={type === "folder" ? "e.g. Q4 Reports" : "e.g. presentation.pdf"}
            />
          </div>
          <div className="flex items-center justify-between p-3 rounded-md bg-zinc-50 border border-zinc-200">
            <div>
              <div className="text-sm font-medium">Share with team</div>
              <div className="text-xs text-zinc-500">Visible to all company members</div>
            </div>
            <Switch checked={isShared} onCheckedChange={setIsShared} />
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
            {submitting ? "Creating..." : type === "folder" ? "Create Folder" : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function FileDetailSheet({
  open,
  onOpenChange,
  doc,
  onUpdated,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  doc: Doc | null;
  onUpdated: () => void;
}) {
  if (!doc) return null;
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[500px] overflow-y-auto thin-scroll">
        <SheetHeader>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-[#fef8e7] flex items-center justify-center">
              <FileIconRender mimeType={doc.mimeType} className="h-6 w-6 text-[#c79a2e]" />
            </div>
            <div>
              <SheetTitle className="text-base">{doc.name}</SheetTitle>
              <SheetDescription>
                {doc.mimeType || "File"} · {formatSize(doc.size)}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-zinc-50 rounded-lg p-3 border border-zinc-100">
              <div className="text-xs text-zinc-500">Owner</div>
              <div className="font-semibold text-sm flex items-center gap-2 mt-1">
                <Avatar className="h-5 w-5">
                  <AvatarFallback style={{ background: doc.owner.avatarColor, color: "#fff" }} className="text-[10px]">
                    {initials(doc.owner.name)}
                  </AvatarFallback>
                </Avatar>
                {doc.owner.name}
              </div>
            </div>
            <div className="bg-zinc-50 rounded-lg p-3 border border-zinc-100">
              <div className="text-xs text-zinc-500">Visibility</div>
              <div className="font-semibold text-sm mt-1">
                {doc.isShared ? "Shared with team" : "Private"}
              </div>
            </div>
            <div className="bg-zinc-50 rounded-lg p-3 border border-zinc-100">
              <div className="text-xs text-zinc-500">Created</div>
              <div className="font-semibold text-sm mt-1">
                {new Date(doc.createdAt).toLocaleDateString()}
              </div>
            </div>
            <div className="bg-zinc-50 rounded-lg p-3 border border-zinc-100">
              <div className="text-xs text-zinc-500">Last Modified</div>
              <div className="font-semibold text-sm mt-1">{timeAgo(doc.updatedAt)}</div>
            </div>
          </div>

          <div className="border-t border-zinc-200 pt-4">
            <div className="text-xs font-semibold text-zinc-500 uppercase mb-2 flex items-center gap-1">
              <History className="h-3 w-3" />
              Version History ({doc._count.versions})
            </div>
            <div className="text-xs text-zinc-500">
              {doc._count.versions} version{doc._count.versions !== 1 ? "s" : ""} recorded.
              Each upload creates a new version automatically.
            </div>
          </div>

          <div className="border-t border-zinc-200 pt-4">
            <div className="text-xs font-semibold text-zinc-500 uppercase mb-2">Tags</div>
            {doc.tags ? (
              <div className="flex flex-wrap gap-1.5">
                {doc.tags.split(",").map((t, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">{t.trim()}</Badge>
                ))}
              </div>
            ) : (
              <div className="text-xs text-zinc-400">No tags</div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/* eslint-disable react-hooks/static-components */
function FileIconRender({ mimeType, className }: { mimeType?: string | null; className?: string }) {
  const Icon = fileIcon(mimeType);
  return <Icon className={className} />;
}
/* eslint-enable react-hooks/static-components */

