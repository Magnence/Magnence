"use client";

import * as React from "react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";

export function AuthPage() {
  const { setUser, setActiveModule } = useAppStore();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const submit = async (e: React.FormEvent<HTMLFormEvent>) => {
    e.preventDefault();
    const em = email.trim();
    if (!em || !password) return;
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: em, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setUser(data.user);
      setActiveModule("dashboard");
      toast.success(`Welcome, ${data.user.name.split(" ")[0]}!`);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-sm">
        {/* Simple card — no decoration */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-8 shadow-sm">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-xl font-bold text-zinc-900">Sign in to Magnence OS</h1>
            <p className="text-sm text-zinc-500 mt-1">Enter your credentials to continue</p>
          </div>

          {/* Form */}
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-zinc-700 text-sm font-medium">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="anurag@magnence.com"
                  className="pl-10 rounded-lg border-zinc-200 focus:border-[#f1c24e] focus:ring-[#f1c24e]/20"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-zinc-700 text-sm font-medium">Password</Label>
                <span className="text-xs text-zinc-400">Forgot? Contact admin</span>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="pl-10 pr-10 rounded-lg border-zinc-200 focus:border-[#f1c24e] focus:ring-[#f1c24e]/20"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#f1c24e] text-black hover:bg-[#e9b73a] font-semibold rounded-lg transition-all"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Please wait...
                </span>
              ) : (
                <>
                  <LogIn className="h-4 w-4 mr-2" /> Sign In
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Footer — text only, no design */}
        <div className="mt-6 text-center">
          <p className="text-sm font-medium text-zinc-700">
            Imagine. Create. Engineer. Elevate.
          </p>
          <p className="text-xs text-zinc-400 mt-1">
            © 2026 Magnence. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
