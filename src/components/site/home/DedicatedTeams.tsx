"use client";

import * as React from "react";
import { Brain, Code2, Smartphone, Workflow, Palette, Megaphone, Video, Box, ShieldCheck } from "lucide-react";
import { SectionHeading } from "../Section";
import { Reveal } from "../Reveal";
import { SiteCard } from "../SiteCard";

const TEAMS = [
  {
    icon: Brain,
    name: "AI Engineering Team",
    domain: "Artificial Intelligence",
    expertise: ["AI Agents", "RAG Systems", "LLM Integration", "Prompt Engineering"],
    description:
      "Production-grade AI systems — not demos. We ship multi-agent orchestration, retrieval-augmented generation, and LLM integrations that hold up under real load.",
  },
  {
    icon: Code2,
    name: "Software Engineering Team",
    domain: "Software Development",
    expertise: ["SaaS Platforms", "ERP", "CRM", "Internal Tools", "APIs"],
    description:
      "Custom software built by senior engineers. Clean architecture, comprehensive tests, observability baked in — engineered to scale with your business for years.",
  },
  {
    icon: Smartphone,
    name: "Web & Mobile Team",
    domain: "Web & Mobile",
    expertise: ["Next.js", "React Native", "PWAs", "E-commerce", "Portals"],
    description:
      "Responsive websites, mobile apps, and customer portals that load fast and convert. Modern stack, modern performance budget, modern UX.",
  },
  {
    icon: Workflow,
    name: "Automation Team",
    domain: "Business Automation",
    expertise: ["Process Automation", "CRM Automation", "Document Automation", "Integrations"],
    description:
      "We eliminate manual work with idempotent, observable automations. From finance ops to HR workflows — your team stops doing repetitive tasks.",
  },
  {
    icon: Palette,
    name: "Design Team",
    domain: "UI/UX Design",
    expertise: ["Product Strategy", "UX Research", "UI Design", "Design Systems"],
    description:
      "Design that ships — not just pretty mockups. Research-driven, prototype-validated, and built into a design system your engineers can actually use.",
  },
  {
    icon: Megaphone,
    name: "Branding & Marketing Team",
    domain: "Branding & Digital Marketing",
    expertise: ["Brand Identity", "SEO", "Performance Marketing", "Content"],
    description:
      "Brand identity, digital marketing, and growth — managed by the same team that ships your product. No agency handoffs, no brand-product misalignment.",
  },
  {
    icon: Video,
    name: "Video Editing Team",
    domain: "Video & Motion",
    expertise: ["Short-form Reels", "Product Videos", "Motion Graphics", "Editing"],
    description:
      "From founder reels to product launch videos — sharp, on-brand, optimized for each platform. Turned around fast because we own the brand context.",
  },
  {
    icon: Box,
    name: "3D & Rendering Team",
    domain: "3D Modeling & Rendering",
    expertise: ["Architectural Rendering", "Product 3D", "Interior Visualization", "Walkthroughs"],
    description:
      "Photorealistic renders for real estate, products, and interiors. Marketing-ready visuals delivered on deadline — directly tied to your sales motion.",
  },
];

export function DedicatedTeams() {
  return (
    <section className="py-20 lg:py-28 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            label={"// one roof, eight specialized teams"}
            title={
              <>
                Dedicated specialists for every domain —{" "}
                <span className="text-gradient-brand">united under one roof</span>
              </>
            }
            subtitle="Each discipline at Magnence is owned by a senior, specialist team — never generalists pretending to be experts, never handoffs across five competing agencies. One accountable project team coordinates eight dedicated pods, so your work moves fast and stays coherent end-to-end."
          />
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mt-14">
          {TEAMS.map((team, i) => {
            const Icon = team.icon;
            return (
              <Reveal key={team.name} delay={i * 60}>
                <SiteCard glowing className="h-full flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl icon-halo flex items-center justify-center flex-shrink-0">
                      <Icon size={22} />
                    </div>
                    <span className="text-[10px] uppercase tracking-wider text-text-muted font-code">
                      {team.domain}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-text-primary text-lg leading-tight">
                    {team.name}
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {team.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-auto pt-3 border-t border-border-subtle">
                    {team.expertise.map((e) => (
                      <span
                        key={e}
                        className="text-[10px] font-code px-2 py-1 rounded-full bg-surface text-text-muted"
                      >
                        {e}
                      </span>
                    ))}
                  </div>
                </SiteCard>
              </Reveal>
            );
          })}
        </div>

        {/* Trust strip — strict 1-to-1 confidentiality (centered, with label in box like other sections) */}
        <Reveal delay={200}>
          <div className="mt-20 lg:mt-28">
            <SectionHeading
              label={"// Confidentiality Guarantee"}
              title={
                <>
                  Strict 1-to-1 Confidentiality on{" "}
                  <span className="text-gradient-brand">Every Engagement</span>
                </>
              }
              subtitle="Your projects, data, source code, and deliverables remain strictly confidential between you and our team. Non-Disclosure Agreements are executed by default on every engagement. We do not share client information across accounts, nor do we repurpose your proprietary assets elsewhere. Full intellectual property ownership transfers to you - from the first consultation through final deployment. No exceptions, no caveats."
            />
          </div>
          <div className="mt-10 max-w-4xl mx-auto rounded-3xl overflow-hidden relative bg-white border-2 border-[#fbc607]/30 shadow-[0_8px_40px_rgba(251,198,7,0.08)]">
            {/* Subtle gold glow accents */}
            <div
              className="absolute top-0 right-0 w-96 h-96 pointer-events-none"
              style={{ background: "radial-gradient(circle at top right, rgba(251,198,7,0.10) 0%, transparent 60%)" }}
              aria-hidden
            />
            <div
              className="absolute bottom-0 left-0 w-96 h-96 pointer-events-none"
              style={{ background: "radial-gradient(circle at bottom left, rgba(245,158,11,0.08) 0%, transparent 60%)" }}
              aria-hidden
            />

            <div className="relative p-8 lg:p-12 flex flex-col sm:flex-row items-center gap-8 lg:gap-10">
              {/* Shield icon */}
              <div className="flex-shrink-0">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{
                    background: "rgba(251,198,7,0.15)",
                    border: "1.5px solid rgba(251,198,7,0.5)",
                    boxShadow: "0 0 28px rgba(251,198,7,0.15)",
                  }}
                >
                  <ShieldCheck size={30} style={{ color: "#d4a017" }} />
                </div>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 w-full">
                {[
                  "NDA executed by default",
                  "No cross-client data sharing",
                  "Full IP ownership transfers to you",
                  "Private repos & dedicated channels",
                ].map((item) => (
                  <span
                    key={item}
                    className="flex items-center gap-2.5 text-sm font-code text-[#2a2a2a]"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: "#fbc607", boxShadow: "0 0 8px rgba(251,198,7,0.6)" }}
                    />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
