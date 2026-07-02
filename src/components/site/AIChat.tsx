"use client";

import * as React from "react";
import { Headphones, X, ArrowRight, Send, Loader2, CheckCircle2, Sparkles, DollarSign, FileText, MessageSquare } from "lucide-react";

interface Message {
  role: "bot" | "user";
  text: string;
  cta?: { label: string; href: string };
  showQuickReplies?: boolean;
}

interface FormData {
  fullName?: string;
  email?: string;
  company?: string;
  phone?: string;
  service?: string;
  budget?: string;
  timeline?: string;
  callTiming?: string;
  message?: string;
}

type ChatMode = "general" | "quote_form" | "pricing";

const QUOTE_STEPS: { key: keyof FormData; question: string; placeholder: string; type?: "text" | "select"; options?: string[] }[] = [
  { key: "fullName", question: "Great! Let's get you a quote. What's your full name?", placeholder: "e.g., Anurag Singh" },
  { key: "email", question: "Thanks! What's your work email address?", placeholder: "e.g., anurag@company.com" },
  { key: "phone", question: "Got it. What's your phone number? (We're available 24×7)", placeholder: "e.g., +91 9470961258" },
  { key: "company", question: "What company are you with?", placeholder: "e.g., Magnence" },
  { key: "service", question: "Which service are you interested in?", type: "select", options: ["Artificial Intelligence", "Software Development", "Web & Mobile", "Automation", "UI/UX Design", "Branding", "Marketing", "Video Editing", "3D & Rendering", "Other"] },
  { key: "budget", question: "What's your project budget?", type: "select", options: ["Under ₹1L", "₹1L – 5L", "₹5L – 20L", "₹20L+", "Prefer not to say"] },
  { key: "timeline", question: "What's your project timeline?", type: "select", options: ["ASAP", "1 – 3 months", "3 – 6 months", "6+ months"] },
  { key: "callTiming", question: "When should we call you?", type: "select", options: ["Morning (9 AM – 12 PM IST)", "Afternoon (12 PM – 4 PM IST)", "Evening (4 PM – 7 PM IST)", "Night (7 PM – 10 PM IST)", "Anytime (24×7 available)"] },
  { key: "message", question: "Finally, tell us about your project. What are you building?", placeholder: "Describe your project, the problem you're solving, and any specific requirements..." },
];

const PRICING_INFO = [
  { tier: "Project-Based", price: "From ₹2L", desc: "Fixed scope, fixed price, fixed timeline. Best for well-defined projects like MVPs, marketing sites, or brand projects." },
  { tier: "Retainer", price: "From ₹1.5L/month", desc: "Monthly engagement with a dedicated pod. Best for ongoing product development, design, or marketing programs." },
  { tier: "Dedicated Team", price: "Custom quote", desc: "A full Magnence team embedded with yours. Best for complex, multi-year platform builds or scale-ups." },
];

