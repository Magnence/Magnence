"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, FileSignature, RefreshCw, Trash2, AlertTriangle } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { timeAgo } from "./dashboard";

const STATUS_COLORS: Record<string, string> = { draft: "#52525b", review: "#0891b2", approved: "#7c3aed", signed: "#16a34a", active: "#16a34a", renewal: "#c79a2e", expired: "#dc2626", archived: "#7c3aed" };

export function ContractsModule() {
  const [contracts, setContracts] = React.useState<any[]>([]);
  const [stats, setStats] = React.useState<any>({});
  const [loading, setLoading] = React.useState(true);
  const [showNew, setShowNew] = React.useState(false);
  const [companies, setCompanies] = React.useState<any[]>([]);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/contracts");
      const data = await res.json();
      setContracts(data.contracts || []);
      setStats(data.stats || {});
    } finally { setLoading(false); }
  }, []);

  React.useEffect(() => {
    load();
    fetch("/api/crm/companies").then((r) => r.json()).then((d) => setCompanies(d.companies || [])).catch(() => {});
  }, [load]);

  const del = async (id: string) => {
    await fetch("/api/contracts", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, action: "delete" }) });
    load();
    toast.success("Contract deleted");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div><h2 className="text-2xl font-bold text-black">Contracts</h2><p className="text-sm text-zinc-600 mt-1">Contract repository with lifecycle, expiry tracking, and renewals.</p></div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={load} className="border-zinc-300"><RefreshCw className="h-4 w-4 mr-1.5" />Refresh</Button>
          <Button onClick={() => setShowNew(true)} className="bg-[#f1c24e] text-black hover:bg-[#e9b73a] font-semibold"><Plus className="h-4 w-4 mr-1.5" />New Contract</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiTile label="Total Contracts" value={stats.total || 0} accent="#0891b2" />
        <KpiTile label="Active" value={stats.active || 0} accent="#16a34a" />
        <KpiTile label="Expiring Soon" value={stats.expiringSoon || 0} accent="#dc2626" />
        <KpiTile label="Active Value" value={`$${(stats.totalValue || 0).toLocaleString()}`} accent="#c79a2e" />
      </div>

      {stats.expiringSoon > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600 shrink-0" />
          <div className="text-sm text-red-800"><strong>{stats.expiringSoon} contract(s) expiring within 30 days.</strong> Review and initiate renewal process.</div>
        </div>
      )}

      <Card className="border-zinc-200"><CardContent className="p-0">
        {loading ? <div className="p-8 text-center text-zinc-500">Loading...</div> : contracts.length === 0 ? (
          <div className="p-12 text-center"><FileSignature className="h-10 w-10 mx-auto text-zinc-300 mb-3" /><p className="text-zinc-600 font-medium">No contracts yet</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-xs text-zinc-500 border-b border-zinc-100"><th className="p-4 font-medium">Number</th><th className="p-4 font-medium">Title</th><th className="p-4 font-medium">Company</th><th className="p-4 font-medium">Type</th><th className="p-4 font-medium">Value</th><th className="p-4 font-medium">End Date</th><th className="p-4 font-medium">Status</th><th className="p-4"></th></tr></thead>
              <tbody>
                {contracts.map((c) => (
                  <tr key={c.id} className="border-b border-zinc-50 hover:bg-zinc-50 group">
                    <td className="p-4 font-mono text-xs">{c.number}</td>
                    <td className="p-4 font-medium">{c.title}</td>
                    <td className="p-4">{c.company?.name || "—"}</td>
                    <td className="p-4 capitalize">{c.type}</td>
                    <td className="p-4 font-semibold">${c.value.toLocaleString()}</td>
                    <td className="p-4 text-xs text-zinc-500">{c.endDate ? new Date(c.endDate).toLocaleDateString() : "—"}</td>
                    <td className="p-4"><Badge variant="secondary" className="text-[10px] capitalize" style={{ background: `${STATUS_COLORS[c.status]}20`, color: STATUS_COLORS[c.status] }}>{c.status}</Badge></td>
                    <td className="p-4"><button onClick={() => del(c.id)} className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-50 text-red-500"><Trash2 className="h-3.5 w-3.5" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent></Card>

      <NewContractDialog open={showNew} onOpenChange={setShowNew} companies={companies} onCreated={() => { setShowNew(false); load(); toast.success("Contract created"); }} />
    </div>
  );
}

function KpiTile({ label, value, accent }: { label: string; value: string | number; accent: string }) {
  return <Card className="border-zinc-200"><CardContent className="p-4"><div className="h-9 w-9 rounded-lg flex items-center justify-center mb-2" style={{ background: `${accent}15`, color: accent }}><FileSignature className="h-4.5 w-4.5" /></div><div className="text-2xl font-bold">{value}</div><div className="text-xs text-zinc-500">{label}</div></CardContent></Card>;
}

function NewContractDialog({ open, onOpenChange, companies, onCreated }: { open: boolean; onOpenChange: (v: boolean) => void; companies: any[]; onCreated: () => void }) {
  const [title, setTitle] = React.useState("");
  const [companyId, setCompanyId] = React.useState("");
  const [type, setType] = React.useState("service");
  const [value, setValue] = React.useState("10000");
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [terms, setTerms] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const submit = async () => {
    if (!title || !companyId) { toast.error("Title and company required"); return; }
    setSubmitting(true);
    try {
      const res = await fetch("/api/contracts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title, companyId, type, value: Number(value), startDate: startDate || null, endDate: endDate || null, terms }) });
      if (!res.ok) throw new Error("Failed");
      setTitle(""); setValue("10000"); setStartDate(""); setEndDate(""); setTerms("");
      onCreated();
    } catch { toast.error("Failed"); } finally { setSubmitting(false); }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader><DialogTitle>New Contract</DialogTitle><DialogDescription>Create a new contract.</DialogDescription></DialogHeader>
        <div className="space-y-3 py-2">
          <div className="space-y-2"><Label>Title *</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Annual Service Agreement" /></div>
          <div className="space-y-2"><Label>Company *</Label><Select value={companyId} onValueChange={setCompanyId}><SelectTrigger><SelectValue placeholder="Select company" /></SelectTrigger><SelectContent>{companies.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2"><Label>Type</Label><Select value={type} onValueChange={setType}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="nda">NDA</SelectItem><SelectItem value="msa">MSA</SelectItem><SelectItem value="sla">SLA</SelectItem><SelectItem value="service">Service</SelectItem><SelectItem value="subscription">Subscription</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label>Value ($)</Label><Input type="number" value={value} onChange={(e) => setValue(e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2"><Label>Start Date</Label><Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} /></div>
            <div className="space-y-2"><Label>End Date</Label><Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} /></div>
          </div>
          <div className="space-y-2"><Label>Terms</Label><Textarea value={terms} onChange={(e) => setTerms(e.target.value)} rows={3} /></div>
        </div>
        <DialogFooter><DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose><Button onClick={submit} disabled={submitting} className="bg-[#f1c24e] text-black hover:bg-[#e9b73a] font-semibold">{submitting ? "Creating..." : "Create"}</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
