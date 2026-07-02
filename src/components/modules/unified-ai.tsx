"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {
  Brain, Search, ThumbsUp, ThumbsDown, Eye, Sparkles, RefreshCw,
  Send, BookOpen, FileText, Scale, HelpCircle, ListChecks,
  ClipboardList, Wrench, HeartHandshake, Megaphone, TrendingUp, Zap,
  Bot, User as UserIcon, Loader2, RotateCcw, Users, DollarSign, ShoppingCart,
  MessageSquare,
} from "lucide-react";
import { AGENT_TYPES, ROLE_LABELS } from "@/lib/constants";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { timeAgo } from "./dashboard";

const CAT_COLORS: Record<string, string> = {
  sop: "#0891b2", policy: "#7c3aed", handbook: "#ea580c",
  training: "#16a34a", process: "#c79a2e", technical: "#dc2626", faq: "#52525b",
};

const ICONS: Record<string, React.ElementType> = {
  ClipboardList, Scale, Wrench, Eye, HeartHandshake, Megaphone,
  TrendingUp, Zap, Sparkles, Users, DollarSign, ShoppingCart,
};

interface Msg {
  role: "user" | "assistant";
  content: string;
}

type Tab = "assistant" | "knowledge" | "brain";

export function UnifiedAIModule() {
  const { user, hasPermission } = useAppStore();
  const [activeTab, setActiveTab] = React.useState<Tab>("assistant");

  const canView = hasPermission("ai-brain", "view") || hasPermission("assistant", "view") || hasPermission("knowledge", "view");

  if (!canView) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-black">AI Center</h2>
          <p className="text-sm text-zinc-600 mt-1">Unified AI assistant, knowledge base, and company brain.</p>
        </div>
        <Card className="border-zinc-200">
          <CardContent className="p-12 text-center">
            <Brain className="h-12 w-12 mx-auto text-zinc-300 mb-4" />
            <p className="font-semibold text-zinc-700">Access Restricted</p>
            <p className="text-sm text-zinc-500 mt-1">You don't have permission to access the AI Center.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center">
          <Brain className="h-5 w-5 text-amber-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-black">AI Center</h2>
          <p className="text-sm text-zinc-600">AI Assistant, Knowledge Base & Company Brain — all in one place.</p>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-zinc-200">
        {([
          { id: "assistant", label: "AI Assistant", icon: Sparkles },
          { id: "knowledge", label: "Knowledge Base", icon: BookOpen },
          { id: "brain", label: "AI Brain", icon: Brain },
        ] as { id: Tab; label: string; icon: React.ElementType }[]).map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px",
                activeTab === tab.id
                  ? "border-amber-500 text-amber-700"
                  : "border-transparent text-zinc-500 hover:text-zinc-700"
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === "assistant" && <AssistantTab />}
      {activeTab === "knowledge" && <KnowledgeTab />}
      {activeTab === "brain" && <BrainTab />}
    </div>
  );
}

