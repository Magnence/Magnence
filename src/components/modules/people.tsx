"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Mail, Phone, MapPin, Briefcase } from "lucide-react";
import { ROLE_LABELS } from "@/lib/constants";
import { useAppStore } from "@/lib/store";
import { Shield } from "lucide-react";

interface Person {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  title: string | null;
  avatarColor: string;
  status: string;
}

const ROLE_STYLES: Record<string, string> = {
  FREELANCER: "bg-purple-100 text-purple-700",
  INTERN: "bg-blue-100 text-blue-700",
  EMPLOYEE: "bg-zinc-100 text-zinc-700",
  MANAGER: "bg-[#fef8e7] text-[#8a6d1f]",
  SUPPORT: "bg-green-100 text-green-700",
};

export function PeopleModule() {

  const [people, setPeople] = React.useState<Person[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [filterDept, setFilterDept] = React.useState("all");

  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/me");
        const data = await res.json();
        setPeople(data.users || []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const departments = Array.from(new Set(people.map((p) => p.department)));

  const filtered = people.filter((p) => {
    if (filterDept !== "all" && p.department !== filterDept) return false;
    if (
      search &&
      !p.name.toLowerCase().includes(search.toLowerCase()) &&
      !p.email.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  const initials = (n: string) =>
    n.split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase();

  const { user, hasPermission } = useAppStore();
  const canView = hasPermission("people", "view");

  if (!canView) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-black">Access Restricted</h2>
          <p className="text-sm text-zinc-600 mt-1">You don't have permission to view this module.</p>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center">
          <Shield className="h-12 w-12 mx-auto text-zinc-300 mb-4" />
          <p className="font-semibold text-zinc-700">Permission Required</p>
          <p className="text-sm text-zinc-500 mt-1">Contact your administrator if you need access to this module.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-black">People</h2>
        <p className="text-sm text-zinc-600 mt-1">
          Everyone in the company — freelancers, interns, employees, managers, support, admins.
        </p>
      </div>

      {/* Filters */}
      <Card className="border-zinc-200">
        <CardContent className="p-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filterDept} onValueChange={setFilterDept}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All departments</SelectItem>
              {departments.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Badge variant="secondary" className="bg-[#fef8e7] text-[#8a6d1f]">
            {filtered.length} shown
          </Badge>
        </CardContent>
      </Card>

      {/* People grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-40 rounded-xl bg-zinc-100 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <Card key={p.id} className="border-zinc-200 hover:border-[#f1c24e] transition">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <Avatar className="h-14 w-14">
                      <AvatarFallback
                        style={{ background: p.avatarColor, color: "#fff" }}
                        className="text-base font-bold"
                      >
                        {initials(p.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white ${
                        p.status === "active" ? "bg-green-500" : "bg-zinc-300"
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-base truncate">{p.name}</div>
                    <div className="text-xs text-zinc-500 truncate">
                      {p.title || "—"}
                    </div>
                    <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                      <Badge className={`${ROLE_STYLES[p.role] || "bg-zinc-100"} text-[10px]`}>
                        {ROLE_LABELS[p.role] || p.role}
                      </Badge>
                      <Badge variant="outline" className="text-[10px]">
                        {p.department}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="mt-4 space-y-1.5 text-xs text-zinc-600">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-zinc-400" />
                    <span className="truncate">{p.email}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
