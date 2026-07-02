"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { toast } from "sonner";
import { Plus, UserCog, RefreshCw, Trash2, Edit, KeyRound, Shield, AlertTriangle } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { ROLE_TYPES, ROLE_LABELS, ROLE_STYLES } from "@/lib/constants";
import { timeAgo } from "./dashboard";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  title: string | null;
  avatarColor: string;
  status: string;
  emailVerified: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}

const initials = (n: string) => n.split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase();

export function AdminModule() {
  const { user, hasPermission } = useAppStore();
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showNew, setShowNew] = React.useState(false);
  const [selected, setSelected] = React.useState<User | null>(null);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [filterRole, setFilterRole] = React.useState("all");
  const canManage = hasPermission("admin", "create");

  const load = React.useCallback(async () => {
    if (!canManage) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (res.ok) setUsers(data.users || []);
    } finally { setLoading(false); }
  }, [canManage]);

  React.useEffect(() => { load(); }, [load]);

  if (!canManage) {
    return (
      <div className="space-y-6">
        <div><h2 className="text-2xl font-bold text-black">User Management</h2><p className="text-sm text-zinc-600 mt-1">Create, edit, and delete user accounts.</p></div>
        <Card className="border-zinc-200"><CardContent className="p-12 text-center"><Shield className="h-12 w-12 mx-auto text-zinc-300 mb-4" /><p className="font-semibold text-zinc-700">Access Restricted</p><p className="text-sm text-zinc-500 mt-1">Only Super Admins, Founders, and Admins can manage user accounts.</p></CardContent></Card>
      </div>
    );
  }

  const openUser = (u: User) => { setSelected(u); setSheetOpen(true); };

  const del = async (u: User) => {
    if (u.id === user?.id) { toast.error("Cannot delete your own account"); return; }
    if (!confirm(`Delete ${u.name}? This action cannot be undone.`)) return;
    try {
      const res = await fetch("/api/admin/users", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: u.id, action: "delete" }) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      toast.success("Account deleted");
      load();
    } catch (e) { toast.error((e as Error).message); }
  };

  const filtered = users.filter((u) => {
    if (filterRole !== "all" && u.role !== filterRole) return false;
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-black">User Management</h2>
          <p className="text-sm text-zinc-600 mt-1">Create, edit, and delete user accounts. Only company admins have access.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={load} className="border-zinc-300"><RefreshCw className="h-4 w-4 mr-1.5" />Refresh</Button>
          <Button onClick={() => setShowNew(true)} className="bg-[#f1c24e] text-black hover:bg-[#e9b73a] font-semibold"><Plus className="h-4 w-4 mr-1.5" />Create Account</Button>
        </div>
      </div>

      <div className="magnence-soft-bg border border-[#f1c24e]/30 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-[#c79a2e] shrink-0 mt-0.5" />
        <div className="text-sm text-zinc-700"><strong>Admin-only area.</strong> Only Super Admins, Founders, and Admins can create, edit, or delete accounts. All actions are recorded in the audit log.</div>
      </div>

      <Card className="border-zinc-200">
        <CardContent className="p-4 flex flex-wrap items-center gap-3">
          <Input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 min-w-[200px]" />
          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
            <SelectContent className="max-h-[300px]"><SelectItem value="all">All roles</SelectItem>{ROLE_TYPES.map((r) => <SelectItem key={r} value={r}>{ROLE_LABELS[r]}</SelectItem>)}</SelectContent>
          </Select>
          <Badge variant="secondary" className="bg-[#fef8e7] text-[#8a6d1f]">{filtered.length} users</Badge>
        </CardContent>
      </Card>

      <Card className="border-zinc-200">
        <CardContent className="p-0">
          {loading ? <div className="p-8 text-center text-zinc-500">Loading...</div> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="text-left text-xs text-zinc-500 border-b border-zinc-100"><th className="p-4 font-medium">User</th><th className="p-4 font-medium">Role</th><th className="p-4 font-medium">Department</th><th className="p-4 font-medium">Status</th><th className="p-4 font-medium">Last Login</th><th className="p-4 font-medium">Actions</th></tr></thead>
                <tbody>
                  {filtered.map((u) => (
                    <tr key={u.id} className="border-b border-zinc-50 hover:bg-zinc-50 group">
                      <td className="p-4"><div className="flex items-center gap-3"><Avatar className="h-9 w-9"><AvatarFallback style={{ background: u.avatarColor, color: "#fff" }} className="text-xs">{initials(u.name)}</AvatarFallback></Avatar><div><div className="font-medium">{u.name}</div><div className="text-xs text-zinc-500">{u.email}</div></div></div></td>
                      <td className="p-4"><Badge className={`${ROLE_STYLES[u.role] || "bg-zinc-100"} text-[10px]`}>{ROLE_LABELS[u.role] || u.role}</Badge></td>
                      <td className="p-4 text-zinc-700">{u.department}</td>
                      <td className="p-4"><Badge variant="secondary" className={`text-[10px] capitalize ${u.status === "active" ? "bg-green-100 text-green-700" : "bg-zinc-100 text-zinc-500"}`}>{u.status}</Badge></td>
                      <td className="p-4 text-xs text-zinc-500">{u.lastLoginAt ? timeAgo(u.lastLoginAt) : "Never"}</td>
                      <td className="p-4"><div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition"><button onClick={() => openUser(u)} className="p-1.5 rounded hover:bg-zinc-100 text-zinc-500"><Edit className="h-3.5 w-3.5" /></button>{u.id !== user?.id && <button onClick={() => del(u)} className="p-1.5 rounded hover:bg-red-50 text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>}</div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <NewUserDialog open={showNew} onOpenChange={setShowNew} onCreated={() => { setShowNew(false); load(); toast.success("Account created"); }} />
      <EditUserSheet open={sheetOpen} onOpenChange={setSheetOpen} user={selected} onUpdated={() => { load(); toast.success("Account updated"); }} />
    </div>
  );
}

function NewUserDialog({ open, onOpenChange, onCreated }: { open: boolean; onOpenChange: (v: boolean) => void; onCreated: () => void }) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [role, setRole] = React.useState("EMPLOYEE");
  const [department, setDepartment] = React.useState("General");
  const [title, setTitle] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const submit = async () => {
    if (!name || !email || !password) { toast.error("Name, email, and password required"); return; }
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, password, role, department, title }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setName(""); setEmail(""); setPassword(""); setTitle("");
      onCreated();
    } catch (e) { toast.error((e as Error).message); } finally { setSubmitting(false); }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader><DialogTitle>Create User Account</DialogTitle><DialogDescription>Admins can create accounts for new team members.</DialogDescription></DialogHeader>
        <div className="space-y-3 py-2">
          <div className="space-y-2"><Label>Name *</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div className="space-y-2"><Label>Email *</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <div className="space-y-2"><Label>Password *</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2"><Label>Role</Label><Select value={role} onValueChange={setRole}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent className="max-h-[300px]">{ROLE_TYPES.map((r) => <SelectItem key={r} value={r}>{ROLE_LABELS[r]}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-2"><Label>Department</Label><Input value={department} onChange={(e) => setDepartment(e.target.value)} /></div>
          </div>
          <div className="space-y-2"><Label>Title</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Senior Engineer" /></div>
        </div>
        <DialogFooter><DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose><Button onClick={submit} disabled={submitting} className="bg-[#f1c24e] text-black hover:bg-[#e9b73a] font-semibold">{submitting ? "Creating..." : "Create Account"}</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EditUserSheet({ open, onOpenChange, user, onUpdated }: { open: boolean; onOpenChange: (v: boolean) => void; user: User | null; onUpdated: () => void }) {
  const [name, setName] = React.useState("");
  const [role, setRole] = React.useState("");
  const [department, setDepartment] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [status, setStatus] = React.useState("active");
  const [newPassword, setNewPassword] = React.useState("");
  const [resetting, setResetting] = React.useState(false);

  React.useEffect(() => {
    if (user) { setName(user.name); setRole(user.role); setDepartment(user.department); setTitle(user.title || ""); setStatus(user.status); setNewPassword(""); }
  }, [user]);

  if (!user) return null;

  const save = async () => {
    try {
      const res = await fetch("/api/admin/users", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: user.id, name, role, department, title, status }) });
      if (!res.ok) throw new Error("Failed");
      onUpdated();
      onOpenChange(false);
    } catch { toast.error("Failed"); }
  };

  const resetPassword = async () => {
    if (!newPassword) { toast.error("Enter new password"); return; }
    setResetting(true);
    try {
      const res = await fetch("/api/admin/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "reset_password", userId: user.id, newPassword }) });
      if (!res.ok) throw new Error("Failed");
      toast.success("Password reset");
      setNewPassword("");
    } catch { toast.error("Failed"); } finally { setResetting(false); }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[480px] overflow-y-auto thin-scroll">
        <SheetHeader>
          <div className="flex items-center gap-2"><Badge className={`${ROLE_STYLES[user.role] || "bg-zinc-100"} text-[10px]`}>{ROLE_LABELS[user.role]}</Badge></div>
          <SheetTitle className="text-xl flex items-center gap-3 pt-2"><Avatar className="h-12 w-12"><AvatarFallback style={{ background: user.avatarColor, color: "#fff" }}>{initials(user.name)}</AvatarFallback></Avatar>{user.name}</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <div className="space-y-2"><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2"><Label>Role</Label><Select value={role} onValueChange={setRole}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent className="max-h-[300px]">{ROLE_TYPES.map((r) => <SelectItem key={r} value={r}>{ROLE_LABELS[r]}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-2"><Label>Status</Label><Select value={status} onValueChange={setStatus}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="away">Away</SelectItem><SelectItem value="suspended">Suspended</SelectItem><SelectItem value="archived">Archived</SelectItem></SelectContent></Select></div>
          </div>
          <div className="space-y-2"><Label>Department</Label><Input value={department} onChange={(e) => setDepartment(e.target.value)} /></div>
          <div className="space-y-2"><Label>Title</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
          <Button onClick={save} className="w-full bg-[#f1c24e] text-black hover:bg-[#e9b73a] font-semibold">Save Changes</Button>

          <div className="border-t border-zinc-200 pt-4">
            <div className="text-xs font-semibold text-zinc-500 uppercase mb-2 flex items-center gap-1"><KeyRound className="h-3 w-3" />Reset Password</div>
            <div className="flex gap-2"><Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New password" /><Button onClick={resetPassword} disabled={resetting} variant="outline" className="border-zinc-300">Reset</Button></div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
