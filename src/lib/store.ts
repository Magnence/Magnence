"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Role =
  | "CEO"
  | "CFO"
  | "CTO"
  | "CMO"
  | "CHRO"
  | "EMPLOYEE"
  | "FREELANCER"
  | "CLIENT"
  | "INTERN";

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: string;
  title: string;
  avatarColor: string;
  status: "active" | "away" | "offline";
  permissions?: Record<string, string[]>;
}

interface AppState {
  user: CurrentUser | null;
  setUser: (u: CurrentUser | null) => void;
  hasPermission: (module: string, action: string) => boolean;
  activeModule: string;
  setActiveModule: (m: string) => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  commandOpen: boolean;
  setCommandOpen: (v: boolean) => void;
  notificationsOpen: boolean;
  setNotificationsOpen: (v: boolean) => void;
  // context for AI
  currentContext: { module: string; page?: string };
  setCurrentContext: (c: { module: string; page?: string }) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (u) => set({ user: u }),
      hasPermission: (module, action) => {
        const u = get().user;
        if (!u) return false;
        // Super admin / founder / admin = always true
        if (["CEO"].includes(u.role)) return true;
        const perms = u.permissions || {};
        const modulePerms = perms[module] || [];
        return modulePerms.includes(action);
      },
      activeModule: "dashboard",
      setActiveModule: (m) => set({ activeModule: m }),
      sidebarCollapsed: false,
      toggleSidebar: () =>
        set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      commandOpen: false,
      setCommandOpen: (v) => set({ commandOpen: v }),
      notificationsOpen: false,
      setNotificationsOpen: (v) => set({ notificationsOpen: v }),
      currentContext: { module: "dashboard" },
      setCurrentContext: (c) => set({ currentContext: c }),
    }),
    { name: "magnence-os-store" }
  )
);
