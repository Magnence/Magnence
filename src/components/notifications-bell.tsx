"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  LifeBuoy,
  Megaphone,
  UserCheck,
  AlertCircle,
  Sparkles,
  Settings as SettingsIcon,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { timeAgo } from "./modules/dashboard";

interface Notif {
  id: string;
  type: string;
  title: string;
  body: string | null;
  link: string | null;
  read: boolean;
  createdAt: string;
}

const TYPE_ICONS: Record<string, React.ElementType> = {
  ticket: LifeBuoy,
  announcement: Megaphone,
  assignment: UserCheck,
  approval: Check,
  mention: UserCheck,
  ai: Sparkles,
  system: AlertCircle,
};

const TYPE_COLORS: Record<string, string> = {
  ticket: "bg-red-100 text-red-700",
  announcement: "bg-purple-100 text-purple-700",
  assignment: "bg-blue-100 text-blue-700",
  approval: "bg-amber-100 text-amber-700",
  mention: "bg-cyan-100 text-cyan-700",
  ai: "bg-green-100 text-green-700",
  system: "bg-zinc-100 text-zinc-700",
};

export function NotificationsBell() {
  const { user, setActiveModule } = useAppStore();
  const [notifications, setNotifications] = React.useState<Notif[]>([]);
  const [unread, setUnread] = React.useState(0);
  const [open, setOpen] = React.useState(false);

  const load = React.useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      setNotifications(data.notifications || []);
      setUnread(data.unread || 0);
    } catch (e) {
      console.error(e);
    }
  }, [user]);

  React.useEffect(() => {
    load();
    // Poll every 30s
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, [load]);

  const markRead = async (id: string) => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  };

  const markAllRead = async () => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAllRead: true }),
    });
    load();
    toast.success("All notifications marked read");
  };

  const clearAll = async () => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "clear" }),
    });
    load();
    toast.success("Notifications cleared");
  };

  const handleClick = (n: Notif) => {
    if (!n.read) markRead(n.id);
    if (n.link) setActiveModule(n.link);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="relative h-9 w-9 rounded-md hover:bg-zinc-100 flex items-center justify-center">
          <Bell className="h-5 w-5 text-zinc-700" />
          {unread > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 rounded-full bg-[#f1c24e] text-black text-[10px] font-bold flex items-center justify-center">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[calc(100vw-2rem)] sm:w-[380px] p-0">
        <div className="flex items-center justify-between p-3 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm">Notifications</h3>
            {unread > 0 && (
              <Badge className="bg-[#f1c24e] text-black text-[10px]">{unread} new</Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button size="sm" variant="ghost" onClick={markAllRead} className="h-7 text-xs" disabled={unread === 0}>
              <CheckCheck className="h-3.5 w-3.5 mr-1" />
              Mark all
            </Button>
            <Button size="sm" variant="ghost" onClick={clearAll} className="h-7 text-xs text-red-500 hover:bg-red-50">
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
        <div className="max-h-[400px] overflow-y-auto thin-scroll">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-sm text-zinc-500">
              <Bell className="h-8 w-8 mx-auto text-zinc-300 mb-2" />
              No notifications
            </div>
          ) : (
            notifications.map((n) => {
              const Icon = TYPE_ICONS[n.type] || AlertCircle;
              const color = TYPE_COLORS[n.type] || "bg-zinc-100";
              return (
                <button
                  key={n.id}
                  onClick={() => handleClick(n)}
                  className={`w-full flex items-start gap-2 p-3 border-b border-zinc-50 hover:bg-zinc-50 text-left transition ${
                    !n.read ? "bg-[#fef8e7]/50" : ""
                  }`}
                >
                  <div className={`h-8 w-8 rounded-md flex items-center justify-center shrink-0 ${color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{n.title}</div>
                    {n.body && <div className="text-xs text-zinc-500 line-clamp-2 mt-0.5">{n.body}</div>}
                    <div className="text-[10px] text-zinc-400 mt-1">{timeAgo(n.createdAt)}</div>
                  </div>
                  {!n.read && <div className="h-2 w-2 rounded-full bg-[#f1c24e] shrink-0 mt-1.5" />}
                </button>
              );
            })
          )}
        </div>
        <div className="p-2 border-t border-zinc-100">
          <Button
            size="sm"
            variant="ghost"
            className="w-full text-xs text-[#c79a2e] hover:bg-[#fef8e7]"
            onClick={() => { setActiveModule("settings"); setOpen(false); }}
          >
            <SettingsIcon className="h-3.5 w-3.5 mr-1.5" />
            Notification Preferences
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
