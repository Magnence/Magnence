"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Plus, DollarSign, FileText, TrendingUp, TrendingDown, RefreshCw, Trash2, Check, X } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { timeAgo } from "./dashboard";

const STATUS_COLORS: Record<string, string> = { draft: "#52525b", sent: "#0891b2", paid: "#16a34a", partial: "#c79a2e", overdue: "#dc2626", cancelled: "#7c3aed" };
const EXPENSE_COLORS: Record<string, string> = { pending: "#c79a2e", approved: "#16a34a", rejected: "#dc2626", reimbursed: "#0891b2" };

export function FinanceModule() {
  const { hasPermission, setActiveModule } = useAppStore();
  const [invoices, setInvoices] = React.useState<any[]>([]);
  const [expenses, setExpenses] = React.useState<any[]>([]);
  const [invoiceTotals, setInvoiceTotals] = React.useState<any>({});
  const [expenseTotals, setExpenseTotals] = React.useState<any>({});
  const [loading, setLoading] = React.useState(true);
  const [showNewInvoice, setShowNewInvoice] = React.useState(false);
  const [showNewExpense, setShowNewExpense] = React.useState(false);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const [invRes, expRes] = await Promise.all([fetch("/api/finance/invoices"), fetch("/api/finance/expenses")]);
      const [inv, exp] = await Promise.all([invRes.json(), expRes.json()]);
      setInvoices(inv.invoices || []);
      setInvoiceTotals(inv.totals || {});
      setExpenses(exp.expenses || []);
      setExpenseTotals(exp.totals || {});
    } finally { setLoading(false); }
  }, []);

  React.useEffect(() => { load(); }, [load]);

  const approveExpense = async (id: string) => {
    await fetch("/api/finance/expenses", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status: "approved" }) });
    toast.success("Expense approved");
    load();
  };

  const canApprove = hasPermission("finance", "approve");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div><h2 className="text-2xl font-bold text-black">Finance</h2><p className="text-sm text-zinc-600 mt-1">Invoices, expenses, payments, and budgets.</p></div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={load} className="border-zinc-300"><RefreshCw className="h-4 w-4 mr-1.5" />Refresh</Button>
          <Button variant="outline" onClick={() => setShowNewExpense(true)} className="border-zinc-300"><Plus className="h-4 w-4 mr-1.5" />Expense</Button>
          <Button onClick={() => setShowNewInvoice(true)} className="bg-[#f1c24e] text-black hover:bg-[#e9b73a] font-semibold"><Plus className="h-4 w-4 mr-1.5" />Invoice</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiTile icon={TrendingUp} label="Total Revenue" value={`$${(invoiceTotals.total || 0).toLocaleString()}`} accent="#16a34a" />
        <KpiTile icon={DollarSign} label="Outstanding" value={`$${(invoiceTotals.outstanding || 0).toLocaleString()}`} accent="#c79a2e" />
        <KpiTile icon={TrendingDown} label="Total Expenses" value={`$${(expenseTotals.total || 0).toLocaleString()}`} accent="#dc2626" />
        <KpiTile icon={DollarSign} label="Net Profit" value={`$${((invoiceTotals.paid || 0) - (expenseTotals.total || 0)).toLocaleString()}`} accent="#0891b2" />
      </div>

      <Tabs defaultValue="invoices">
        <TabsList>
          <TabsTrigger value="invoices">Invoices ({invoices.length})</TabsTrigger>
          <TabsTrigger value="expenses">Expenses ({expenses.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="mt-4">
          <Card className="border-zinc-200"><CardContent className="p-0">
            {loading ? <div className="p-8 text-center text-zinc-500">Loading...</div> : invoices.length === 0 ? <div className="p-12 text-center"><FileText className="h-10 w-10 mx-auto text-zinc-300 mb-3" /><p className="text-zinc-600 font-medium">No invoices yet</p></div> : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="text-left text-xs text-zinc-500 border-b border-zinc-100"><th className="p-4 font-medium">Number</th><th className="p-4 font-medium">Company</th><th className="p-4 font-medium">Issue Date</th><th className="p-4 font-medium">Due Date</th><th className="p-4 font-medium">Total</th><th className="p-4 font-medium">Paid</th><th className="p-4 font-medium">Status</th></tr></thead>
                  <tbody>
                    {invoices.map((inv) => (
                      <tr key={inv.id} className="border-b border-zinc-50 hover:bg-zinc-50">
                        <td className="p-4 font-mono font-medium">{inv.number}</td>
                        <td className="p-4">{inv.company?.name || "—"}</td>
                        <td className="p-4 text-xs text-zinc-500">{new Date(inv.issueDate).toLocaleDateString()}</td>
                        <td className="p-4 text-xs text-zinc-500">{inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : "—"}</td>
                        <td className="p-4 font-semibold">${inv.total.toLocaleString()}</td>
                        <td className="p-4 text-green-600">${inv.paidAmount.toLocaleString()}</td>
                        <td className="p-4"><Badge variant="secondary" className="text-[10px] capitalize" style={{ background: `${STATUS_COLORS[inv.status]}20`, color: STATUS_COLORS[inv.status] }}>{inv.status}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="expenses" className="mt-4">
          <Card className="border-zinc-200"><CardContent className="p-0">
            {expenses.length === 0 ? <div className="p-12 text-center"><DollarSign className="h-10 w-10 mx-auto text-zinc-300 mb-3" /><p className="text-zinc-600 font-medium">No expenses yet</p></div> : (
              <div className="divide-y divide-zinc-100">
                {expenses.map((e) => (
                  <div key={e.id} className="p-4 hover:bg-zinc-50 flex items-center gap-3">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{e.description}</div>
                      <div className="text-xs text-zinc-500">{e.number} · {e.category} · by {e.user?.name}</div>
                    </div>
                    <div className="font-semibold">${e.amount.toLocaleString()}</div>
                    <Badge variant="secondary" className="text-[10px] capitalize" style={{ background: `${EXPENSE_COLORS[e.status]}20`, color: EXPENSE_COLORS[e.status] }}>{e.status}</Badge>
                    {canApprove && e.status === "pending" && <Button size="sm" variant="outline" onClick={() => approveExpense(e.id)} className="h-7 border-green-300 text-green-700"><Check className="h-3.5 w-3.5" /></Button>}
                  </div>
                ))}
              </div>
            )}
          </CardContent></Card>
        </TabsContent>
      </Tabs>

      <div className="magnence-soft-bg border border-[#f1c24e]/30 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div><h3 className="font-semibold text-black">AI Finance Insights</h3><p className="text-sm text-zinc-600 mt-1">Analyze expenses, forecast cash flow, and get budget suggestions from the Finance AI.</p></div>
        <Button onClick={() => setActiveModule("assistant")} className="bg-[#f1c24e] text-black hover:bg-[#e9b73a] font-semibold">Ask Finance AI</Button>
      </div>

      <NewInvoiceDialog open={showNewInvoice} onOpenChange={setShowNewInvoice} onCreated={() => { setShowNewInvoice(false); load(); toast.success("Invoice created"); }} />
      <NewExpenseDialog open={showNewExpense} onOpenChange={setShowNewExpense} onCreated={() => { setShowNewExpense(false); load(); toast.success("Expense submitted"); }} />
    </div>
  );
}

function KpiTile({ icon: Icon, label, value, accent }: { icon: React.ElementType; label: string; value: string | number; accent: string }) {
  return <Card className="border-zinc-200"><CardContent className="p-4"><div className="h-9 w-9 rounded-lg flex items-center justify-center mb-2" style={{ background: `${accent}15`, color: accent }}><Icon className="h-4.5 w-4.5" /></div><div className="text-2xl font-bold">{value}</div><div className="text-xs text-zinc-500">{label}</div></CardContent></Card>;
}

function NewInvoiceDialog({ open, onOpenChange, onCreated }: { open: boolean; onOpenChange: (v: boolean) => void; onCreated: () => void }) {
  const [number, setNumber] = React.useState("");
  const [total, setTotal] = React.useState("1000");
  const [dueDate, setDueDate] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const submit = async () => {
    if (!number.trim()) { toast.error("Invoice number required"); return; }
    setSubmitting(true);
    try {
      const res = await fetch("/api/finance/invoices", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ number, total: Number(total), dueDate: dueDate || null, subtotal: Number(total), notes }) });
      if (!res.ok) throw new Error("Failed");
      setNumber(""); setTotal("1000"); setDueDate(""); setNotes("");
      onCreated();
    } catch { toast.error("Failed"); } finally { setSubmitting(false); }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader><DialogTitle>New Invoice</DialogTitle><DialogDescription>Create a new invoice.</DialogDescription></DialogHeader>
        <div className="space-y-3 py-2">
          <div className="space-y-2"><Label>Invoice Number *</Label><Input value={number} onChange={(e) => setNumber(e.target.value)} placeholder="INV-001" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2"><Label>Total ($)</Label><Input type="number" value={total} onChange={(e) => setTotal(e.target.value)} /></div>
            <div className="space-y-2"><Label>Due Date</Label><Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} /></div>
          </div>
          <div className="space-y-2"><Label>Notes</Label><Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} /></div>
        </div>
        <DialogFooter><DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose><Button onClick={submit} disabled={submitting} className="bg-[#f1c24e] text-black hover:bg-[#e9b73a] font-semibold">{submitting ? "Creating..." : "Create"}</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function NewExpenseDialog({ open, onOpenChange, onCreated }: { open: boolean; onOpenChange: (v: boolean) => void; onCreated: () => void }) {
  const [description, setDescription] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [category, setCategory] = React.useState("other");
  const [notes, setNotes] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const submit = async () => {
    if (!description || !amount) { toast.error("Description and amount required"); return; }
    setSubmitting(true);
    try {
      const res = await fetch("/api/finance/expenses", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ description, amount: Number(amount), category, notes }) });
      if (!res.ok) throw new Error("Failed");
      setDescription(""); setAmount(""); setNotes("");
      onCreated();
    } catch { toast.error("Failed"); } finally { setSubmitting(false); }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader><DialogTitle>New Expense</DialogTitle><DialogDescription>Submit an expense for approval.</DialogDescription></DialogHeader>
        <div className="space-y-3 py-2">
          <div className="space-y-2"><Label>Description *</Label><Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g. Client lunch" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2"><Label>Amount ($) *</Label><Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} /></div>
            <div className="space-y-2"><Label>Category</Label><Select value={category} onValueChange={setCategory}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="travel">Travel</SelectItem><SelectItem value="meals">Meals</SelectItem><SelectItem value="office">Office</SelectItem><SelectItem value="software">Software</SelectItem><SelectItem value="hardware">Hardware</SelectItem><SelectItem value="training">Training</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent></Select></div>
          </div>
          <div className="space-y-2"><Label>Notes</Label><Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} /></div>
        </div>
        <DialogFooter><DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose><Button onClick={submit} disabled={submitting} className="bg-[#f1c24e] text-black hover:bg-[#e9b73a] font-semibold">{submitting ? "Submitting..." : "Submit"}</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
