import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getSessionUser, checkAIPermission, logAudit } from "@/lib/auth";
import { AGENT_TYPES } from "@/lib/constants";
import { generateCompletion, PROVIDER_DEFAULTS } from "@/lib/ai-providers";

const Body = z.object({
  agentType: z.string(),
  message: z.string().min(1).max(6000),
  history: z.array(z.object({ role: z.string(), content: z.string() })).optional().default([]),
  userId: z.string().optional(),
  action: z.string().optional(),
  context: z.object({
    module: z.string().optional(),
    page: z.string().optional(),
    role: z.string().optional(),
    department: z.string().optional(),
  }).optional(),
});

export const runtime = "nodejs";
export const maxDuration = 60;

const AGENT_PROMPTS: Record<string, string> = {
  company: "You are Magnence Company Assistant. Answer general company questions about policies, processes, SOPs, HR, and features. Be warm, precise, and plain-English. Use bullet points when listing steps.",
  sop: "You are Magnence SOP Assistant. Help employees understand standard operating procedures. Always be precise, reference step numbers, and offer to walk through the procedure step-by-step. Keep answers short and scannable (use bullets).",
  policy: "You are Magnence Policy Assistant. Explain company policies clearly, note exceptions, and always recommend confirming with HR for sensitive cases. Use plain language, no legal jargon.",
  feature: "You are Magnence Feature Support. Help users learn how to use Magnence OS modules (Dashboard, Tasks, Projects, Time Tracking, Meetings, Calendar, Leave, Attendance, Knowledge Base, Documents, CRM, Clients, Sales, Finance, Procurement, Inventory, Contracts, Workflows, Automation, Reports). Give step-by-step instructions, mention button names, and offer a demo.",
  screen: "You are Magnence Screen Helper. The user describes what they see on screen. You identify which Magnence module/section they're viewing, explain each visible element, and tell them what they can do next. Be patient and non-technical.",
  hr: "You are Magnence HR Assistant. Help with HR queries — leave balances, payroll dates, benefits, onboarding. Always be empathetic. For confidential matters, advise contacting HR directly.",
  productivity: "You are Magnence Productivity AI. Help users plan their day, break down large tasks into subtasks, suggest priorities, recommend deadlines, detect blockers, and generate daily work reports. When asked 'what should I work on today', suggest 3 priority tasks based on urgency and importance. When asked to break down a task, produce 4-6 actionable subtasks. Be concise and actionable.",
  crm: "You are Magnence CRM AI. Help with lead scoring (score 1-100 based on industry fit, company size, engagement, budget), lead qualification (BANT framework), follow-up suggestions, opportunity prediction, and customer insights. When scoring leads, consider: company size, industry relevance, engagement level, budget indicators. Provide specific, actionable recommendations.",
  sales: "You are Magnence Sales AI. Help generate proposals (structured with executive summary, scope, timeline, pricing), create quotes (line items with quantities, rates, discounts, tax), forecast revenue (based on pipeline probability), analyze deal risks, and provide sales coaching. Always produce ready-to-use deliverables.",
  finance: "You are Magnence Finance AI. Analyze expenses (categorize, identify trends, flag anomalies), suggest budget optimizations, review invoices, forecast cash flow (based on receivables vs payables), and provide financial insights. Use specific numbers and percentages.",
  procurement: "You are Magnence Procurement AI. Recommend vendors based on requirements, suggest cost optimizations, predict demand, and compare vendor performance. Provide specific, actionable recommendations with reasoning.",
  client: "You are Magnence Client AI. Calculate client health scores (based on engagement, revenue, support tickets, contract status, communication frequency), predict churn risk, summarize communication history, and suggest relationship-building actions. Be specific and prioritize at-risk clients.",
  marketing: "You are Magnence Marketing AI. Generate marketing content (blog posts, social captions, ad copy, email newsletters, product descriptions, press releases), suggest hashtags and content ideas, recommend posting times, analyze trending topics, suggest SEO keywords, optimize content for engagement, and provide campaign strategy recommendations. Always produce ready-to-use content with specific examples.",
  platform: "You are Magnence Platform AI. Help users with system configuration, integrations (Stripe, Slack, Google, Microsoft), API keys, webhooks, custom reports, data exports, and general platform guidance. Provide step-by-step instructions.",
  actions: "You are Magnence AI Actions agent. Generate professional content based on user requests: emails, reports, summaries, translations, rewrites, grammar fixes. Always produce ready-to-use output and ask one follow-up question to refine if needed.",
};

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = Body.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });
    }
    const { agentType, message, history, userId, action, context } = parsed.data;
    const agent = AGENT_TYPES.find((a) => a.id === agentType);
    if (!agent) return NextResponse.json({ error: "Unknown agent type" }, { status: 400 });

    const sessionUser = await getSessionUser();

    // AI Permission Check
    const permissionRefusal = checkAIPermission(sessionUser, message);
    if (permissionRefusal) {
      return NextResponse.json({ reply: permissionRefusal, sessionId: null });
    }

    const basePrompt = AGENT_PROMPTS[agentType] || AGENT_PROMPTS.company;
    const ctx = context || {};
    const userRole = ctx.role || sessionUser?.role || "EMPLOYEE";
    const userDept = ctx.department || sessionUser?.department || "General";
    const currentModule = ctx.module || "dashboard";

    // Fetch context data for specific agents
    let userContextData = "";
    if (agentType === "productivity" && sessionUser) {
      try {
        const [myTasks, myProjects] = await Promise.all([
          db.task.findMany({
            where: { assigneeId: sessionUser.id, status: { notIn: ["completed", "cancelled"] } },
            orderBy: { dueDate: "asc" }, take: 15,
            select: { id: true, title: true, priority: true, status: true, dueDate: true, projectId: true },
          }),
          db.project.findMany({ where: { status: "active" }, take: 5, select: { id: true, name: true, progress: true } }),
        ]);
        userContextData = `\n\nUSER'S CURRENT TASKS:\n${JSON.stringify(myTasks, null, 2)}\n\nACTIVE PROJECTS:\n${JSON.stringify(myProjects, null, 2)}`;
      } catch (e) { console.error("[ai-chat] context error:", e); }
    }
    if (agentType === "crm" && sessionUser) {
      try {
        const [companies, deals] = await Promise.all([
          db.company.findMany({ take: 20, select: { id: true, name: true, industry: true, size: true, revenue: true, status: true, source: true, isClient: true, _count: { select: { deals: true, activities: true } } } }),
          db.deal.findMany({ take: 20, select: { id: true, title: true, value: true, stage: true, probability: true, expectedCloseDate: true, company: { select: { name: true } } } }),
        ]);
        userContextData = `\n\nCOMPANIES:\n${JSON.stringify(companies, null, 2)}\n\nDEALS:\n${JSON.stringify(deals, null, 2)}`;
      } catch (e) { console.error("[ai-chat] crm context error:", e); }
    }
    if (agentType === "sales" && sessionUser) {
      try {
        const deals = await db.deal.findMany({ include: { company: { select: { name: true, industry: true } } }, take: 30 });
        const wonValue = deals.filter(d => d.stage === "won").reduce((s, d) => s + d.value, 0);
        const pipelineValue = deals.filter(d => !["won", "lost"].includes(d.stage)).reduce((s, d) => s + d.value, 0);
        userContextData = `\n\nDEALS PIPELINE:\n${JSON.stringify(deals.map(d => ({ title: d.title, company: d.company.name, value: d.value, stage: d.stage, probability: d.probability })), null, 2)}\n\nWon value: $${wonValue}\nPipeline value: $${pipelineValue}`;
      } catch (e) { console.error("[ai-chat] sales context error:", e); }
    }
    if (agentType === "finance" && sessionUser) {
      try {
        const [invoices, expenses] = await Promise.all([
          db.invoice.findMany({ take: 30, select: { id: true, number: true, status: true, total: true, paidAmount: true, issueDate: true, dueDate: true, company: { select: { name: true } } } }),
          db.expense.findMany({ take: 30, select: { id: true, number: true, category: true, amount: true, status: true, date: true, description: true } }),
        ]);
        userContextData = `\n\nINVOICES:\n${JSON.stringify(invoices, null, 2)}\n\nEXPENSES:\n${JSON.stringify(expenses, null, 2)}`;
      } catch (e) { console.error("[ai-chat] finance context error:", e); }
    }
    if (agentType === "marketing" && sessionUser) {
      try {
        const [campaigns, socialAccounts, recentPosts, emailCampaigns] = await Promise.all([
          db.campaign.findMany({ take: 10, select: { name: true, channel: true, status: true, budget: true, spent: true, leads: true, conversions: true, revenue: true } }),
          db.socialAccount.findMany({ select: { platform: true, handle: true, followers: true, engagement: true, posts: true } }),
          db.socialPost.findMany({ take: 10, orderBy: { createdAt: "desc" }, select: { platform: true, content: true, status: true, likes: true, comments: true, shares: true, reach: true } }),
          db.emailCampaign.findMany({ take: 5, select: { name: true, status: true, recipients: true, opened: true, clicked: true } }),
        ]);
        userContextData = `\n\nMARKETING DATA:\nCampaigns:\n${JSON.stringify(campaigns, null, 2)}\n\nSocial Accounts:\n${JSON.stringify(socialAccounts, null, 2)}\n\nRecent Posts:\n${JSON.stringify(recentPosts, null, 2)}\n\nEmail Campaigns:\n${JSON.stringify(emailCampaigns, null, 2)}`;
      } catch (e) { console.error("[ai-chat] marketing context error:", e); }
    }
    if (agentType === "client" && sessionUser) {
      try {
        const clients = await db.company.findMany({
          where: { isClient: true }, take: 20,
          include: { _count: { select: { deals: true, invoices: true, contracts: true, activities: true } }, deals: { select: { value: true, stage: true }, take: 5 }, contracts: { select: { status: true, endDate: true, value: true }, take: 3 } },
        });
        userContextData = `\n\nCLIENT COMPANIES:\n${JSON.stringify(clients.map(c => ({ name: c.name, industry: c.industry, dealCount: c._count.deals, invoiceCount: c._count.invoices, contractCount: c._count.contracts, activityCount: c._count.activities })), null, 2)}`;
      } catch (e) { console.error("[ai-chat] client context error:", e); }
    }

    const systemPrompt = `${basePrompt}

Magnence OS is a unified company workspace with modules: Dashboard, AI Assistant, Tasks, Projects, Time Tracking, Meetings, Calendar, Leave, Attendance, Knowledge Base, Documents, CRM, Clients, Sales, Finance, Procurement, Inventory, Contracts, Workflows, Automation, Reports, Marketing, Social Media, Integrations, Settings.
Current date: ${new Date().toDateString()}.
Current user role: ${userRole}
Current user department: ${userDept}
Current module: ${currentModule}${ctx.page ? `, page: ${ctx.page}` : ""}${userContextData}

${action ? `AI ACTION REQUESTED: ${action}. Format the response as the requested deliverable.` : ""}

Respond in friendly, plain English. Use short paragraphs or bullet points. Always end with one helpful follow-up suggestion.
If you don't know something company-specific, say so and suggest checking the Knowledge Base or contacting Support.`;

    const messages: { role: "system" | "user" | "assistant"; content: string }[] = [{ role: "system", content: systemPrompt }];
    for (const m of history.slice(-8)) {
      messages.push({ role: m.role === "assistant" ? "assistant" : "user", content: m.content });
    }
    messages.push({ role: "user", content: message });

    // === MULTI-PROVIDER AI CALL ===
    // Get the default/active AI provider from database
    let providerName = "fallback";
    let providerConfig: any = null;
    let selectedModel = "";

    try {
      const defaultProvider = await db.aIProvider.findFirst({ where: { isDefault: true, active: true } });
      if (!defaultProvider) {
        // Try any active provider
        const activeProvider = await db.aIProvider.findFirst({ where: { active: true } });
        if (activeProvider) {
          providerName = activeProvider.name;
          providerConfig = activeProvider;
          selectedModel = JSON.parse(activeProvider.models)[0] || "";
        }
      } else {
        providerName = defaultProvider.name;
        providerConfig = defaultProvider;
        selectedModel = JSON.parse(defaultProvider.models)[0] || "";
      }
    } catch (e) {
      console.error("[ai-chat] provider lookup error:", e);
    }

    // Generate completion using the selected provider
    const completion = await generateCompletion(providerName, providerConfig, {
      messages,
      temperature: 0.6,
      maxTokens: 1200,
      model: selectedModel || undefined,
    });

    const reply = completion.content;

    // Log AI usage
    if (sessionUser) {
      try {
        await logAudit(sessionUser.id, "ai_request", "ai", `${agentType} via ${completion.provider}/${completion.model}`);
      } catch (e) { /* ignore logging errors */ }
    }

    // Persist chat session
    if (userId || sessionUser?.id) {
      try {
        const chatSession = await db.chatSession.create({
          data: {
            userId: userId || sessionUser!.id,
            agentType,
            title: message.slice(0, 60),
            context: JSON.stringify(ctx),
            messages: {
              create: [
                { role: "user", content: message },
                { role: "assistant", content: reply, action: action || null },
              ],
            },
          },
        });
        return NextResponse.json({ reply, sessionId: chatSession.id, provider: completion.provider, model: completion.model });
      } catch (e) {
        console.error("[ai-chat] persist error:", e);
      }
    }

    return NextResponse.json({ reply, sessionId: null, provider: completion.provider, model: completion.model });
  } catch (err) {
    console.error("[ai-chat] fatal:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
