import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateCompletion, PROVIDER_DEFAULTS } from "@/lib/ai-providers";
import { db } from "@/lib/db";

const Body = z.object({
  message: z.string().min(1).max(2000),
  history: z.array(z.object({ role: z.string(), content: z.string() })).optional().default([]),
});

export const runtime = "nodejs";
export const maxDuration = 30;
const SYSTEM_PROMPT = `You are the Magnence website AI assistant. Magnence is an AI-first technology and creative company headquartered in Bangalore, India with a second office in Gurugram, India.

ABOUT MAGNENCE:
- Tagline: "Imagine. Create. Engineer. Elevate."
- Founded 2020 in Bangalore, India by Anurag Singh
- 150+ projects shipped, 50+ clients across 8 countries (India, US, UK, Singapore, UAE, Australia, Canada, Germany)
- Founder & CEO: Anurag Singh
- Head of Design & Creative: Rituraj Sharma
- Principal Engineer: Yashraj Kumar
- Automation Architect: Reeshav Raj
- Senior-only team (no juniors learning on client time)
- Different dedicated teams for different works and domains, all under one roof
- Strict 1-to-1 confidentiality: client data, projects, and work products are kept private to each client. No data sharing, no cross-client reuse of confidential assets. NDA-friendly.

OFFICES:
- Headquarters: Bangalore, Karnataka, India
- Second office: Gurugram, Haryana, India
- Hours: 24×7 Available

SERVICES (all under one roof, at client's budget):
1. Artificial Intelligence — AI agents, RAG systems, LLM integrations, AI automation, prompt engineering, AI consulting
2. Software Development — custom web apps, SaaS platforms, ERP, CRM, internal platforms, API development
3. Web & Mobile — responsive websites, PWAs, mobile apps, customer portals, admin dashboards, e-commerce
4. Automation — business process, CRM, marketing, HR, finance, document, integration automation
5. UI/UX Design — product strategy, UX research, UI design, design systems, prototyping, wireframing
6. Branding & Creative — brand identity, logo design, brand guidelines, motion graphics, video editing, 3D modeling & rendering
7. Digital Marketing — SEO, social media, performance marketing, content marketing, email marketing, analytics

PRICING:
- Project-based: starting from ₹2L (fixed scope, fixed price, fixed timeline)
- Retainer: starting from ₹1.5L/month (monthly engagement with dedicated pod)
- Dedicated team: custom quote (full Magnence team embedded with client)
- Most projects range ₹2L–₹50L depending on scope

PROCESS (9 steps):
1. Discovery & Business Analysis
2. Strategy & Solution Design
3. Architecture Planning
4. UI/UX Design
5. Agile Development
6. Testing & QA
7. Deployment
8. Training & Knowledge Transfer
9. Ongoing Support & Optimization

INDUSTRIES SERVED:
Technology, SaaS, Healthcare, Education, Logistics, Manufacturing, Retail, Real Estate, Finance, Professional Services, Startups, SMB, Enterprise

CONTACT:
- Email: support@magnence.com
- Phone: +91 9470961258 (24×7 available)
- Headquarters: Bangalore, Karnataka, India
- Second Office: Gurugram, Haryana, India
- Hours: 24×7 Available
- Response time: within 24 hours
- Careers: careers@magnence.com

SOCIAL:
- LinkedIn: https://www.linkedin.com/company/magnenceindia/
- Instagram: https://www.instagram.com/magnenceindia/
- Twitter/X: https://x.com/magnenceindia
- Facebook: https://facebook.com/magnenceindia
- YouTube: https://youtube.com/@magnenceindia

CONFIDENTIALITY:
Every engagement is 1-to-1 and confidential. We do not share client data, code, or project details across clients. NDAs are signed by default. Your work stays yours.

YOUR BEHAVIOR:
- Be warm, concise (max 3 short sentences for general answers, max 5 for detailed questions)
- Always end by suggesting they visit /contact to start a project or book a free call
- If asked about something not covered above, suggest emailing support@magnence.com
- Don't make up specific prices for custom projects — say "depends on scope" and suggest a discovery call
- Don't claim to be human; you're the Magnence AI assistant named Mag
- Don't share internal company details beyond what's public on the website`;