export function AIChat() {
  const [open, setOpen] = React.useState(false);
  const [input, setInput] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const [mode, setMode] = React.useState<ChatMode>("general");
  const [quoteStep, setQuoteStep] = React.useState(0);
  const [formData, setFormData] = React.useState<FormData>({});
  const [messages, setMessages] = React.useState<Message[]>([
    {
      role: "bot",
      text: "👋 Hi! I'm Mag — your Magnence AI assistant. How can I help you today?",
      showQuickReplies: true,
    },
  ]);

  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  React.useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  const addMessage = (msg: Message) => {
    setMessages((prev) => [...prev, msg]);
  };

  const sendToBackend = async (userText: string) => {
    setSending(true);
    try {
      const res = await fetch("/api/site/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          history: messages
            .filter((m) => m.text)
            .slice(-6)
            .map((m) => ({ role: m.role === "bot" ? "assistant" : "user", content: m.text })),
        }),
      });
      const data = await res.json();
      if (data.ok && data.reply) {
        const lower = userText.toLowerCase();
        let cta: { label: string; href: string } | undefined;
        if (lower.includes("project") || lower.includes("quote") || lower.includes("price") || lower.includes("cost") || lower.includes("start") || lower.includes("hire") || lower.includes("build") || lower.includes("book") || lower.includes("contact")) {
          cta = { label: "Open Contact Form", href: "/contact" };
        }
        addMessage({ role: "bot", text: data.reply, cta, showQuickReplies: true });
      } else {
        throw new Error(data.error ?? "AI unavailable");
      }
    } catch {
      // Fallback responses
      const lower = userText.toLowerCase();
      let fallback = "I'd love to help with that! For detailed info, please visit /contact or call +91 9470961258 (24×7 available).";
      if (lower.includes("service")) {
        fallback = "We offer 7 core services: AI Development, Software Development, Web & Mobile, Automation, UI/UX Design, Branding (incl. video & 3D), and Digital Marketing. Want to explore any?";
      } else if (lower.includes("price") || lower.includes("cost") || lower.includes("quote")) {
        fallback = "Most projects range ₹2L–₹50L. We offer project-based (from ₹2L), retainer (from ₹1.5L/mo), and dedicated team options. Want me to collect your details for a custom quote?";
      } else if (lower.includes("process")) {
        fallback = "Our 9-step process: Discovery → Strategy → Architecture → Design → Development → Testing → Deployment → Training → Support. See /process for details.";
      }
      addMessage({ role: "bot", text: fallback, cta: { label: "Open Contact Form", href: "/contact" }, showQuickReplies: true });
    } finally {
      setSending(false);
    }
  };

  const startQuoteForm = () => {
    setMode("quote_form");
    setQuoteStep(0);
    setFormData({});
    addMessage({ role: "user", text: "Get a Quote" });
    addMessage({ role: "bot", text: QUOTE_STEPS[0].question });
  };

  const showPricingInfo = () => {
    setMode("pricing");
    addMessage({ role: "user", text: "Pricing" });
    let pricingText = "Here are our engagement models:\n\n";
    PRICING_INFO.forEach((p, i) => {
      pricingText += `${i + 1}. ${p.tier} — ${p.price}\n   ${p.desc}\n\n`;
    });
    pricingText += "Most projects range ₹2L–₹50L depending on scope. Want me to collect your details for a custom quote?";
    addMessage({ role: "bot", text: pricingText, showQuickReplies: true });
  };

  const submitQuoteForm = async (data: FormData) => {
    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: data.fullName,
          email: data.email,
          company: data.company || "",
          phone: data.phone || "",
          service: data.service,
          budget: data.budget,
          timeline: data.timeline,
          callTiming: data.callTiming,
          message: data.message || "Submitted via chat widget",
        }),
      });
      const result = await res.json();
      if (result.ok) {
        addMessage({
          role: "bot",
          text: `🎉 Thanks, ${data.fullName?.split(" ")[0]}! Your quote request has been submitted successfully.\n\nOur team will review your project and reach out within 24 hours. You can also call us anytime at +91 9470961258 (24×7 available).`,
          cta: { label: "Visit Contact Page", href: "/contact" },
          showQuickReplies: true,
        });
      } else {
        throw new Error(result.error);
      }
    } catch {
      addMessage({
        role: "bot",
        text: "I couldn't submit your request right now. Please try the contact form at /contact or call +91 9470961258.",
        cta: { label: "Open Contact Form", href: "/contact" },
        showQuickReplies: true,
      });
    } finally {
      setMode("general");
      setQuoteStep(0);
      setFormData({});
      setSending(false);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    if (mode === "quote_form") {
      // Collect form data
      const currentStep = QUOTE_STEPS[quoteStep];
      const newFormData = { ...formData, [currentStep.key]: text };
      setFormData(newFormData);
      addMessage({ role: "user", text });
      setInput("");

      const nextStep = quoteStep + 1;
      if (nextStep < QUOTE_STEPS.length) {
        setQuoteStep(nextStep);
        setTimeout(() => {
          addMessage({ role: "bot", text: QUOTE_STEPS[nextStep].question });
        }, 500);
      } else {
        // Submit form
        setTimeout(() => {
          addMessage({ role: "bot", text: "Perfect! Let me submit your request... 📤" });
          submitQuoteForm(newFormData);
        }, 500);
      }
    } else {
      // General chat
      addMessage({ role: "user", text });
      setInput("");
      sendToBackend(text);
    }
  };

  const handleQuickReply = (action: string) => {
    if (sending) return;
    if (action === "quote") {
      startQuoteForm();
    } else if (action === "pricing") {
      showPricingInfo();
    } else if (action === "services") {
      addMessage({ role: "user", text: "What services do you offer?" });
      sendToBackend("What services do you offer?");
    } else if (action === "contact") {
      addMessage({ role: "user", text: "How do I contact you?" });
      sendToBackend("How do I contact you?");
    }
  };

  // Generate quick reply buttons based on context
  const showQuickReplies = messages.length > 0 && messages[messages.length - 1].showQuickReplies && mode === "general" && !sending;

  return (
    <>
      {/* Floating button — Support/Headphones icon */}
      <button
        onClick={() => setOpen(!open)}
        className="chat-bubble fixed bottom-24 right-4 sm:bottom-6 sm:right-6 z-40 w-14 h-14 rounded-full flex items-center justify-center text-text-primary lg:bottom-6 group"
        aria-label={open ? "Close support chat" : "Open support chat"}
      >
        {open ? <X size={22} /> : <Headphones size={24} />}
        {/* Notification pulse ring */}
        {!open && (
          <span className="absolute inset-0 rounded-full border-2 border-indigo-core animate-ping opacity-30" />
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-3 sm:right-6 z-40 w-[calc(100vw-1.5rem)] sm:w-96 bg-white border border-border-strong rounded-2xl shadow-2xl flex flex-col max-h-[75vh] sm:max-h-[70vh] overflow-hidden">
          {/* Header — gradient with support icon */}
          <div className="bg-gradient-to-r from-indigo-core to-indigo-light p-4 flex items-center gap-3 relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-white/10" aria-hidden />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-white/5" aria-hidden />

            <div className="w-11 h-11 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center relative z-10 border-2 border-white/40">
              <Headphones size={22} className="text-text-primary" />
            </div>
            <div className="relative z-10 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-text-primary font-bold text-sm">Mag · Support</p>
                <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-text-primary text-[9px] font-code font-bold uppercase tracking-wider">
                  AI
                </span>
              </div>
              <p className="text-text-primary/80 text-xs flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full inline-block ${sending ? "bg-amber-300 animate-pulse" : "bg-green-400"}`} />
                {sending ? "Typing…" : mode === "quote_form" ? `Collecting details (${quoteStep + 1}/${QUOTE_STEPS.length})` : "Online · 24×7 Available"}
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="relative z-10 w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors text-text-primary"
              aria-label="Close chat"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 bg-gradient-to-b from-white to-cream/30 min-h-[200px] max-h-[45vh] thin-scroll">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2.5 text-sm ${
                    msg.role === "user"
                      ? "bg-gradient-to-br from-indigo-core to-indigo-light text-text-primary rounded-br-sm shadow-md"
                      : "bg-white text-text-primary border border-border-subtle rounded-bl-sm shadow-sm"
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  {msg.cta && (
                    <a
                      href={msg.cta.href}
                      className="inline-flex items-center gap-1 mt-2 text-cyan-signal text-xs font-semibold hover:underline"
                    >
                      {msg.cta.label} <ArrowRight size={12} />
                    </a>
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {sending && (
              <div className="flex justify-start">
                <div className="bg-white border border-border-subtle rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5 shadow-sm">
                  <span className="w-2 h-2 bg-indigo-core rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-indigo-core rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-indigo-core rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick replies — shown when bot message has showQuickReplies */}
          {showQuickReplies && (
            <div className="px-3 pt-2 pb-1 bg-white border-t border-border-subtle flex flex-wrap gap-1.5">
              <button
                onClick={() => handleQuickReply("quote")}
                className="text-xs px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-core to-indigo-light text-text-primary font-semibold hover:shadow-md transition-all flex items-center gap-1"
              >
                <FileText size={12} /> Get a Quote
              </button>
              <button
                onClick={() => handleQuickReply("pricing")}
                className="text-xs px-3 py-1.5 rounded-full border border-indigo-core/40 text-cyan-signal font-semibold hover:bg-indigo-core/10 transition-colors flex items-center gap-1"
              >
                <DollarSign size={12} /> Pricing
              </button>
              <button
                onClick={() => handleQuickReply("services")}
                className="text-xs px-3 py-1.5 rounded-full border border-border-subtle text-text-secondary hover:text-text-primary hover:border-indigo-core/40 transition-colors flex items-center gap-1"
              >
                <MessageSquare size={12} /> Services
              </button>
              <button
                onClick={() => handleQuickReply("contact")}
                className="text-xs px-3 py-1.5 rounded-full border border-border-subtle text-text-secondary hover:text-text-primary hover:border-indigo-core/40 transition-colors flex items-center gap-1"
              >
                <MessageSquare size={12} /> Contact
              </button>
            </div>
          )}

          {/* Select dropdown for quote form */}
          {mode === "quote_form" && QUOTE_STEPS[quoteStep]?.type === "select" && (
            <div className="px-3 pt-2 bg-white border-t border-border-subtle">
              <div className="flex flex-wrap gap-1.5">
                {QUOTE_STEPS[quoteStep].options?.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      const currentStep = QUOTE_STEPS[quoteStep];
                      const newFormData = { ...formData, [currentStep.key]: opt };
                      setFormData(newFormData);
                      addMessage({ role: "user", text: opt });
                      const nextStep = quoteStep + 1;
                      if (nextStep < QUOTE_STEPS.length) {
                        setQuoteStep(nextStep);
                        setTimeout(() => addMessage({ role: "bot", text: QUOTE_STEPS[nextStep].question }), 400);
                      } else {
                        setTimeout(() => {
                          addMessage({ role: "bot", text: "Perfect! Let me submit your request... 📤" });
                          submitQuoteForm(newFormData);
                        }, 400);
                      }
                    }}
                    disabled={sending}
                    className="text-xs px-3 py-1.5 rounded-full border border-indigo-core/40 text-cyan-signal hover:bg-indigo-core hover:text-text-primary transition-all disabled:opacity-50"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-border-subtle flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === "quote_form" ? (QUOTE_STEPS[quoteStep]?.placeholder || "Type...") : "Ask anything…"}
              disabled={sending || (mode === "quote_form" && QUOTE_STEPS[quoteStep]?.type === "select")}
              className="flex-1 bg-white border border-border-subtle rounded-full px-4 py-2 text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-indigo-core focus:ring-2 focus:ring-indigo-core/15 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={sending || !input.trim() || (mode === "quote_form" && QUOTE_STEPS[quoteStep]?.type === "select")}
              className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-core to-indigo-light text-text-primary flex items-center justify-center hover:shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
              aria-label="Send message"
            >
              {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            </button>
          </form>

          {/* Footer */}
          <div className="px-3 pb-2 bg-white flex items-center justify-between">
            <p className="text-text-muted text-[10px] font-code">
              Powered by Magnence
            </p>
            <a href="tel:+919470961258" className="text-cyan-signal text-[10px] font-code hover:underline">
              📞 +91 9470961258
            </a>
          </div>
        </div>
      )}
    </>
  );
}
