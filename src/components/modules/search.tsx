"use client";

import * as React from "react";
import { useAppStore } from "@/lib/store";
import { MagnenceLogo } from "@/components/magnence-logo";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search, Users, FolderKanban, CheckSquare, FileText, HeartHandshake,
  FileSignature, Sparkles,
} from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const ICONS: Record<string, React.ElementType> = {
  Users, FolderKanban, CheckSquare, FileText, HeartHandshake, FileSignature,
};

const typeLabels: Record<string, string> = {
  person: "People",
  project: "Projects",
  task: "Tasks",
  document: "Documents",
  client: "Clients",
  contract: "Contracts",
};

const moduleMap: Record<string, string> = {
  person: "people",
  project: "projects",
  task: "tasks",
  document: "documents",
  client: "clients",
  contract: "contracts",
};

export function UniversalSearch() {
  const { commandOpen, setCommandOpen, setActiveModule, user } = useAppStore();
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<any[]>([]);
  const [counts, setCounts] = React.useState<Record<string, number>>({});
  const [recentSearches, setRecentSearches] = React.useState<string[]>([]);
  const [aiThinking, setAiThinking] = React.useState(false);
  const [aiAnswer, setAiAnswer] = React.useState<string | null>(null);

  React.useEffect(() => {
    const saved = localStorage.getItem("magnence-recent-searches");
    if (saved) setRecentSearches(JSON.parse(saved));
  }, []);

  // Keyboard shortcut Cmd+K
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setCommandOpen]);

  React.useEffect(() => {
    if (!commandOpen) {
      setQuery("");
      setResults([]);
      setAiAnswer(null);
    }
  }, [commandOpen]);

  React.useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setCounts({});
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results || []);
        setCounts(data.counts || {});
      } catch {
        setResults([]);
        setCounts({});
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  const askAI = async () => {
    if (!query.trim()) return;
    setAiThinking(true);
    setAiAnswer(null);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query, agentType: "company" }),
      });
      const data = await res.json();
      setAiAnswer(data.reply || "AI search is temporarily unavailable.");
    } catch {
      setAiAnswer("AI search is temporarily unavailable.");
    } finally {
      setAiThinking(false);
    }
  };

  const handleSearch = (q: string) => {
    setQuery(q);
    setCommandOpen(false);
    const saved = localStorage.getItem("magnence-recent-searches");
    const recent = saved ? JSON.parse(saved) : [];
    if (!recent.includes(q)) {
      const updated = [q, ...recent].slice(0, 5);
      localStorage.setItem("magnence-recent-searches", JSON.stringify(updated));
      setRecentSearches(updated);
    }
  };

  return (
    <>
      {/* Command Palette (Cmd+K) */}
      <Dialog open={commandOpen} onOpenChange={setCommandOpen}>
        <DialogContent className="p-0 overflow-hidden max-w-2xl">
          <DialogTitle className="sr-only">Search</DialogTitle>
          <DialogDescription className="sr-only">Search across the platform</DialogDescription>
          <Command className="rounded-lg">
            <CommandInput
              placeholder="Search people, projects, tasks, documents..."
              value={query}
              onValueChange={setQuery}
            />
            <CommandList className="max-h-[400px]">
              <CommandEmpty>No results found.</CommandEmpty>
              {results.length > 0 && (
                <CommandGroup heading="Results">
                  {results.slice(0, 10).map((r, i) => {
                    const Icon = ICONS[r.icon] || FileText;
                    return (
                      <CommandItem
                        key={i}
                        onSelect={() => {
                          setActiveModule(moduleMap[r.type] || "dashboard");
                          setCommandOpen(false);
                        }}
                      >
                        <Icon className="h-4 w-4 mr-2 text-zinc-400" />
                        <span className="font-medium">{r.title}</span>
                        {r.subtitle && <span className="text-xs text-zinc-500 ml-2">{r.subtitle}</span>}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              )}
              {recentSearches.length > 0 && (
                <CommandGroup heading="Recent">
                  {recentSearches.map((s, i) => (
                    <CommandItem key={i} onSelect={() => handleSearch(s)}>
                      <Search className="h-4 w-4 mr-2 text-zinc-400" />
                      {s}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              <CommandSeparator />
              <CommandGroup heading="Quick Navigation">
                <CommandItem onSelect={() => { setActiveModule("dashboard"); setCommandOpen(false); }}>
                  <Search className="h-4 w-4 mr-2" /> Dashboard
                </CommandItem>
                <CommandItem onSelect={() => { setActiveModule("projects"); setCommandOpen(false); }}>
                  <FolderKanban className="h-4 w-4 mr-2" /> Projects
                </CommandItem>
                <CommandItem onSelect={() => { setActiveModule("tasks"); setCommandOpen(false); }}>
                  <CheckSquare className="h-4 w-4 mr-2" /> Tasks
                </CommandItem>
                <CommandItem onSelect={() => { setActiveModule("people"); setCommandOpen(false); }}>
                  <Users className="h-4 w-4 mr-2" /> People
                </CommandItem>
                <CommandItem onSelect={() => { setActiveModule("documents"); setCommandOpen(false); }}>
                  <FileText className="h-4 w-4 mr-2" /> Documents
                </CommandItem>
                <CommandItem onSelect={() => { setActiveModule("ai-center"); setCommandOpen(false); }}>
                  <Sparkles className="h-4 w-4 mr-2" /> AI Center
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>

      {/* Full Search Page */}
      <div className="space-y-6 max-w-4xl">
        <div>
          <h2 className="text-2xl font-bold text-black">Search</h2>
          <p className="text-sm text-zinc-600 mt-1">
            Search across people, projects, tasks, documents, clients, and contracts.
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search anything... (people, projects, tasks, documents)"
            className="w-full pl-12 pr-4 py-4 text-base rounded-xl border-2 border-zinc-200 focus:border-[#f1c24e] focus:outline-none bg-white"
          />
        </div>

        {/* AI Semantic Search */}
        {query.trim() && (
          <div className="border border-[#f1c24e]/40 rounded-xl p-4 bg-[#fefdf5]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#c79a2e]" />
                <div>
                  <div className="font-semibold text-sm">Ask AI about &ldquo;{query}&rdquo;</div>
                  <div className="text-xs text-zinc-600">Get a natural-language answer</div>
                </div>
              </div>
              <button
                onClick={askAI}
                disabled={aiThinking}
                className="bg-[#f1c24e] text-black hover:bg-[#e9b73a] font-semibold px-3 py-1.5 rounded-md text-sm disabled:opacity-50"
              >
                {aiThinking ? "Thinking..." : "Ask AI"}
              </button>
            </div>
            {aiAnswer && (
              <div className="mt-3 bg-white rounded-md p-3 text-sm text-zinc-700 whitespace-pre-wrap border border-zinc-200">
                {aiAnswer}
              </div>
            )}
          </div>
        )}

        {/* Counts */}
        {Object.keys(counts).length > 0 && (
          <div className="flex flex-wrap gap-2">
            {Object.entries(counts).map(([type, count]) => (
              <Badge key={type} variant="secondary" className="bg-[#fef8e7] text-[#8a6d1f]">
                {typeLabels[type] || type}: {count}
              </Badge>
            ))}
          </div>
        )}

        {/* Results */}
        {results.length > 0 ? (
          <div className="space-y-2">
            {results.map((r, i) => {
              const Icon = ICONS[r.icon] || FileText;
              return (
                <button
                  key={i}
                  onClick={() => setActiveModule(moduleMap[r.type] || "dashboard")}
                  className="w-full flex items-center gap-3 p-3 rounded-lg border border-zinc-200 hover:border-[#f1c24e] hover:bg-[#fef8e7] transition text-left"
                >
                  <div
                    className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `${r.color}15`, color: r.color }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate">{r.title}</div>
                    <div className="text-xs text-zinc-500">
                      {r.subtitle}{r.meta ? ` · ${r.meta}` : ""}
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[10px] capitalize">{r.type}</Badge>
                </button>
              );
            })}
          </div>
        ) : query.trim() && !aiThinking ? (
          <div className="text-center py-12 text-zinc-500">
            <Search className="h-10 w-10 mx-auto text-zinc-300 mb-3" />
            <p className="font-medium">No results found</p>
            <p className="text-sm">Try a different search term or ask AI above.</p>
          </div>
        ) : null}

        {/* Quick Search Categories */}
        {!query && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { icon: Users, label: "People", color: "#0891b2", mod: "people" },
              { icon: FolderKanban, label: "Projects", color: "#2563eb", mod: "projects" },
              { icon: CheckSquare, label: "Tasks", color: "#16a34a", mod: "tasks" },
              { icon: FileText, label: "Documents", color: "#ea580c", mod: "documents" },
              { icon: HeartHandshake, label: "Clients", color: "#7c3aed", mod: "clients" },
              { icon: FileSignature, label: "Contracts", color: "#dc2626", mod: "contracts" },
            ].map((s) => (
              <Card key={s.label} className="border-zinc-200 hover:border-[#f1c24e] cursor-pointer transition-colors" onClick={() => setActiveModule(s.mod)}>
                <CardContent className="p-5 text-center">
                  <div
                    className="h-12 w-12 rounded-xl mx-auto mb-2 flex items-center justify-center"
                    style={{ background: `${s.color}15`, color: s.color }}
                  >
                    <s.icon className="h-6 w-6" />
                  </div>
                  <div className="text-sm font-semibold">Search {s.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

// Also export as SearchModule for compatibility
export function SearchModule() {
  return <UniversalSearch />;
}
