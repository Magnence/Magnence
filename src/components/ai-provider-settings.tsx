"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Sparkles, Key, Check, X, Plus, Trash2, Star, Cpu } from "lucide-react";
import { PROVIDER_DEFAULTS } from "@/lib/ai-providers";

const PROVIDER_ICONS: Record<string, string> = {
  openai: "🟢", anthropic: "🟠", gemini: "🔵", grok: "⚫", ollama: "🟣",
};

export function AIProviderSettings() {
  const [providers, setProviders] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [editingProvider, setEditingProvider] = React.useState<string | null>(null);
  const [apiKey, setApiKey] = React.useState("");
  const [baseUrl, setBaseUrl] = React.useState("");
  const [selectedModels, setSelectedModels] = React.useState<string[]>([]);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/providers");
      const data = await res.json();
      setProviders(data.providers || []);
    } finally { setLoading(false); }
  }, []);

  React.useEffect(() => { load(); }, [load]);

  const saveProvider = async (name: string) => {
    const defaults = PROVIDER_DEFAULTS[name];
    try {
      await fetch("/api/ai/providers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          displayName: defaults?.displayName || name,
          apiKey: apiKey || undefined,
          baseUrl: baseUrl || defaults?.baseUrl || undefined,
          models: selectedModels.length > 0 ? selectedModels : defaults?.models || [],
          isDefault: providers.filter(p => p.name === name)[0]?.isDefault || false,
        }),
      });
      toast.success(`${defaults?.displayName || name} configured`);
      setEditingProvider(null);
      setApiKey("");
      setBaseUrl("");
      setSelectedModels([]);
      load();
    } catch { toast.error("Failed to save"); }
  };

  const setDefault = async (id: string) => {
    await fetch("/api/ai/providers", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isDefault: true }),
    });
    toast.success("Default AI provider set");
    load();
  };

  const toggleActive = async (provider: any) => {
    await fetch("/api/ai/providers", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: provider.id, active: !provider.active }),
    });
    load();
  };

  const deleteProvider = async (id: string) => {
    await fetch("/api/ai/providers", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action: "delete" }),
    });
    toast.success("Provider removed");
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-base flex items-center gap-2"><Cpu className="h-5 w-5 text-[#c79a2e]" />AI Provider Configuration</h3>
          <p className="text-sm text-zinc-500 mt-1">Configure AI providers for the Magnence AI Assistant. Select a default provider and model.</p>
        </div>
      </div>

      {/* Current providers */}
      <div className="space-y-3">
        {loading ? <div className="text-center py-4 text-zinc-500">Loading providers...</div> : (
          providers.map((p) => {
            const defaults = PROVIDER_DEFAULTS[p.name];
            const models = (() => { try { return JSON.parse(p.models); } catch { return []; } })();
            const isEditing = editingProvider === p.name;
            return (
              <Card key={p.id || p.name} className="border-zinc-200">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-zinc-100 flex items-center justify-center text-xl shrink-0">
                      {PROVIDER_ICONS[p.name] || "🤖"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-sm">{p.displayName}</h4>
                        {p.isDefault && <Badge className="text-[10px] bg-[#f1c24e] text-black"><Star className="h-3 w-3 mr-0.5 fill-current" />Default</Badge>}
                        {p.active && <Badge className="text-[10px] bg-green-100 text-green-700">Active</Badge>}
                        {p.name === "ollama" && <Badge variant="outline" className="text-[10px]">Local</Badge>}
                      </div>
                      {!isEditing ? (
                        <>
                          <div className="text-xs text-zinc-500 mb-2">
                            {p.apiKey ? `API Key: ${p.apiKey.slice(0, 8)}...` : p.name === "ollama" ? `URL: ${p.baseUrl || "http://localhost:11434"}` : "Not configured"}
                          </div>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {models.map((m: string) => <Badge key={m} variant="outline" className="text-[10px">{m}</Badge>)}
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => { setEditingProvider(p.name); setApiKey(p.apiKey || ""); setBaseUrl(p.baseUrl || ""); setSelectedModels(models); }} className="h-7 text-xs border-zinc-300">
                              <Key className="h-3 w-3 mr-1" />Configure
                            </Button>
                            {!p.isDefault && p.active && <Button size="sm" variant="outline" onClick={() => setDefault(p.id)} className="h-7 text-xs border-zinc-300">Set Default</Button>}
                            <Button size="sm" variant="ghost" onClick={() => toggleActive(p)} className="h-7 text-xs">
                              <Switch checked={p.active} />
                            </Button>
                            {p.id && <Button size="sm" variant="ghost" onClick={() => deleteProvider(p.id)} className="h-7 text-xs text-red-500"><Trash2 className="h-3 w-3" /></Button>}
                          </div>
                        </>
                      ) : (
                        <div className="space-y-3 mt-2">
                          {p.name !== "ollama" && (
                            <div className="space-y-1">
                              <Label className="text-xs">API Key</Label>
                              <Input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder={`Enter ${p.displayName} API key`} className="h-8 text-xs" />
                            </div>
                          )}
                          {p.name === "ollama" && (
                            <div className="space-y-1">
                              <Label className="text-xs">Base URL</Label>
                              <Input value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} placeholder="http://localhost:11434" className="h-8 text-xs" />
                            </div>
                          )}
                          <div className="space-y-1">
                            <Label className="text-xs">Available Models</Label>
                            <div className="flex flex-wrap gap-1">
                              {(defaults?.models || []).map((m) => (
                                <button key={m} onClick={() => setSelectedModels(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m])}
                                  className={`text-xs px-2 py-1 rounded border ${selectedModels.includes(m) ? "bg-[#f1c24e] text-black border-[#f1c24e]" : "border-zinc-200 text-zinc-600"}`}>
                                  {m}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => saveProvider(p.name)} className="h-7 text-xs bg-[#f1c24e] text-black hover:bg-[#e9b73a]">Save</Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingProvider(null)} className="h-7 text-xs">Cancel</Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Add new provider */}
      {!loading && providers.length < Object.keys(PROVIDER_DEFAULTS).length && (
        <Card className="border-dashed border-zinc-300">
          <CardContent className="p-4">
            <div className="text-xs text-zinc-500 mb-2">Add a new provider:</div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(PROVIDER_DEFAULTS).filter(([name]) => !providers.some(p => p.name === name)).map(([name, config]) => (
                <Button key={name} size="sm" variant="outline" onClick={() => {
                  setEditingProvider(name); setApiKey(""); setBaseUrl(config.baseUrl || ""); setSelectedModels(config.models);
                }} className="text-xs border-zinc-300">
                  <Plus className="h-3 w-3 mr-1" />{config.displayName}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* New provider form */}
      {editingProvider && !providers.some(p => p.name === editingProvider) && (
        <Card className="border-[#f1c24e]/40 bg-[#fef8e7]">
          <CardContent className="p-4 space-y-3">
            <h4 className="font-semibold text-sm flex items-center gap-2">{PROVIDER_ICONS[editingProvider]} {PROVIDER_DEFAULTS[editingProvider]?.displayName}</h4>
            {editingProvider !== "ollama" && (
              <div className="space-y-1">
                <Label className="text-xs">API Key *</Label>
                <Input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder={`Enter ${PROVIDER_DEFAULTS[editingProvider]?.displayName} API key`} className="h-8 text-xs" />
              </div>
            )}
            {editingProvider === "ollama" && (
              <div className="space-y-1">
                <Label className="text-xs">Base URL</Label>
                <Input value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} placeholder="http://localhost:11434" className="h-8 text-xs" />
              </div>
            )}
            <div className="space-y-1">
              <Label className="text-xs">Available Models</Label>
              <div className="flex flex-wrap gap-1">
                {(PROVIDER_DEFAULTS[editingProvider]?.models || []).map((m) => (
                  <button key={m} onClick={() => setSelectedModels(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m])}
                    className={`text-xs px-2 py-1 rounded border ${selectedModels.includes(m) ? "bg-[#f1c24e] text-black border-[#f1c24e]" : "border-zinc-200 text-zinc-600"}`}>
                    {m}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => saveProvider(editingProvider)} className="h-7 text-xs bg-[#f1c24e] text-black hover:bg-[#e9b73a]">Save Provider</Button>
              <Button size="sm" variant="outline" onClick={() => setEditingProvider(null)} className="h-7 text-xs">Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700">
        <strong>How it works:</strong> The AI Assistant uses the default provider. If no provider is configured, a built-in fallback handles basic queries.
        For production use, configure at least one provider with an API key. Ollama runs locally and requires no API key.
      </div>
    </div>
  );
}
