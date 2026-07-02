// Multi-Provider AI Abstraction Layer
// Supports: OpenAI, Anthropic, Google Gemini, Grok (xAI), Ollama (local)

export interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AIProviderConfig {
  name: string;
  displayName: string;
  apiKey?: string;
  baseUrl?: string;
  models: string[];
}

export interface AICompletionRequest {
  messages: AIMessage[];
  temperature?: number;
  maxTokens?: number;
  model?: string;
}

export interface AICompletionResponse {
  content: string;
  model: string;
  provider: string;
}

// Default models for each provider
export const PROVIDER_DEFAULTS: Record<string, { displayName: string; models: string[]; defaultModel: string; baseUrl?: string }> = {
  openai: {
    displayName: "OpenAI",
    models: ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "gpt-3.5-turbo", "o1-preview", "o1-mini"],
    defaultModel: "gpt-4o",
  },
  anthropic: {
    displayName: "Anthropic (Claude)",
    models: ["claude-3-5-sonnet-20241022", "claude-3-5-haiku-20241022", "claude-3-opus-20240229"],
    defaultModel: "claude-3-5-sonnet-20241022",
  },
  gemini: {
    displayName: "Google Gemini",
    models: ["gemini-2.0-flash", "gemini-1.5-pro", "gemini-1.5-flash", "gemini-pro"],
    defaultModel: "gemini-2.0-flash",
  },
  grok: {
    displayName: "Grok (xAI)",
    models: ["grok-2", "grok-2-mini", "grok-beta"],
    defaultModel: "grok-2",
  },
  ollama: {
    displayName: "Ollama (Local)",
    models: ["llama3.1", "llama3", "mistral", "phi3", "qwen2.5", "gemma2", "codellama"],
    defaultModel: "llama3.1",
    baseUrl: "http://localhost:11434",
  },
};

/**
 * Generate a completion using the specified provider.
 * Falls back to a built-in response if no provider is configured.
 */
export async function generateCompletion(
  provider: string,
  config: AIProviderConfig | null,
  request: AICompletionRequest
): Promise<AICompletionResponse> {
  const model = request.model || (config?.models ? JSON.parse(config.models)[0] : PROVIDER_DEFAULTS[provider]?.defaultModel) || "gpt-4o";

  // If no API key configured, use fallback
  if (!config?.apiKey && provider !== "ollama") {
    return {
      content: fallbackResponse(request.messages),
      model,
      provider,
    };
  }

  try {
    switch (provider) {
      case "openai":
        return await callOpenAI(config, request, model);
      case "anthropic":
        return await callAnthropic(config, request, model);
      case "gemini":
        return await callGemini(config, request, model);
      case "grok":
        return await callGrok(config, request, model);
      case "ollama":
        return await callOllama(config, request, model);
      default:
        return { content: fallbackResponse(request.messages), model, provider };
    }
  } catch (error) {
    console.error(`[AI] ${provider} error:`, error);
    return { content: fallbackResponse(request.messages), model, provider };
  }
}

// === OpenAI ===
async function callOpenAI(config: AIProviderConfig | null, request: AICompletionRequest, model: string): Promise<AICompletionResponse> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${config?.apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: request.messages,
      temperature: request.temperature ?? 0.6,
      max_tokens: request.maxTokens ?? 800,
    }),
  });
  if (!res.ok) throw new Error(`OpenAI API error: ${res.status}`);
  const data = await res.json();
  return {
    content: data.choices?.[0]?.message?.content?.trim() || fallbackResponse(request.messages),
    model,
    provider: "openai",
  };
}

// === Anthropic (Claude) ===
async function callAnthropic(config: AIProviderConfig | null, request: AICompletionRequest, model: string): Promise<AICompletionResponse> {
  const systemMsg = request.messages.find(m => m.role === "system");
  const conversationMsgs = request.messages.filter(m => m.role !== "system");

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": config?.apiKey || "",
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: request.maxTokens ?? 800,
      temperature: request.temperature ?? 0.6,
      system: systemMsg?.content || "",
      messages: conversationMsgs.map(m => ({ role: m.role, content: m.content })),
    }),
  });
  if (!res.ok) throw new Error(`Anthropic API error: ${res.status}`);
  const data = await res.json();
  return {
    content: data.content?.[0]?.text?.trim() || fallbackResponse(request.messages),
    model,
    provider: "anthropic",
  };
}