// Fallback responses if AI providers are not configured
const FALLBACK_RESPONSES: { match: (msg: string) => boolean; reply: string }[] = [
  {
    match: (m) => /service|offer|do you (do|provide|offer)/i.test(m),
    reply:
      "We offer 7 core services under one roof: AI Development, Software Development, Web & Mobile, Automation, UI/UX Design, Branding & Creative (including video editing and 3D rendering), and Digital Marketing. All staffed by senior specialists as dedicated teams for every domain. Want to explore any specific service?",
  },
  {
    match: (m) => /price|cost|quote|how much|budget|rate/i.test(m),
    reply:
      "Most projects range from ₹2L to ₹50L depending on scope. We offer project-based (from ₹2L), retainer (from ₹1.5L/month), and dedicated team engagements. Book a free 30-min discovery call at /contact and we'll send a fixed-price quote within 48 hours.",
  },
  {
    match: (m) => /process|how do you work|methodology|approach/i.test(m),
    reply:
      "Our 9-step process: Discovery → Strategy → Architecture → Design → Development → Testing → Deployment → Training → Support. It's refined over 150+ shipped projects. See /process for the full breakdown.",
  },
  {
    match: (m) => /industry|sector|who do you (work|serve)/i.test(m),
    reply:
      "We've shipped production systems across 13+ industries: Technology, SaaS, Healthcare, Education, Logistics, Manufacturing, Retail, Real Estate, Finance, Professional Services, Startups, SMB, and Enterprise. See /industries for case studies.",
  },
  {
    match: (m) => /contact|email|reach|talk|call|book/i.test(m),
    reply:
      "You can reach us at support@magnence.com or call +91 9470961258 (24×7 available). Fill out the contact form at /contact — we reply within 24 hours.",
  },
  {
    match: (m) => /where|location|based|office|address/i.test(m),
    reply:
      "We're headquartered in Bangalore, India with a second office in Gurugram — and we work with clients worldwide across 8 countries (India, US, UK, Singapore, UAE, Australia, Canada, Germany). Email support@magnence.com to start a conversation.",
  },
  {
    match: (m) => /timeline|how long|fast|quick|asap/i.test(m),
    reply:
      "Timelines depend on scope. MVP builds: 4–8 weeks. Full SaaS platforms: 3–6 months. Enterprise systems: 6+ months. We ship in sprints with weekly demos, so you see progress every week. Tell us about your project at /contact for a specific timeline.",
  },
];

const DEFAULT_FALLBACK =
  "Great question! For detailed info tailored to your situation, please visit /contact or call +91 9470961258 (24×7 available). You can also email support@magnence.com directly.";

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = Body.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Invalid request" },
        { status: 400 }
      );
    }

    const { message, history } = parsed.data;

    // Try real AI first — only if a provider is actually configured with an API key
    try {
      const activeProvider = await db.aIProvider.findFirst({
        where: { active: true, NOT: { apiKey: null } },
      });

      if (activeProvider) {
        const providerName = activeProvider.name;
        const defaultModel = (() => {
          try {
            const models = JSON.parse(activeProvider.models);
            return Array.isArray(models) && models.length > 0 ? models[0] : undefined;
          } catch {
            return undefined;
          }
        })();

        // Build conversation history for the AI
        const conversationMessages: { role: "system" | "user" | "assistant"; content: string }[] = [
          { role: "system", content: SYSTEM_PROMPT },
          ...history.slice(-6).map((h) => ({
            role: (h.role === "user" ? "user" : "assistant") as "user" | "assistant",
            content: h.content,
          })),
          { role: "user", content: message },
        ];

        const response = await generateCompletion(providerName, activeProvider, {
          messages: conversationMessages,
          temperature: 0.7,
          maxTokens: 300,
          model: defaultModel,
        });

        if (response?.content && response.content.trim().length > 0) {
          // Check if response is the generic OS fallback (we don't want that for the public site)
          if (
            response.content.includes("Magnence OS") ||
            response.content.includes("Knowledge Base for documented procedures") ||
            response.content.includes("leave") && response.content.includes("policy")
          ) {
            throw new Error("Got OS fallback response, using website fallback instead");
          }

          // Log the conversation for analytics (no PII)
          try {
            await db.auditLog.create({
              data: {
                userId: null,
                action: "SITE_CHAT",
                category: "system",
                target: "website-chat",
                meta: JSON.stringify({ message: message.slice(0, 200) }),
                ipAddress:
                  req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
                  req.headers.get("x-real-ip") ??
                  null,
                createdAt: new Date(),
              },
            });
          } catch {
            // Don't fail the chat if logging fails
          }

          return NextResponse.json({ ok: true, reply: response.content.trim() });
        }
      }
      // No provider configured — fall through to fallback
      throw new Error("No AI provider configured");
    } catch (aiErr) {
      console.error("[/api/site/chat] AI provider failed, using fallback:", aiErr);
      // Fall through to fallback
    }

    // Fallback to rule-based responses
    const fallback =
      FALLBACK_RESPONSES.find((f) => f.match(message))?.reply ?? DEFAULT_FALLBACK;

    return NextResponse.json({ ok: true, reply: fallback });
  } catch (err) {
    console.error("[/api/site/chat] Error:", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong" },
      { status: 500 }
    );
  }
}
