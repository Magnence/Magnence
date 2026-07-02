"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Eye, EyeOff, Upload, Loader2, FileText, Star, Search } from "lucide-react";
import { toast } from "sonner";
import { useAppStore } from "@/lib/store";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  authorName: string;
  authorRole: string;
  imageUrl: string | null;
  status: string;
  featured: boolean;
  createdAt: string;
  publishedAt: string | null;
}

const CATEGORIES = ["AI Engineering", "Software Development", "Web & Mobile", "Automation", "UI/UX Design", "Branding", "Marketing", "Video Editing", "3D & Rendering", "Business & Strategy"];

export function CMSBlogModule() {
  const { hasPermission } = useAppStore();
  const [posts, setPosts] = React.useState<BlogPost[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [filterStatus, setFilterStatus] = React.useState("all");
  const [filterCategory, setFilterCategory] = React.useState("all");
  const [editingPost, setEditingPost] = React.useState<BlogPost | null>(null);
  const [showEditor, setShowEditor] = React.useState(false);

  const canManage = hasPermission("cms-blog", "create") || hasPermission("cms-blog", "edit");

  const fetchPosts = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/cms/blog?status=${filterStatus}&category=${filterCategory}`);
      const data = await res.json();
      if (data.ok) setPosts(data.posts);
    } catch {
      toast.error("Failed to load blog posts");
    } finally {
      setLoading(false);
    }
  }, [filterStatus, filterCategory]);

  React.useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this blog post? This cannot be undone.")) return;
    try {
      await fetch("/api/cms/blog", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "delete" }),
      });
      toast.success("Post deleted");
      fetchPosts();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleTogglePublish = async (id: string) => {
    try {
      const res = await fetch("/api/cms/blog", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "toggle-publish" }),
      });
      const data = await res.json();
      if (data.ok) {
        toast.success(`Post ${data.status}`);
        fetchPosts();
      }
    } catch {
      toast.error("Toggle failed");
    }
  };

  const handleToggleFeatured = async (post: BlogPost) => {
    try {
      await fetch("/api/cms/blog", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: post.id, featured: !post.featured }),
      });
      toast.success(!post.featured ? "Marked as featured" : "Unfeatured");
      fetchPosts();
    } catch {
      toast.error("Update failed");
    }
  };

  const filtered = posts.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.authorName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6 text-[#f1c24e]" />
            Blog Posts
          </h1>
          <p className="text-sm text-zinc-500 mt-1">Manage website blog posts — create, edit, publish, and delete.</p>
        </div>
        {canManage && (
          <Button
            onClick={() => { setEditingPost(null); setShowEditor(true); }}
            className="bg-[#f1c24e] text-black hover:bg-[#e9b73a]"
          >
            <Plus className="h-4 w-4 mr-1" /> New Post
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-zinc-200 p-4">
          <p className="text-xs text-zinc-500 uppercase tracking-wider">Total Posts</p>
          <p className="text-2xl font-bold mt-1">{posts.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-4">
          <p className="text-xs text-zinc-500 uppercase tracking-wider">Published</p>
          <p className="text-2xl font-bold mt-1 text-green-600">{posts.filter(p => p.status === "published").length}</p>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-4">
          <p className="text-xs text-zinc-500 uppercase tracking-wider">Drafts</p>
          <p className="text-2xl font-bold mt-1 text-amber-600">{posts.filter(p => p.status === "draft").length}</p>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-4">
          <p className="text-xs text-zinc-500 uppercase tracking-wider">Featured</p>
          <p className="text-2xl font-bold mt-1 text-[#c79a2e]">{posts.filter(p => p.featured).length}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
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
            <FileText className="h-10 w-10 mx-auto mb-2 opacity-30" />
            <p>No blog posts found. Create your first post.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50 border-b border-zinc-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-zinc-600">Title</th>
                  <th className="text-left px-4 py-3 font-medium text-zinc-600 hidden md:table-cell">Category</th>
                  <th className="text-left px-4 py-3 font-medium text-zinc-600">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-zinc-600 hidden lg:table-cell">Author</th>
                  <th className="text-left px-4 py-3 font-medium text-zinc-600 hidden lg:table-cell">Date</th>
                  <th className="text-right px-4 py-3 font-medium text-zinc-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filtered.map((post) => (
                  <tr key={post.id} className="hover:bg-zinc-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {post.featured && <Star className="h-3.5 w-3.5 text-[#f1c24e] fill-[#f1c24e]" />}
                        <div>
                          <p className="font-medium text-zinc-900 line-clamp-1">{post.title}</p>
                          <p className="text-xs text-zinc-400">/{post.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell"><Badge variant="outline">{post.category}</Badge></td>
                    <td className="px-4 py-3">
                      <Badge className={post.status === "published" ? "bg-green-100 text-green-700" : post.status === "draft" ? "bg-amber-100 text-amber-700" : "bg-zinc-100 text-zinc-600"}>
                        {post.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-zinc-600">{post.authorName}</td>
                    <td className="px-4 py-3 hidden lg:table-cell text-zinc-400 text-xs">
                      {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleToggleFeatured(post)} title="Toggle featured">
                          <Star className={`h-4 w-4 ${post.featured ? "text-[#f1c24e] fill-[#f1c24e]" : "text-zinc-400"}`} />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleTogglePublish(post.id)} title={post.status === "published" ? "Unpublish" : "Publish"}>
                          {post.status === "published" ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { setEditingPost(post); setShowEditor(true); }} title="Edit">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:text-red-600" onClick={() => handleDelete(post.id)} title="Delete">
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
        <BlogEditor
          post={editingPost}
          onClose={() => { setShowEditor(false); setEditingPost(null); }}
          onSaved={() => { setShowEditor(false); setEditingPost(null); fetchPosts(); }}
        />
      )}
    </div>
  );
}

function BlogEditor({ post, onClose, onSaved }: { post: BlogPost | null; onClose: () => void; onSaved: () => void }) {
  const [saving, setSaving] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [form, setForm] = React.useState({
    title: post?.title || "",
    slug: post?.slug || "",
    excerpt: post?.excerpt || "",
    category: post?.category || "AI Engineering",
    content: "",
    authorName: post?.authorName || "Anurag Singh",
    authorRole: post?.authorRole || "CEO & Founder",
    imageUrl: post?.imageUrl || "",
    status: post?.status || "draft",
    featured: post?.featured || false,
    tags: "",
    seoTitle: "",
    seoDescription: "",
  });

  React.useEffect(() => {
    if (post) {
      fetch(`/api/cms/blog?status=all`).then(r => r.json()).then(data => {
        const full = data.posts?.find((p: any) => p.id === post.id);
        if (full) {
          setForm((prev) => ({
            ...prev,
            content: full.content || "",
            tags: full.tags || "",
            seoTitle: full.seoTitle || "",
            seoDescription: full.seoDescription || "",
          }));
        }
      });
    }
  }, [post]);

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
    if (!form.title.trim() || !form.slug.trim() || !form.excerpt.trim()) {
      toast.error("Title, slug, and excerpt are required");
      return;
    }
    setSaving(true);
    try {
      const method = post ? "PATCH" : "POST";
      const body: any = { ...form };
      if (post) body.id = post.id;
      const res = await fetch("/api/cms/blog", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.ok) {
        toast.success(post ? "Post updated" : "Post created");
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
          <DialogTitle>{post ? "Edit Post" : "New Blog Post"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Post title" />
            </div>
            <div>
              <Label>Slug</Label>
              <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="post-url-slug" />
            </div>
          </div>
          <div>
            <Label>Excerpt</Label>
            <Textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} placeholder="Short summary" rows={2} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Author Name</Label>
              <Input value={form.authorName} onChange={(e) => setForm({ ...form, authorName: e.target.value })} />
            </div>
            <div>
              <Label>Author Role</Label>
              <Input value={form.authorRole} onChange={(e) => setForm({ ...form, authorRole: e.target.value })} />
            </div>
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
              {form.imageUrl && (
                <Button variant="ghost" size="sm" onClick={() => setForm({ ...form, imageUrl: "" })}>Remove</Button>
              )}
            </div>
          </div>
          <div>
            <Label>Content (JSON array of sections)</Label>
            <Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder='[{"heading":"Intro","body":"..."}]' rows={6} className="font-mono text-xs" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="featured" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
            <Label htmlFor="featured">Featured post</Label>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving} className="bg-[#f1c24e] text-black hover:bg-[#e9b73a]">
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
              {post ? "Update" : "Create"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
