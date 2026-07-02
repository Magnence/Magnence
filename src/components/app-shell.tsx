"use client";

import * as React from "react";
import { MagnenceLogo } from "./magnence-logo";
import { NotificationsBell } from "./notifications-bell";
import { NAV_GROUPS, ROLE_LABELS } from "@/lib/constants";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  LifeBuoy,
  Sparkles,
  Megaphone,
  TrendingUp,
  Share2,
  Users,
  BookOpen,
  Settings,
  ChevronLeft,
  ChevronRight,
  Search,
  Building2,
  IdCard,
  Calendar,
  FolderOpen,
  Activity,
  ShieldCheck,
  LogOut,
  CheckSquare,
  FolderKanban,
  Clock,
  Video,
  StickyNote,
  MessageSquare,
  Palmtree,
  Fingerprint,
  Target,
  CheckCheck,
  FileText,
  Briefcase,
  Boxes,
  BarChart3,
  UserCog,
  HeartHandshake,
  FileSignature,
  DollarSign,
  ShoppingCart,
  GitBranch,
  Zap,
  Image,
  Inbox,
  Mail,
  MousePointerClick,
  Globe,
  CalendarDays,
  Eye,
  Plug,
  Webhook,
  FileBarChart,
  Bell,
  Download,
  Brain,
  Lightbulb,
  GraduationCap,
  DatabaseBackup,
  FlaskConical,
  Rocket,
  Menu,
  X,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ICONS: Record<string, LucideIcon> = {
  LayoutDashboard,
  LifeBuoy,
  Sparkles,
  Megaphone,
  TrendingUp,
  Share2,
  Users,
  BookOpen,
  Settings,
  Building2,
  IdCard,
  Calendar,
  FolderOpen,
  Activity,
  ShieldCheck,
  Search,
  CheckSquare,
  FolderKanban,
  Clock,
  Video,
  StickyNote,
  MessageSquare,
  Palmtree,
  Fingerprint,
  Target,
  CheckCheck,
  FileText,
  Briefcase,
  Boxes,
  BarChart3,
  UserCog,
  HeartHandshake,
  FileSignature,
  DollarSign,
  ShoppingCart,
  GitBranch,
  Zap,
  Image,
  Inbox,
  Mail,
  MousePointerClick,
  Globe,
  CalendarDays,
  Eye,
  Plug,
  Webhook,
  FileBarChart,
  Bell,
  Download,
  Brain,
  Lightbulb,
  GraduationCap,
  DatabaseBackup,
  FlaskConical,
  Rocket,
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, activeModule, setActiveModule, sidebarCollapsed, toggleSidebar, setCommandOpen, setUser } =
    useAppStore();

  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);

  const initials = (user?.name || "?")
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setActiveModule("dashboard");
  };

  // Close mobile sidebar when a module is selected
  const handleModuleSelect = (id: string) => {
    setActiveModule(id);
    setMobileSidebarOpen(false);
  };

  // Filter nav groups based on user permissions
  const visibleGroups = NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => {
      if (["dashboard", "ai-center", "search", "settings"].includes(item.id)) return true;
      const ok = useAppStore.getState().hasPermission(item.id, "view");
      return ok;
    }),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="min-h-screen flex bg-white text-black">
      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "shrink-0 border-r border-zinc-200 bg-white transition-all duration-300 overflow-y-auto thin-scroll no-select",
          "fixed lg:sticky top-0 h-screen z-50",
          // Mobile: slide in/out
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          // Desktop: collapse/expand
          sidebarCollapsed ? "lg:w-[72px]" : "lg:w-[260px]",
          "w-[280px]"
        )}
      >
        <div
          className={cn(
            "flex items-center h-16 border-b border-zinc-200 px-4",
            sidebarCollapsed && "lg:justify-center lg:px-0"
          )}
        >
          {sidebarCollapsed ? (
            <div className="hidden lg:flex"><MagnenceLogo size={32} withWordmark={false} /></div>
          ) : (
            <MagnenceLogo size={32} withWordmark />
          )}
          {/* Mobile close button */}
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="ml-auto lg:hidden p-2 rounded-md hover:bg-zinc-100"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search trigger */}
        <div className={cn("px-3 pt-3", sidebarCollapsed && "lg:px-3 lg:flex lg:justify-center")}>
          <button
            onClick={() => { setCommandOpen(true); setMobileSidebarOpen(false); }}
            className={cn(
              "w-full flex items-center gap-2 pl-3 pr-2 py-2 text-sm rounded-md bg-zinc-50 border border-zinc-200 hover:border-[#f1c24e] text-zinc-500 transition",
              sidebarCollapsed && "lg:justify-center lg:px-0 lg:w-9"
            )}
          >
            <Search className="h-4 w-4 shrink-0" />
            {!sidebarCollapsed && <span className="flex-1 text-left">Search...</span>}
            {!sidebarCollapsed && <kbd className="text-[10px] font-mono bg-white border border-zinc-200 rounded px-1 py-0.5">⌘K</kbd>}
          </button>
        </div>

        <nav className="px-3 py-3 space-y-5" aria-label="Main navigation">
          {visibleGroups.map((group) => (
            <div key={group.label} className="space-y-1">
              {!sidebarCollapsed && (
                <div className="px-2 mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                  {group.label}
                </div>
              )}
              {group.items.map((item) => {
                const Icon = ICONS[item.icon] || LayoutDashboard;
                const active = activeModule === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleModuleSelect(item.id)}
                    title={sidebarCollapsed ? item.label : undefined}
                    aria-label={item.label}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "w-full flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors touch-target",
                      active
                        ? "bg-[#f1c24e] text-black"
                        : "text-zinc-700 hover:bg-zinc-100",
                      sidebarCollapsed && "lg:justify-center lg:px-0"
                    )}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User card */}
        {!sidebarCollapsed && user && (
          <div className="mt-auto p-3 border-t border-zinc-200">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-full flex items-center gap-2.5 p-2 rounded-md hover:bg-zinc-50 cursor-pointer">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback style={{ background: user.avatarColor, color: "#fff" }}>
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="text-sm font-semibold truncate">{user.name}</div>
                    <div className="text-xs text-zinc-500 truncate">
                      {ROLE_LABELS[user.role] || user.role} · {user.department}
                    </div>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="font-semibold">{user.name}</div>
                  <div className="text-xs text-zinc-500 font-normal">{user.email}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleModuleSelect("settings")}>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleModuleSelect("ai-center")}>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Ask AI Assistant
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-600">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-30 h-16 border-b border-zinc-200 bg-white/95 backdrop-blur px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden h-9 w-9 hover:bg-zinc-100 shrink-0"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
            {/* Desktop collapse button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="hidden lg:flex h-9 w-9 hover:bg-zinc-100 shrink-0"
              aria-label="Toggle sidebar"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronLeft className="h-5 w-5" />
              )}
            </Button>
            <h1 className="text-base sm:text-lg font-semibold capitalize truncate">
              {NAV_GROUPS.flatMap((g) => g.items).find((i) => i.id === activeModule)?.label || "Magnence"}
            </h1>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Mobile search icon */}
            <button
              onClick={() => setCommandOpen(true)}
              className="sm:hidden h-9 w-9 rounded-md hover:bg-zinc-100 flex items-center justify-center"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
            {/* Desktop search */}
            <button
              onClick={() => setCommandOpen(true)}
              className="hidden sm:flex items-center gap-2 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-sm text-zinc-500 hover:border-[#f1c24e] transition"
            >
              <Search className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Search...</span>
              <kbd className="hidden md:inline text-[10px] font-mono bg-white border border-zinc-200 rounded px-1 py-0.5">⌘K</kbd>
            </button>
            {/* Ask AI */}
            <NotificationsBell />
            {user && (
              <Avatar className="h-9 w-9 ring-2 ring-[#f1c24e]/30 shrink-0">
                <AvatarFallback style={{ background: user.avatarColor, color: "#fff" }}>
                  {initials}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 overflow-x-hidden">{children}</main>

        <footer className="border-t border-zinc-200 bg-white px-4 sm:px-6 py-3 text-xs text-zinc-500 flex flex-wrap items-center justify-between gap-2">
          <span className="truncate">© {new Date().getFullYear()} Magnence OS — Imagine. Create. Engineer. Elevate.</span>
          <span className="flex items-center gap-3 shrink-0">
            <span className="inline-flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              All systems operational
            </span>
            <span className="hidden sm:inline">Phase 6 · v2.6.1</span>
          </span>
        </footer>

        {/* Floating AI Button */}
        <button
          onClick={() => setActiveModule("ai-center")}
          className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center group"
          aria-label="Open AI Center"
        >
          <Brain className="h-6 w-6" />
          <span className="absolute right-full mr-3 px-3 py-1.5 rounded-lg bg-zinc-900 text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            AI Center
          </span>
        </button>
      </div>
    </div>
  );
}