// ============ AI Assistant Tab ============
function AssistantTab() {
  const [activeAgent, setActiveAgent] = React.useState(AGENT_TYPES[0].id);
  const [input, setInput] = React.useState("");
  const [messages, setMessages] = React.useState<Msg[]>([]);
  const [loading, setLoading] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const agent = AGENT_TYPES.find((a) => a.id === activeAgent)!;
  const AgentIcon = ICONS[agent.icon] || Bot;

  React.useEffect(() => { setMessages([]); }, [activeAgent]);
  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    setInput("");
    const next: Msg[] = [...messages, { role: "user", content }];
    setMessages(next);
    setLoading(true);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content, agentType: activeAgent, history: messages }),
      });
      const data = await res.json();
      setMessages([...next, { role: "assistant", content: data.reply || "Sorry, I couldn't process that." }]);
    } catch {
      setMessages([...next, { role: "assistant", content: "Connection error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Agent selector */}
      <Card className="lg:col-span-1 border-zinc-200">
        <CardContent className="p-4">
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">AI Agents</p>
          <div className="flex flex-col gap-1.5">
            {AGENT_TYPES.map((a) => {
              const Icon = ICONS[a.icon] || Bot;
              return (
                <button
                  key={a.id}
                  onClick={() => setActiveAgent(a.id)}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-left transition-colors",
                    activeAgent === a.id ? "bg-amber-50 text-amber-800 border border-amber-200" : "text-zinc-600 hover:bg-zinc-50 border border-transparent"
                  )}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" style={{ color: a.color }} />
                  <span className="truncate">{a.label}</span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Chat area */}
      <Card className="lg:col-span-3 border-zinc-200 flex flex-col" style={{ height: "600px" }}>
        <CardContent className="p-4 flex flex-col h-full">
          {/* Agent header */}
          <div className="flex items-center gap-3 pb-3 border-b border-zinc-100">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: agent.color + "20" }}>
              <AgentIcon className="h-4 w-4" style={{ color: agent.color }} />
            </div>
            <div>
              <p className="font-semibold text-sm text-zinc-800">{agent.label}</p>
              <p className="text-xs text-zinc-500">{agent.description}</p>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto py-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <Bot className="h-10 w-10 mx-auto text-zinc-300 mb-3" />
                <p className="text-sm text-zinc-500 mb-4">Ask me anything about {agent.label.toLowerCase()}.</p>
                <div className="flex flex-col gap-2 max-w-md mx-auto">
                  {agent.suggestedQuestions?.slice(0, 3).map((q: string, i: number) => (
                    <button
                      key={i}
                      onClick={() => send(q)}
                      className="text-left px-3 py-2 rounded-lg bg-zinc-50 hover:bg-amber-50 text-sm text-zinc-600 hover:text-amber-700 transition-colors border border-zinc-100 hover:border-amber-200"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={cn("flex gap-3", m.role === "user" && "flex-row-reverse")}>
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                  m.role === "user" ? "bg-amber-100" : "bg-zinc-100"
                )}>
                  {m.role === "user" ? <UserIcon className="h-4 w-4 text-amber-600" /> : <Bot className="h-4 w-4 text-zinc-500" />}
                </div>
                <div className={cn(
                  "rounded-2xl px-4 py-2.5 max-w-[80%] text-sm",
                  m.role === "user" ? "bg-amber-500 text-white" : "bg-zinc-100 text-zinc-800"
                )}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center">
                  <Loader2 className="h-4 w-4 text-zinc-400 animate-spin" />
                </div>
                <div className="bg-zinc-100 rounded-2xl px-4 py-2.5">
                  <Loader2 className="h-4 w-4 text-zinc-400 animate-spin" />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="pt-3 border-t border-zinc-100 flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder={`Ask ${agent.label}...`}
              className="min-h-[44px] max-h-[120px] resize-none"
              rows={1}
            />
            <Button onClick={() => send()} disabled={loading || !input.trim()} className="bg-amber-500 hover:bg-amber-600 text-white">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============ Knowledge Base Tab ============
function KnowledgeTab() {
  const [articles, setArticles] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState("all");
  const [selected, setSelected] = React.useState<any | null>(null);
  const [sheetOpen, setSheetOpen] = React.useState(false);

  const CAT_ICONS: Record<string, React.ElementType> = {
    sop: ListChecks, policy: Scale, handbook: FileText, training: HelpCircle, process: ClipboardList, technical: Wrench, faq: HelpCircle,
  };

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("q", search);
      if (filter !== "all") params.set("category", filter);
      const res = await fetch(`/api/knowledge?${params}`);
      const data = await res.json();
      setArticles(data.articles || data.knowledge || []);
    } catch { setArticles([]); }
    finally { setLoading(false); }
  }, [search, filter]);

  React.useEffect(() => { load(); }, [load]);

  const open = (a: any) => { setSelected(a); setSheetOpen(true); };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Search knowledge base..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="sop">SOPs</SelectItem>
            <SelectItem value="policy">Policies</SelectItem>
            <SelectItem value="handbook">Handbook</SelectItem>
            <SelectItem value="training">Training</SelectItem>
            <SelectItem value="faq">FAQ</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Articles */}
      {loading ? (
        <div className="text-center py-12"><Loader2 className="h-6 w-6 animate-spin mx-auto text-zinc-400" /></div>
      ) : articles.length === 0 ? (
        <Card className="border-zinc-200"><CardContent className="p-12 text-center text-zinc-400">
          <BookOpen className="h-10 w-10 mx-auto mb-2 opacity-30" />
          <p>No articles found.</p>
        </CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {articles.map((a) => {
            const Icon = CAT_ICONS[a.category] || FileText;
            return (
              <Card key={a.id} className="border-zinc-200 hover:border-amber-300 cursor-pointer transition-colors" onClick={() => open(a)}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: (CAT_COLORS[a.category] || "#52525b") + "20" }}>
                      <Icon className="h-3.5 w-3.5" style={{ color: CAT_COLORS[a.category] || "#52525b" }} />
                    </div>
                    <Badge variant="outline" className="text-xs">{a.category}</Badge>
                  </div>
                  <h3 className="font-semibold text-sm text-zinc-800 line-clamp-2 mb-1">{a.title}</h3>
                  <p className="text-xs text-zinc-500 line-clamp-2">{a.content?.substring(0, 120)}...</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Detail Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{selected?.title}</SheetTitle>
            <SheetDescription>{selected?.category}</SheetDescription>
          </SheetHeader>
          <div className="mt-4 text-sm text-zinc-600 whitespace-pre-wrap">{selected?.content}</div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

// ============ AI Brain Tab ============
function BrainTab() {
  const [knowledge, setKnowledge] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState("all");
  const [selected, setSelected] = React.useState<any | null>(null);
  const [sheetOpen, setSheetOpen] = React.useState(false);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("q", search);
      if (filter !== "all") params.set("category", filter);
      const res = await fetch(`/api/ai-brain?${params}`);
      const data = await res.json();
      setKnowledge(data.knowledge || []);
    } catch { setKnowledge([]); }
    finally { setLoading(false); }
  }, [search, filter]);

  React.useEffect(() => { load(); }, [load]);

  const openItem = async (item: any) => {
    setSelected(item);
    setSheetOpen(true);
    try {
      await fetch("/api/ai-brain", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "view", id: item.id }) });
    } catch {}
  };

  const feedback = async (id: string, helpful: boolean) => {
    try {
      await fetch("/api/ai-brain", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "feedback", id, helpful }) });
      toast.success(helpful ? "Marked as helpful" : "Feedback recorded");
    } catch { toast.error("Failed to record feedback"); }
  };

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="font-semibold text-zinc-800">Company Knowledge Hub</h3>
          <p className="text-xs text-zinc-500">AI-curated knowledge from across the organization.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => load()}>
          <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input placeholder="Search AI Brain..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="sop">SOPs</SelectItem>
            <SelectItem value="policy">Policies</SelectItem>
            <SelectItem value="handbook">Handbook</SelectItem>
            <SelectItem value="training">Training</SelectItem>
            <SelectItem value="process">Process</SelectItem>
            <SelectItem value="technical">Technical</SelectItem>
            <SelectItem value="faq">FAQ</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Knowledge cards */}
      {loading ? (
        <div className="text-center py-12"><Loader2 className="h-6 w-6 animate-spin mx-auto text-zinc-400" /></div>
      ) : knowledge.length === 0 ? (
        <Card className="border-zinc-200"><CardContent className="p-12 text-center text-zinc-400">
          <Brain className="h-10 w-10 mx-auto mb-2 opacity-30" />
          <p>No knowledge entries found.</p>
        </CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {knowledge.map((item) => (
            <Card key={item.id} className="border-zinc-200 hover:border-amber-300 cursor-pointer transition-colors" onClick={() => openItem(item)}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="text-xs" style={{ color: CAT_COLORS[item.category] || "#52525b" }}>{item.category}</Badge>
                  {item.views != null && <span className="text-xs text-zinc-400 flex items-center gap-1"><Eye className="h-3 w-3" />{item.views}</span>}
                </div>
                <h3 className="font-semibold text-sm text-zinc-800 line-clamp-2 mb-1">{item.title}</h3>
                <p className="text-xs text-zinc-500 line-clamp-2">{item.content?.substring(0, 120)}...</p>
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-zinc-100">
                  <button onClick={(e) => { e.stopPropagation(); feedback(item.id, true); }} className="p-1 rounded hover:bg-green-50 text-zinc-400 hover:text-green-600 transition-colors">
                    <ThumbsUp className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); feedback(item.id, false); }} className="p-1 rounded hover:bg-red-50 text-zinc-400 hover:text-red-600 transition-colors">
                    <ThumbsDown className="h-3.5 w-3.5" />
                  </button>
                  {item.updatedAt && <span className="text-xs text-zinc-400 ml-auto">{timeAgo(item.updatedAt)}</span>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Detail Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{selected?.title}</SheetTitle>
            <SheetDescription>{selected?.category}</SheetDescription>
          </SheetHeader>
          <div className="mt-4 text-sm text-zinc-600 whitespace-pre-wrap">{selected?.content}</div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
