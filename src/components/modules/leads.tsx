"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Users, Search, Mail, Phone, Building2, Calendar, DollarSign, Clock, MessageSquare, Loader2 } from "lucide-react";

interface Lead {
  id: string;
  fullName: string;
  email: string;
  company: string | null;
  phone: string | null;
  service: string;
  budget: string;
  timeline: string;
  callTiming: string | null;
  message: string;
  status: string;
  source: string;
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-amber-100 text-amber-700",
  qualified: "bg-purple-100 text-purple-700",
  won: "bg-green-100 text-green-700",
  lost: "bg-red-100 text-red-700",
};

const STATUS_LABELS: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  won: "Won",
  lost: "Lost",
};

export function LeadsModule() {
  const [leads, setLeads] = React.useState<Lead[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [filterStatus, setFilterStatus] = React.useState("all");
  const [selected, setSelected] = React.useState<Lead | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/contact?status=${filterStatus}`);
      const data = await res.json();
      setLeads(data.leads || []);
    } catch {
      toast.error("Failed to load leads");
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  React.useEffect(() => { load(); }, [load]);

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch("/api/contact", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      toast.success(`Lead marked as ${STATUS_LABELS[status] || status}`);
      load();
    } catch {
      toast.error("Update failed");
    }
  };

  const filtered = leads.filter(l =>
    l.fullName.toLowerCase().includes(search.toLowerCase()) ||
    l.email.toLowerCase().includes(search.toLowerCase()) ||
    (l.company || "").toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === "new").length,
    contacted: leads.filter(l => l.status === "contacted").length,
    won: leads.filter(l => l.status === "won").length,
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Users className="h-6 w-6 text-[#f1c24e]" />
          Leads
        </h1>
        <p className="text-sm text-zinc-500 mt-1">Contact form submissions from the website and bot.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-zinc-200"><CardContent className="p-4">
          <p className="text-xs text-zinc-500 uppercase tracking-wider">Total Leads</p>
          <p className="text-2xl font-bold mt-1">{stats.total}</p>
        </CardContent></Card>
        <Card className="border-zinc-200"><CardContent className="p-4">
          <p className="text-xs text-zinc-500 uppercase tracking-wider">New</p>
          <p className="text-2xl font-bold mt-1 text-blue-600">{stats.new}</p>
        </CardContent></Card>
        <Card className="border-zinc-200"><CardContent className="p-4">
          <p className="text-xs text-zinc-500 uppercase tracking-wider">Contacted</p>
          <p className="text-2xl font-bold mt-1 text-amber-600">{stats.contacted}</p>
        </CardContent></Card>
        <Card className="border-zinc-200"><CardContent className="p-4">
          <p className="text-xs text-zinc-500 uppercase tracking-wider">Won</p>
          <p className="text-2xl font-bold mt-1 text-green-600">{stats.won}</p>
        </CardContent></Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input placeholder="Search leads..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="qualified">Qualified</SelectItem>
            <SelectItem value="won">Won</SelectItem>
            <SelectItem value="lost">Lost</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Leads list */}
      {loading ? (
        <div className="text-center py-12"><Loader2 className="h-6 w-6 animate-spin mx-auto text-zinc-400" /></div>
      ) : filtered.length === 0 ? (
        <Card className="border-zinc-200"><CardContent className="p-12 text-center text-zinc-400">
          <Users className="h-10 w-10 mx-auto mb-2 opacity-30" />
          <p>No leads yet. Leads from the website contact form will appear here.</p>
        </CardContent></Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((lead) => (
            <Card key={lead.id} className="border-zinc-200 hover:border-[#f1c24e] cursor-pointer transition-colors" onClick={() => setSelected(lead)}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-zinc-900">{lead.fullName}</p>
                      <Badge className={STATUS_COLORS[lead.status] || "bg-zinc-100 text-zinc-600"}>{STATUS_LABELS[lead.status] || lead.status}</Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500">
                      <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{lead.email}</span>
                      {lead.company && <span className="flex items-center gap-1"><Building2 className="h-3 w-3" />{lead.company}</span>}
                      <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />{lead.budget}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{lead.timeline}</span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1 line-clamp-1">{lead.message}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-xs text-zinc-400 hidden sm:block">{new Date(lead.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Lead detail dialog */}
      {selected && (
        <Dialog open onOpenChange={() => setSelected(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selected.fullName}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm"><Mail className="h-4 w-4 text-zinc-400" />{selected.email}</div>
                {selected.phone && <div className="flex items-center gap-2 text-sm"><Phone className="h-4 w-4 text-zinc-400" />{selected.phone}</div>}
                {selected.company && <div className="flex items-center gap-2 text-sm"><Building2 className="h-4 w-4 text-zinc-400" />{selected.company}</div>}
                <div className="flex items-center gap-2 text-sm"><Calendar className="h-4 w-4 text-zinc-400" />{new Date(selected.createdAt).toLocaleString()}</div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div><p className="text-xs text-zinc-400 uppercase">Service</p><p className="text-sm font-medium">{selected.service}</p></div>
                <div><p className="text-xs text-zinc-400 uppercase">Budget</p><p className="text-sm font-medium">{selected.budget}</p></div>
                <div><p className="text-xs text-zinc-400 uppercase">Timeline</p><p className="text-sm font-medium">{selected.timeline}</p></div>
              </div>
              {selected.callTiming && <div><p className="text-xs text-zinc-400 uppercase">Preferred Call Time</p><p className="text-sm font-medium">{selected.callTiming}</p></div>}
              <div>
                <p className="text-xs text-zinc-400 uppercase mb-1">Message</p>
                <div className="bg-zinc-50 rounded-lg p-3 text-sm text-zinc-700">{selected.message}</div>
              </div>
              <div>
                <p className="text-xs text-zinc-400 uppercase mb-2">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(STATUS_LABELS).map(([value, label]) => (
                    <Button
                      key={value}
                      size="sm"
                      variant={selected.status === value ? "default" : "outline"}
                      className={selected.status === value ? "bg-[#f1c24e] text-black" : ""}
                      onClick={() => { updateStatus(selected.id, value); setSelected({ ...selected, status: value }); }}
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
