"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Plus, Users, Building2, Phone, Mail, TrendingUp, RefreshCw, Trash2, ArrowRight, Target, DollarSign } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { timeAgo } from "./dashboard";

const initials = (n: string) => n.split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase();
const STATUS_COLORS: Record<string, string> = { lead: "#52525b", prospect: "#0891b2", active_client: "#16a34a", inactive: "#dc2626" };

export function CrmModule() {
  const { setActiveModule } = useAppStore();
  const [companies, setCompanies] = React.useState<any[]>([]);
  const [deals, setDeals] = React.useState<any[]>([]);
  const [contacts, setContacts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showNew, setShowNew] = React.useState(false);
  const [showNewDeal, setShowNewDeal] = React.useState(false);
  const [showNewContact, setShowNewContact] = React.useState(false);
  const [selected, setSelected] = React.useState<any | null>(null);
  const [sheetOpen, setSheetOpen] = React.useState(false);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const [cRes, dRes, ctRes] = await Promise.all([fetch("/api/crm/companies"), fetch("/api/crm/deals"), fetch("/api/crm/contacts")]);
      const [c, d, ct] = await Promise.all([cRes.json(), dRes.json(), ctRes.json()]);
      setCompanies(c.companies || []);
      setDeals(d.deals || []);
      setContacts(ct.contacts || []);
    } finally { setLoading(false); }
  }, []);

  React.useEffect(() => { load(); }, [load]);

  const openCompany = (c: any) => { setSelected(c); setSheetOpen(true); };

  const convertToClient = async (c: any) => {
    await fetch("/api/crm/companies", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: c.id, action: "convert_to_client" }) });
    toast.success(`${c.name} is now a client`);
    load();
  };

  const totalPipeline = deals.filter((d) => !["won", "lost"].includes(d.stage)).reduce((s, d) => s + d.value, 0);
  const wonValue = deals.filter((d) => d.stage === "won").reduce((s, d) => s + d.value, 0);
  const clientCount = companies.filter((c) => c.isClient).length;
  const leadCount = companies.filter((c) => !c.isClient).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div><h2 className="text-2xl font-bold text-black">CRM</h2><p className="text-sm text-zinc-600 mt-1">Lead → Contact → Deal → Client. Manage the full customer lifecycle.</p></div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={load} className="border-zinc-300"><RefreshCw className="h-4 w-4 mr-1.5" />Refresh</Button>
          <Button variant="outline" onClick={() => setShowNewContact(true)} className="border-zinc-300"><Plus className="h-4 w-4 mr-1.5" />Contact</Button>
          <Button variant="outline" onClick={() => setShowNewDeal(true)} className="border-zinc-300"><Plus className="h-4 w-4 mr-1.5" />Deal</Button>
          <Button onClick={() => setShowNew(true)} className="bg-[#f1c24e] text-black hover:bg-[#e9b73a] font-semibold"><Plus className="h-4 w-4 mr-1.5" />Company</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiTile icon={Building2} label="Total Companies" value={companies.length} accent="#0891b2" />
        <KpiTile icon={Users} label="Leads" value={leadCount} accent="#7c3aed" />
        <KpiTile icon={HeartHandshake} label="Clients" value={clientCount} accent="#16a34a" />
        <KpiTile icon={DollarSign} label="Pipeline Value" value={`$${(totalPipeline / 1000).toFixed(0)}k`} accent="#c79a2e" />
      </div>

      <Tabs defaultValue="companies">
        <TabsList>
          <TabsTrigger value="companies">Companies ({companies.length})</TabsTrigger>
          <TabsTrigger value="deals">Deals ({deals.length})</TabsTrigger>
          <TabsTrigger value="contacts">Contacts ({contacts.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="companies" className="space-y-3 mt-4">
          {loading ? <div className="text-center py-8 text-zinc-500">Loading...</div> : companies.length === 0 ? (
            <div className="text-center py-12"><Building2 className="h-10 w-10 mx-auto text-zinc-300 mb-3" /><p className="text-zinc-600 font-medium">No companies yet</p></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {companies.map((c) => (
                <Card key={c.id} className="border-zinc-200 hover:border-[#f1c24e] cursor-pointer transition" onClick={() => openCompany(c)}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="h-10 w-10 rounded-lg bg-[#fef8e7] flex items-center justify-center"><Building2 className="h-5 w-5 text-[#c79a2e]" /></div>
                      <Badge variant="secondary" className="text-[10px]" style={{ background: `${STATUS_COLORS[c.status] || "#52525b"}20`, color: STATUS_COLORS[c.status] || "#52525b" }}>{c.status.replace("_", " ")}</Badge>
                    </div>
                    <h3 className="font-semibold text-sm">{c.name}</h3>
                    <div className="text-xs text-zinc-500 mt-1">{c.industry || "—"} · {c.size || "unknown size"}</div>
                    <div className="flex items-center gap-3 mt-2 text-xs text-zinc-500">
                      <span>{c._count?.deals || 0} deals</span>
                      <span>{c._count?.contacts || 0} contacts</span>
                      {c.isClient && <Badge variant="secondary" className="text-[10px] bg-green-100 text-green-700">Client</Badge>}
                    </div>
                    {c.owner && <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-zinc-100"><Avatar className="h-5 w-5"><AvatarFallback style={{ background: c.owner.avatarColor, color: "#fff" }} className="text-[9px]">{initials(c.owner.name)}</AvatarFallback></Avatar><span className="text-[10px] text-zinc-500">{c.owner.name}</span></div>}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="deals" className="space-y-3 mt-4">
          <Card className="border-zinc-200"><CardContent className="p-0">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-xs text-zinc-500 border-b border-zinc-100"><th className="p-4 font-medium">Deal</th><th className="p-4 font-medium">Company</th><th className="p-4 font-medium">Value</th><th className="p-4 font-medium">Stage</th><th className="p-4 font-medium">Probability</th><th className="p-4 font-medium">Close Date</th></tr></thead>
              <tbody>
                {deals.map((d) => (
                  <tr key={d.id} className="border-b border-zinc-50 hover:bg-zinc-50">
                    <td className="p-4 font-medium">{d.title}</td>
                    <td className="p-4 text-zinc-700">{d.company?.name}</td>
                    <td className="p-4 font-semibold">${d.value.toLocaleString()}</td>
                    <td className="p-4"><Badge variant="secondary" className="text-[10px] capitalize">{d.stage.replace("_", " ")}</Badge></td>
                    <td className="p-4"><div className="flex items-center gap-2"><div className="w-16 h-1.5 bg-zinc-200 rounded-full overflow-hidden"><div className="h-full bg-[#f1c24e]" style={{ width: `${d.probability}%` }} /></div><span className="text-xs">{d.probability}%</span></div></td>
                    <td className="p-4 text-xs text-zinc-500">{d.expectedCloseDate ? new Date(d.expectedCloseDate).toLocaleDateString() : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="contacts" className="space-y-3 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {contacts.map((c) => (
              <Card key={c.id} className="border-zinc-200">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10"><AvatarFallback style={{ background: "#f1c24e", color: "#000" }} className="text-xs font-bold">{initials(`${c.firstName} ${c.lastName}`)}</AvatarFallback></Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm">{c.firstName} {c.lastName}</div>
                      <div className="text-xs text-zinc-500">{c.title || "—"}</div>
                      <div className="text-xs text-zinc-500 mt-1">{c.company?.name}</div>
                      {c.email && <div className="flex items-center gap-1 text-xs text-zinc-500 mt-1"><Mail className="h-3 w-3" />{c.email}</div>}
                      {c.phone && <div className="flex items-center gap-1 text-xs text-zinc-500"><Phone className="h-3 w-3" />{c.phone}</div>}
                      {c.isPrimary && <Badge variant="secondary" className="text-[10px] mt-2 bg-[#fef8e7] text-[#8a6d1f]">Primary Contact</Badge>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="magnence-soft-bg border border-[#f1c24e]/30 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div><h3 className="font-semibold text-black">AI-powered CRM insights</h3><p className="text-sm text-zinc-600 mt-1">Ask the CRM AI to score leads, suggest follow-ups, and predict deal outcomes.</p></div>
        <Button onClick={() => setActiveModule("assistant")} className="bg-[#f1c24e] text-black hover:bg-[#e9b73a] font-semibold">Ask CRM AI</Button>
      </div>

      <NewCompanyDialog open={showNew} onOpenChange={setShowNew} onCreated={() => { setShowNew(false); load(); toast.success("Company created"); }} />
      <NewDealDialog open={showNewDeal} onOpenChange={setShowNewDeal} companies={companies} onCreated={() => { setShowNewDeal(false); load(); toast.success("Deal created"); }} />
      <NewContactDialog open={showNewContact} onOpenChange={setShowNewContact} companies={companies} onCreated={() => { setShowNewContact(false); load(); toast.success("Contact created"); }} />
      <CompanyDetailSheet open={sheetOpen} onOpenChange={setSheetOpen} company={selected} deals={deals} contacts={contacts} onConvert={convertToClient} onGoToClients={() => setActiveModule("clients")} />
    </div>
  );
}

function KpiTile({ icon: Icon, label, value, accent }: { icon: React.ElementType; label: string; value: string | number; accent: string }) {
  return <Card className="border-zinc-200"><CardContent className="p-4"><div className="h-9 w-9 rounded-lg flex items-center justify-center mb-2" style={{ background: `${accent}15`, color: accent }}><Icon className="h-4.5 w-4.5" /></div><div className="text-2xl font-bold">{value}</div><div className="text-xs text-zinc-500">{label}</div></CardContent></Card>;
}

function HeartHandshake({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>;
}

function NewCompanyDialog({ open, onOpenChange, onCreated }: { open: boolean; onOpenChange: (v: boolean) => void; onCreated: () => void }) {
  const [name, setName] = React.useState("");
  const [industry, setIndustry] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [size, setSize] = React.useState("small");
  const [source, setSource] = React.useState("website");
  const [isClient, setIsClient] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const submit = async () => {
    if (!name.trim()) { toast.error("Name required"); return; }
    setSubmitting(true);
    try {
      const res = await fetch("/api/crm/companies", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, industry, email, phone, size, source, isClient }) });
      if (!res.ok) throw new Error("Failed");
      setName(""); setIndustry(""); setEmail(""); setPhone("");
      onCreated();
    } catch { toast.error("Failed"); } finally { setSubmitting(false); }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader><DialogTitle>New Company</DialogTitle><DialogDescription>Add a lead or client company.</DialogDescription></DialogHeader>
        <div className="space-y-3 py-2">
          <div className="space-y-2"><Label>Name *</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Acme Corp" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2"><Label>Industry</Label><Input value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="e.g. Technology" /></div>
            <div className="space-y-2"><Label>Size</Label><Select value={size} onValueChange={setSize}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="startup">Startup</SelectItem><SelectItem value="small">Small</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="large">Large</SelectItem><SelectItem value="enterprise">Enterprise</SelectItem></SelectContent></Select></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2"><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
            <div className="space-y-2"><Label>Phone</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
          </div>
          <div className="space-y-2"><Label>Source</Label><Select value={source} onValueChange={setSource}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="website">Website</SelectItem><SelectItem value="referral">Referral</SelectItem><SelectItem value="ads">Ads</SelectItem><SelectItem value="event">Event</SelectItem><SelectItem value="cold_outreach">Cold Outreach</SelectItem></SelectContent></Select></div>
          <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" checked={isClient} onChange={(e) => setIsClient(e.target.checked)} />Already a client</label>
        </div>
        <DialogFooter><DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose><Button onClick={submit} disabled={submitting} className="bg-[#f1c24e] text-black hover:bg-[#e9b73a] font-semibold">{submitting ? "Creating..." : "Create"}</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function NewDealDialog({ open, onOpenChange, companies, onCreated }: { open: boolean; onOpenChange: (v: boolean) => void; companies: any[]; onCreated: () => void }) {
  const [title, setTitle] = React.useState("");
  const [companyId, setCompanyId] = React.useState("");
  const [value, setValue] = React.useState("10000");
  const [stage, setStage] = React.useState("new");
  const [probability, setProbability] = React.useState("10");
  const [submitting, setSubmitting] = React.useState(false);
  const submit = async () => {
    if (!title || !companyId) { toast.error("Title and company required"); return; }
    setSubmitting(true);
    try {
      const res = await fetch("/api/crm/deals", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title, companyId, value: Number(value), stage, probability: Number(probability) }) });
      if (!res.ok) throw new Error("Failed");
      setTitle(""); setValue("10000");
      onCreated();
    } catch { toast.error("Failed"); } finally { setSubmitting(false); }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader><DialogTitle>New Deal</DialogTitle><DialogDescription>Create a new deal in the pipeline.</DialogDescription></DialogHeader>
        <div className="space-y-3 py-2">
          <div className="space-y-2"><Label>Title *</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Annual subscription" /></div>
          <div className="space-y-2"><Label>Company *</Label><Select value={companyId} onValueChange={setCompanyId}><SelectTrigger><SelectValue placeholder="Select company" /></SelectTrigger><SelectContent>{companies.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select></div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2"><Label>Value ($)</Label><Input type="number" value={value} onChange={(e) => setValue(e.target.value)} /></div>
            <div className="space-y-2"><Label>Stage</Label><Select value={stage} onValueChange={setStage}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="new">New</SelectItem><SelectItem value="qualified">Qualified</SelectItem><SelectItem value="proposal">Proposal</SelectItem><SelectItem value="negotiation">Negotiation</SelectItem><SelectItem value="won">Won</SelectItem><SelectItem value="lost">Lost</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label>Prob (%)</Label><Input type="number" value={probability} onChange={(e) => setProbability(e.target.value)} /></div>
          </div>
        </div>
        <DialogFooter><DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose><Button onClick={submit} disabled={submitting} className="bg-[#f1c24e] text-black hover:bg-[#e9b73a] font-semibold">{submitting ? "Creating..." : "Create"}</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function NewContactDialog({ open, onOpenChange, companies, onCreated }: { open: boolean; onOpenChange: (v: boolean) => void; companies: any[]; onCreated: () => void }) {
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [companyId, setCompanyId] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const submit = async () => {
    if (!firstName || !companyId) { toast.error("First name and company required"); return; }
    setSubmitting(true);
    try {
      const res = await fetch("/api/crm/contacts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ firstName, lastName, email, phone, title, companyId }) });
      if (!res.ok) throw new Error("Failed");
      setFirstName(""); setLastName(""); setEmail(""); setPhone(""); setTitle("");
      onCreated();
    } catch { toast.error("Failed"); } finally { setSubmitting(false); }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader><DialogTitle>New Contact</DialogTitle><DialogDescription>Add a contact person to a company.</DialogDescription></DialogHeader>
        <div className="space-y-3 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2"><Label>First Name *</Label><Input value={firstName} onChange={(e) => setFirstName(e.target.value)} /></div>
            <div className="space-y-2"><Label>Last Name</Label><Input value={lastName} onChange={(e) => setLastName(e.target.value)} /></div>
          </div>
          <div className="space-y-2"><Label>Company *</Label><Select value={companyId} onValueChange={setCompanyId}><SelectTrigger><SelectValue placeholder="Select company" /></SelectTrigger><SelectContent>{companies.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-2"><Label>Title</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. CTO" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2"><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
            <div className="space-y-2"><Label>Phone</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
          </div>
        </div>
        <DialogFooter><DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose><Button onClick={submit} disabled={submitting} className="bg-[#f1c24e] text-black hover:bg-[#e9b73a] font-semibold">{submitting ? "Creating..." : "Create"}</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CompanyDetailSheet({ open, onOpenChange, company, deals, contacts, onConvert, onGoToClients }: { open: boolean; onOpenChange: (v: boolean) => void; company: any; deals: any[]; contacts: any[]; onConvert: (c: any) => void; onGoToClients: () => void }) {
  if (!company) return null;
  const companyDeals = deals.filter((d) => d.companyId === company.id);
  const companyContacts = contacts.filter((c) => c.companyId === company.id);
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[560px] overflow-y-auto thin-scroll">
        <SheetHeader>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs capitalize" style={{ background: `${STATUS_COLORS[company.status]}20`, color: STATUS_COLORS[company.status] }}>{company.status.replace("_", " ")}</Badge>
            {company.isClient && <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">Client</Badge>}
          </div>
          <SheetTitle className="text-xl pt-2">{company.name}</SheetTitle>
          <SheetDescription>{company.industry || "—"} · {company.size || "unknown size"}</SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Info label="Email" value={company.email || "—"} />
            <Info label="Phone" value={company.phone || "—"} />
            <Info label="Source" value={company.source || "—"} />
            <Info label="Revenue" value={company.revenue ? `$${company.revenue.toLocaleString()}` : "—"} />
          </div>
          {company.notes && <div><div className="text-xs font-semibold text-zinc-500 uppercase mb-1">Notes</div><div className="text-sm text-zinc-700">{company.notes}</div></div>}
          {!company.isClient && <Button onClick={() => onConvert(company)} className="w-full bg-[#f1c24e] text-black hover:bg-[#e9b73a] font-semibold"><ArrowRight className="h-4 w-4 mr-2" />Convert to Client</Button>}
          {company.isClient && <Button onClick={onGoToClients} variant="outline" className="w-full border-zinc-300">View in Clients</Button>}
          <div>
            <div className="text-xs font-semibold text-zinc-500 uppercase mb-2">Deals ({companyDeals.length})</div>
            <div className="space-y-2">{companyDeals.length === 0 ? <p className="text-xs text-zinc-400">No deals</p> : companyDeals.map((d) => (<div key={d.id} className="flex items-center justify-between p-2 rounded-md bg-zinc-50 border border-zinc-100"><div><div className="text-sm font-medium">{d.title}</div><div className="text-xs text-zinc-500 capitalize">{d.stage}</div></div><div className="font-semibold">${d.value.toLocaleString()}</div></div>))}</div>
          </div>
          <div>
            <div className="text-xs font-semibold text-zinc-500 uppercase mb-2">Contacts ({companyContacts.length})</div>
            <div className="space-y-2">{companyContacts.length === 0 ? <p className="text-xs text-zinc-400">No contacts</p> : companyContacts.map((c) => (<div key={c.id} className="flex items-center gap-2 p-2 rounded-md bg-zinc-50 border border-zinc-100"><Avatar className="h-7 w-7"><AvatarFallback style={{ background: "#f1c24e", color: "#000" }} className="text-[10px]">{initials(`${c.firstName} ${c.lastName}`)}</AvatarFallback></Avatar><div className="flex-1"><div className="text-sm font-medium">{c.firstName} {c.lastName}</div><div className="text-xs text-zinc-500">{c.title || "—"}</div></div></div>))}</div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="bg-zinc-50 rounded-lg p-3 border border-zinc-100"><div className="text-xs text-zinc-500">{label}</div><div className="font-semibold mt-0.5 text-sm truncate">{value}</div></div>;
}