// === Google Gemini ===
async function callGemini(config: AIProviderConfig | null, request: AICompletionRequest, model: string): Promise<AICompletionResponse> {
  const systemMsg = request.messages.find(m => m.role === "system");
  const contents = request.messages
    .filter(m => m.role !== "system")
    .map(m => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] }));

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${config?.apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents,
      systemInstruction: systemMsg ? { parts: [{ text: systemMsg.content }] } : undefined,
      generationConfig: {
        temperature: request.temperature ?? 0.6,
        maxOutputTokens: request.maxTokens ?? 800,
      },
    }),
  });
  if (!res.ok) throw new Error(`Gemini API error: ${res.status}`);
  const data = await res.json();
  return {
    content: data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || fallbackResponse(request.messages),
    model,
    provider: "gemini",
  };
}

// === Grok (xAI) — OpenAI-compatible API ===
async function callGrok(config: AIProviderConfig | null, request: AICompletionRequest, model: string): Promise<AICompletionResponse> {
  const res = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${config?.apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: request.messages,
      temperature: request.temperature ?? 0.6,
      max_tokens: request.maxTokens ?? 800,
    }),
  });
  if (!res.ok) throw new Error(`Grok API error: ${res.status}`);
  const data = await res.json();
  return {
    content: data.choices?.[0]?.message?.content?.trim() || fallbackResponse(request.messages),
    model,
    provider: "grok",
  };
}

// === Ollama (Local) ===
async function callOllama(config: AIProviderConfig | null, request: AICompletionRequest, model: string): Promise<AICompletionResponse> {
  const baseUrl = config?.baseUrl || "http://localhost:11434";
  const res = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      messages: request.messages,
      stream: false,
      options: {
        temperature: request.temperature ?? 0.6,
        num_predict: request.maxTokens ?? 800,
      },
    }),
  });
  if (!res.ok) throw new Error(`Ollama API error: ${res.status}`);
  const data = await res.json();
  return {
    content: data.message?.content?.trim() || fallbackResponse(request.messages),
    model,
    provider: "ollama",
  };
}

// === Fallback response when no AI provider is configured ===
function fallbackResponse(messages: AIMessage[]): string {
  const userMsg = messages.find(m => m.role === "user");
  const msg = userMsg?.content || "";
  const lower = msg.toLowerCase();

  if (lower.includes("leave") && lower.includes("policy")) {
    return "Leave Policy:\n\n- 12 sick days/year\n- 20 vacation days (employees), 5 (interns)\n- 5 casual days/year\n- Apply via Support > New Ticket > HR\n- Manager approval required for >2 consecutive days\n\nWould you like to apply for leave?";
  }
  if (lower.includes("payroll") || lower.includes("salary")) {
    return "Payroll information is managed by the Finance department. Payday is the last working day of each month. For specific salary inquiries, please contact HR or Finance directly.";
  }
  if (lower.includes("onboard")) {
    return "Onboarding SOP:\n1. Send welcome email within 1 business day\n2. Schedule kickoff call within 3 business days\n3. Create project workspace\n4. Assign account manager\n5. Send brand questionnaire\n\nWould you like the welcome email template?";
  }
  if (lower.includes("expense")) {
    return "Expense Report SOP:\n1. Open Magnence > Support > New Ticket\n2. Category: Billing\n3. Attach receipts\n4. Submit within 30 days\n5. Finance approves within 5 business days";
  }
  if (lower.includes("remote") || lower.includes("work from home")) {
    return "Remote work policy: Employees may work remotely up to 3 days/week with manager approval. Core hours 10am to 4pm local time.";
  }
  if (lower.includes("ticket")) {
    return "To create a support ticket:\n1. Click Support Center in the left menu\n2. Click 'New Ticket'\n3. Choose ticket type\n4. Fill title, priority, description\n5. Submit — Support team is notified instantly";
  }

  return "I'm here to help! I can assist with company policies, SOPs, leave processes, expense reports, and feature guidance. Could you provide more detail about what you need? You can also check the Knowledge Base for documented procedures.";
}
