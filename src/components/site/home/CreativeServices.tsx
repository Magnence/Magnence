"use client";

import * as React from "react";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "../Section";
import { Reveal } from "../Reveal";
import { SiteCard } from "../SiteCard";
import { Icon } from "../Icon";
import { MagneticButton } from "../MagneticButton";

const CREATIVE_SERVICES = [
  {
    icon: "Megaphone",
    title: "Marketing",
    description: "SEO, paid acquisition, social media, content, and email lifecycle — full-funnel growth marketing owned by a dedicated team.",
    deliverables: ["SEO & content engine", "Paid ads (Google, Meta, LinkedIn)", "Social & community", "Email lifecycle"],
  },
  {
    icon: "Video",
    title: "Video Editing",
    description: "Reels, ad creative, explainers, brand films, and product demos — scripted, edited, color-graded, and delivered platform-ready.",
    deliverables: ["Short-form reels", "Ad creative variants", "Explainer videos", "Color grading & audio"],
  },
  {
    icon: "Brush",
    title: "Designing",
    description: "Brand identity, UI/UX, marketing creative, presentation design, and motion graphics — distinctive, on-brand, on-deadline.",
    deliverables: ["Brand identity", "UI/UX design", "Marketing creative", "Motion graphics"],
  },
  {
    icon: "Box",
    title: "3D Modeling",
    description: "Product visualization, architectural renders, character models, and 3D assets optimized for render or real-time use.",
    deliverables: ["Product models", "Architectural models", "3D assets", "AR/3D web"],
  },
  {
    icon: "Sparkles",
    title: "Rendering",
    description: "Photoreal 3D rendering — interior, exterior, product, and configurator renders with cinematic lighting and post-production.",
    deliverables: ["Product renders", "Architectural renders", "360 spins", "Walkthroughs"],
  },
];

export function CreativeServices() {
  return (
    <section className="py-20 lg:py-28 bg-surface border-y border-border-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            label="// creative services"
            title={
              <>
                Creative Services Under <span className="text-gradient-brand">One Roof</span>
              </>
            }
            subtitle="Different teams. Different disciplines. One accountable partner. Marketing, video editing, designing, 3D modeling, and rendering — staffed by senior specialists and delivered at your budget."
          />
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-14">
          {CREATIVE_SERVICES.map((svc, i) => (
            <Reveal key={svc.title} delay={i * 70}>
              <SiteCard glowing className="h-full flex flex-col gap-4 group">
                <div className="w-14 h-14 rounded-2xl icon-halo flex items-center justify-center">
                  <Icon name={svc.icon} size={26} />
                </div>
                <h3 className="font-display font-bold text-text-primary text-xl">{svc.title}</h3>
                <p className="text-text-secondary text-base leading-relaxed">{svc.description}</p>
                <ul className="flex flex-col gap-2 mt-auto pt-4 border-t border-border-subtle">
                  {svc.deliverables.map((d) => (
                    <li key={d} className="flex items-center gap-2 text-sm text-text-secondary">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-core" />
                      {d}
                    </li>
                  ))}
                </ul>
              </SiteCard>
            </Reveal>
          ))}

          {/* Special "Under One Roof" card */}
          <Reveal delay={CREATIVE_SERVICES.length * 70}>
            <div className="relative rounded-2xl bg-gradient-to-br from-indigo-core to-indigo-light p-8 flex flex-col gap-5 justify-between overflow-hidden h-full">
              <div
                className="absolute -top-12 -right-12 w-40 h-40 rounded-full"
                style={{ background: "radial-gradient(circle, rgba(245,158,11,0.4) 0%, transparent 70%)" }}
                aria-hidden
              />
              <div className="relative z-10 flex flex-col gap-4">
                <h3 className="font-display font-bold text-text-primary text-2xl leading-tight">
                  One partner. Five disciplines. Zero handoffs.
                </h3>
                <p className="text-text-secondary text-base leading-relaxed">
                  Stop juggling five agencies. Magnence gives you senior specialists in marketing,
                  video, design, 3D, and rendering — coordinated as dedicated teams for every domain, accountable
                  for the whole pipeline, at a budget that works for you.
                </p>
              </div>
              <MagneticButton
                href="/services/branding"
                variant="secondary"
                className="!bg-white !text-[#1a1a1a] !border-[#1a1a1a]/20 hover:!bg-[#fff8e6] hover:!border-[#1a1a1a]/40 self-start mt-4"
              >
                Explore Creative <ArrowRight size={16} />
              </MagneticButton>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
