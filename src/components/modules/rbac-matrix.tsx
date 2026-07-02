"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Lock, CheckCircle2, XCircle, Download } from "lucide-react";
import { useAppStore } from "@/lib/store";

const ACTION_COLORS: Record<string, string> = {
  view: "#0891b2", create: "#16a34a", edit: "#c79a2e", delete: "#dc2626",
  approve: "#7c3aed", reject: "#ea580c", assign: "#2563eb", export: "#0891b2",
  import: "#16a34a", share: "#7c3aed", upload: "#c79a2e", download: "#0891b2",
  print: "#52525b", archive: "#dc2626", restore: "#16a34a", configure: "#7c3aed", manage_permissions: "#dc2626",
};

export function RbacMatrixModule() {
  const { hasPermission } = useAppStore();
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [selectedRole, setSelectedRole] = React.useState("CHRO");

  React.useEffect(() => {
    (async () => {
      try { const res = await fetch("/api/rbac-matrix"); const d = await res.json(); setData(d); } finally { setLoading(false); }
    })();
  }, []);

  if (loading || !data) return <div className="text-center py-12 text-zinc-500">Loading RBAC matrix...</div>;

  // Handle error or missing matrix
  if (data.error || !data.matrix) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-black">RBAC Permission Matrix</h2>
          <p className="text-sm text-zinc-600 mt-1">Role-Based Access Control — view and verify permissions for every role across every module.</p>
        </div>
        <Card className="border-zinc-200">
          <CardContent className="p-12 text-center">
            <Shield className="h-12 w-12 mx-auto text-zinc-300 mb-4" />
            <p className="font-semibold text-zinc-700">Access Denied</p>
            <p className="text-sm text-zinc-500 mt-1">{data.error || "You don't have permission to view the RBAC matrix. Only Super Admins, Founders, and Admins can access this page."}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const role = data.matrix.find((r: any) => r.role === selectedRole);
  if (!role) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-black">RBAC Permission Matrix</h2>
          <p className="text-sm text-zinc-600 mt-1">Role-Based Access Control — view and verify permissions for every role across every module.</p>
        </div>
        <Select value={selectedRole} onValueChange={setSelectedRole}>
          <SelectTrigger className="w-[240px]"><SelectValue /></SelectTrigger>
          <SelectContent className="max-h-[300px]">{data.roles.map((r: string) => <SelectItem key={r} value={r}>{data.roleLabels[r]}</SelectItem>)}</SelectContent>
        </Select>
      </div>

      {/* Role summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-zinc-200"><CardContent className="p-4"><div className="h-9 w-9 rounded-lg bg-blue-100 flex items-center justify-center mb-2"><Shield className="h-4.5 w-4.5 text-blue-600" /></div><div className="text-2xl font-bold">{role.moduleCount}</div><div className="text-xs text-zinc-500">Modules Accessible</div></CardContent></Card>
        <Card className="border-zinc-200"><CardContent className="p-4"><div className="h-9 w-9 rounded-lg bg-green-100 flex items-center justify-center mb-2"><CheckCircle2 className="h-4.5 w-4.5 text-green-600" /></div><div className="text-2xl font-bold">{role.totalActions}</div><div className="text-xs text-zinc-500">Total Permissions</div></CardContent></Card>
        <Card className="border-zinc-200"><CardContent className="p-4"><div className="h-9 w-9 rounded-lg bg-[#fef8e7] flex items-center justify-center mb-2"><Lock className="h-4.5 w-4.5 text-[#c79a2e]" /></div><div className="text-2xl font-bold">{data.modules.length - role.moduleCount}</div><div className="text-xs text-zinc-500">Modules Restricted</div></CardContent></Card>
      </div>

      {/* Permission matrix table */}
      <Card className="border-zinc-200">
        <CardHeader><CardTitle className="text-base">{role.label} — Detailed Permissions</CardTitle><CardDescription>{role.moduleCount} of {data.modules.length} modules accessible · {role.totalActions} total action permissions</CardDescription></CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-zinc-500 border-b border-zinc-100 bg-zinc-50">
                  <th className="p-3 font-medium sticky left-0 bg-zinc-50">Module</th>
                  {data.actions.map((a: string) => <th key={a} className="p-2 text-center font-medium capitalize" style={{ minWidth: 70 }}>{a.replace(/_/g, " ")}</th>)}
                  <th className="p-3 text-center font-medium">Access</th>
                </tr>
              </thead>
              <tbody>
                {role.modules.map((m: any) => (
                  <tr key={m.module} className={`border-b border-zinc-50 ${!m.hasView ? "opacity-40" : ""}`}>
                    <td className="p-3 font-medium sticky left-0 bg-white">{m.label}</td>
                    {data.actions.map((a: string) => (
                      <td key={a} className="p-2 text-center">
                        {m.actions.includes(a) ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500 mx-auto" />
                        ) : (
                          <XCircle className="h-4 w-4 text-zinc-300 mx-auto" />
                        )}
                      </td>
                    ))}
                    <td className="p-3 text-center">
                      {m.hasView ? <Badge variant="secondary" className="text-[10px] bg-green-100 text-green-700">Allowed</Badge> : <Badge variant="secondary" className="text-[10px] bg-red-100 text-red-700">Restricted</Badge>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Security principles */}
      <Card className="border-[#f1c24e]/30 bg-[#fff8e6]">
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Shield className="h-5 w-5 text-[#c79a2e]" />Security Principles Enforced</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            "Server-side permission checks on every API",
            "Department-based data isolation",
            "Data ownership rules (users see own tasks)",
            "AI refuses unauthorized data requests",
            "Search results filtered by permissions",
            "Account lockout after 5 failed logins",
            "Audit logging for sensitive actions",
            "Principle of least privilege",
            "Sensitive field masking (salary, payroll)",
            "Session expiration and management",
          ].map((principle) => (
            <div key={principle} className="flex items-center gap-2 bg-white rounded-md p-2 border border-[#f1c24e]/20"><CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" /><span className="text-xs text-zinc-700">{principle}</span></div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
