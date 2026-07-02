"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { toast } from "sonner";
import { HeartHandshake, Building2, FileText, DollarSign, Users, RefreshCw, ArrowRight } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { timeAgo } from "./dashboard";

const initials = (n: string) => n.split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase();

export function ClientsModule() {
  const { setActiveModule } = useAppStore();
  const [clients, setClients] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selected, setSelected] = React.useState<any | null>(null);
  const [sheetOpen, setSheetOpen] = React.useState(false);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/crm/companies?isClient=true");
      const data = await res.json();
      setClients(data.companies || []);
    } finally { setLoading(false); }
  }, []);

  React.useEffect(() => { load(); }, [load]);

  const openClient = (c: any) => { setSelected(c); setSheetOpen(true); };

  const totalRevenue = clients.reduce((s, c) => s + (c.revenue || 0), 0);
  const totalContracts = clients.reduce((s, c) => s + (c._count?.contracts || 0), 0);
  const totalDeals = clients.reduce((s, c) => s + (c._count?.deals || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div><h2 className="text-2xl font-bold text-black">Clients</h2><p className="text-sm text-zinc-600 mt-1">Client lifecycle management — profiles, portal, communication, and history.</p></div>
        <Button variant="outline" onClick={load} className="border-zinc-300"><RefreshCw className="h-4 w-4 mr-1.5" />Refresh</Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiTile icon={HeartHandshake} label="Total Clients" value={clients.length} accent="#16a34a" />
        <KpiTile icon={Users} label="Total Contacts" value={clients.reduce((s, c) => s + (c._count?.contacts || 0), 0)} accent="#0891b2" />
        <KpiTile icon={FileText} label="Active Contracts" value={totalContracts} accent="#7c3aed" />
        <KpiTile icon={DollarSign} label="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} accent="#c79a2e" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? <div className="col-span-full text-center py-12 text-zinc-500">Loading...</div> : clients.length === 0 ? (
          <div className="col-span-full text-center py-12"><HeartHandshake className="h-10 w-10 mx-auto text-zinc-300 mb-3" /><p className="text-zinc-600 font-medium">No clients yet</p><p className="text-sm text-zinc-500 mt-1">Convert leads to clients from the CRM module.</p><Button onClick={() => setActiveModule("crm")} className="mt-4 bg-[#f1c24e] text-black hover:bg-[#e9b73a] font-semibold">Go to CRM <ArrowRight className="h-4 w-4 ml-1" /></Button></div>
        ) : (
          clients.map((c) => (
            <Card key={c.id} className="border-zinc-200 hover:border-[#f1c24e] cursor-pointer transition" onClick={() => openClient(c)}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="h-10 w-10 rounded-lg bg-green-50 flex items-center justify-center"><Building2 className="h-5 w-5 text-green-600" /></div>
                  <Badge variant="secondary" className="text-[10px] bg-green-100 text-green-700">Active Client</Badge>
                </div>
                <h3 className="font-semibold text-base mb-1">{c.name}</h3>
                <div className="text-xs text-zinc-500">{c.industry || "—"} · {c.size || "unknown size"}</div>
                {c.email && <div className="text-xs text-zinc-500 mt-2">{c.email}</div>}
                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-zinc-100 text-xs text-zinc-500">
                  <span>{c._count?.contacts || 0} contacts</span>
                  <span>{c._count?.deals || 0} deals</span>
                  <span>{c._count?.invoices || 0} invoices</span>
                  <span>{c._count?.contracts || 0} contracts</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className="magnence-soft-bg border border-[#f1c24e]/30 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div><h3 className="font-semibold text-black">AI Client Intelligence</h3><p className="text-sm text-zinc-600 mt-1">Get client health scores, churn predictions, and relationship insights from the Client AI.</p></div>
        <Button onClick={() => setActiveModule("assistant")} className="bg-[#f1c24e] text-black hover:bg-[#e9b73a] font-semibold">Ask Client AI</Button>
      </div>

      <ClientDetailSheet open={sheetOpen} onOpenChange={setSheetOpen} client={selected} />
    </div>
  );
}

function KpiTile({ icon: Icon, label, value, accent }: { icon: React.ElementType; label: string; value: string | number; accent: string }) {
  return <Card className="border-zinc-200"><CardContent className="p-4"><div className="h-9 w-9 rounded-lg flex items-center justify-center mb-2" style={{ background: `${accent}15`, color: accent }}><Icon className="h-4.5 w-4.5" /></div><div className="text-2xl font-bold">{value}</div><div className="text-xs text-zinc-500">{label}</div></CardContent></Card>;
}

function ClientDetailSheet({ open, onOpenChange, client }: { open: boolean; onOpenChange: (v: boolean) => void; client: any }) {
  if (!client) return null;
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[560px] overflow-y-auto thin-scroll">
        <SheetHeader>
          <SheetTitle className="text-xl pt-2">{client.name}</SheetTitle>
          <SheetDescription>{client.industry || "—"} · {client.size || "unknown size"}</SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Info label="Email" value={client.email || "—"} />
            <Info label="Phone" value={client.phone || "—"} />
            <Info label="Location" value={[client.city, client.country].filter(Boolean).join(", ") || "—"} />
            <Info label="Revenue" value={client.revenue ? `$${client.revenue.toLocaleString()}` : "—"} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Contacts" value={client._count?.contacts || 0} />
            <Stat label="Deals" value={client._count?.deals || 0} />
            <Stat label="Invoices" value={client._count?.invoices || 0} />
            <Stat label="Contracts" value={client._count?.contracts || 0} />
          </div>
          {client.notes && <div><div className="text-xs font-semibold text-zinc-500 uppercase mb-1">Internal Notes</div><div className="text-sm text-zinc-700 bg-zinc-50 p-3 rounded-md border border-zinc-100">{client.notes}</div></div>}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="bg-zinc-50 rounded-lg p-3 border border-zinc-100"><div className="text-xs text-zinc-500">{label}</div><div className="font-semibold mt-0.5 text-sm truncate">{value}</div></div>;
}

function Stat({ label, value }: { label: string; value: number }) {
  return <div className="bg-[#fef8e7] rounded-lg p-3 border border-[#f1c24e]/20"><div className="text-xs text-[#8a6d1f]">{label}</div><div className="text-2xl font-bold text-black mt-0.5">{value}</div></div>;
}
