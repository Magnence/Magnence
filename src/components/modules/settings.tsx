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
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  User as UserIcon,
  Bell,
  Palette,
  Shield,
  LogOut,
  RefreshCw,
  Database,
  Settings as SettingsIcon,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { ROLE_LABELS } from "@/lib/constants";

export function SettingsModule() {
  const { user, setUser, setActiveModule } = useAppStore();
  const [name, setName] = React.useState(user?.name || "");
  const [email, setEmail] = React.useState(user?.email || "");
  const [title, setTitle] = React.useState(user?.title || "");
  const [seeding, setSeeding] = React.useState(false);

  React.useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setTitle(user.title || "");
    }
  }, [user]);

  const initials = (n: string) =>
    n.split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase();

  const save = () => {
    if (!user) return;
    setUser({
      ...user,
      name,
      email,
      title,
    });
    toast.success("Profile updated");
  };

  const seedDemo = async () => {
    setSeeding(true);
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "seed failed");
      toast.success(
        `Demo data refreshed: ${data.counts.users} users, ${data.counts.tickets} tickets`
      );
    } catch (e) {
      toast.error("Seed failed");
    } finally {
      setSeeding(false);
    }
  };

  const logout = () => {
    setUser(null);
    setActiveModule("dashboard");
    toast.success("Signed out. Pick another profile to continue.");
  };

  if (!user) return null;

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-bold text-black">Settings</h2>
        <p className="text-sm text-zinc-600 mt-1">
          Manage your profile, notifications, and preferences.
        </p>
      </div>

      {/* Profile */}
      <Card className="border-zinc-200">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <UserIcon className="h-4 w-4 text-[#c79a2e]" />
            Profile
          </CardTitle>
          <CardDescription>Your identity in Magnence</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 ring-2 ring-[#f1c24e]/30">
              <AvatarFallback
                style={{ background: user.avatarColor, color: "#fff" }}
                className="text-lg font-bold"
              >
                {initials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold text-lg">{user.name}</div>
              <div className="text-sm text-zinc-500">{user.email}</div>
              <div className="mt-1 flex gap-1.5">
                <Badge className="bg-[#fef8e7] text-[#8a6d1f] text-xs">
                  {ROLE_LABELS[user.role] || user.role}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {user.department}
                </Badge>
              </div>
            </div>
          </div>
          <Separator />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Full name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Department</Label>
              <Input value={user.department} disabled />
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={save}
              className="bg-[#f1c24e] text-black hover:bg-[#e9b73a] font-semibold"
            >
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="border-zinc-200">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Bell className="h-4 w-4 text-[#c79a2e]" />
            Notifications
          </CardTitle>
          <CardDescription>Choose what you want to be notified about</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { label: "New tickets assigned to me", desc: "Get notified when a support ticket is assigned", defaultOn: true },
            { label: "Marketing campaign milestones", desc: "When campaigns hit budget or conversion goals", defaultOn: true },
            { label: "Social post published", desc: "When a scheduled post goes live", defaultOn: false },
            { label: "AI Assistant responses", desc: "When AI agents reply to your queries", defaultOn: true },
            { label: "Weekly summary", desc: "Monday morning digest of last week's activity", defaultOn: true },
          ].map((n) => (
            <div
              key={n.label}
              className="flex items-center justify-between py-2 border-b border-zinc-100 last:border-0"
            >
              <div>
                <div className="text-sm font-medium">{n.label}</div>
                <div className="text-xs text-zinc-500">{n.desc}</div>
              </div>
              <Switch defaultChecked={n.defaultOn} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card className="border-zinc-200">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Palette className="h-4 w-4 text-[#c79a2e]" />
            Appearance
          </CardTitle>
          <CardDescription>Magnence brand theme — white, gold, black</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-md border border-zinc-200" style={{ background: "#ffffff" }} />
              <span className="text-sm">White</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-md" style={{ background: "#f1c24e" }} />
              <span className="text-sm">Magnence Gold</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-md" style={{ background: "#0a0a0a" }} />
              <span className="text-sm">Black text</span>
            </div>
          </div>
          <p className="text-xs text-zinc-500 mt-3">
            Brand colors are fixed for consistency across the company. Dark mode coming in v1.1.
          </p>
        </CardContent>
      </Card>

      {/* Admin tools */}
      {(user.role === "MANAGER") && (
        <Card className="border-zinc-200">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Database className="h-4 w-4 text-[#c79a2e]" />
              Admin Tools
            </CardTitle>
            <CardDescription>Manage demo data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-zinc-100">
              <div>
                <div className="text-sm font-medium">Refresh demo data</div>
                <div className="text-xs text-zinc-500">
                  Wipe and reseed users, tickets, campaigns, leads, posts
                </div>
              </div>
              <Button
                variant="outline"
                onClick={seedDemo}
                disabled={seeding}
                className="border-[#f1c24e] text-black hover:bg-[#fef8e7]"
              >
                <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                {seeding ? "Loading..." : "Refresh"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sign out */}
      <Card className="border-zinc-200">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
              <LogOut className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-medium">Switch profile</div>
              <div className="text-xs text-zinc-500">
                Sign out and pick another team member
              </div>
            </div>
          </div>
          <Button variant="outline" onClick={logout} className="border-zinc-300">
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
