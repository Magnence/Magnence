"use client";

import * as React from "react";
import { ArrowRight, Check, ChevronDown } from "lucide-react";
import { ServiceHero } from "./ServiceHero";
import { SectionHeading, SectionLabel } from "./Section";
import { Reveal } from "./Reveal";
import { SiteCard } from "./SiteCard";
import { Icon } from "./Icon";
import { CTABanner } from "./CTABanner";
import type { Service } from "@/lib/site-data/services";

interface ServicePageProps {
  service: Service;
  ctaLabel?: string;
}

export function ServicePage({ service, ctaLabel = "Book a Consultation" }: ServicePageProps) {
  return (
    <>
      <ServiceHero
        eyebrow={`// ${service.title.toLowerCase()}`}
        title={<>{service.title.split(" ").slice(0, -1).join(" ")} <span className="text-gradient-brand">{service.title.split(" ").slice(-1)}</span></>}
        subtitle={service.description}
        primaryCta={{ label: ctaLabel, href: "/contact" }}
        secondaryCta={{ label: "See Our Work", href: "/work" }}
        gradient={service.heroGradient}
        minHeight="min-h-[70vh]"
        showOrb
      />

      {/* Sub-services */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading
              label="// capabilities"
              title={<>What We Do in {service.title}</>}
              subtitle="Expand each capability to see how we apply it to real business problems."
              align="left"
            />
          </Reveal>

          <div className="flex flex-col gap-3 mt-12">
            {service.subServices.map((sub, i) => (
              <Reveal key={sub.title} delay={i * 40}>
                <AccordionItem
                  icon={sub.icon}
                  title={sub.title}
                  description={sub.description}
                  useCases={sub.useCases}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="py-20 lg:py-28 bg-surface border-y border-border-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading
              label="// our approach"
              title={<>How We Approach {service.title}</>}
              subtitle="A structured, four-step methodology that turns ambitious ideas into production systems."
            />
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">
            {APPROACH_STEPS.map((step, i) => (
              <Reveal key={step.title} delay={i * 80}>
                <SiteCard glowing className="h-full">
                  <div className="font-code text-cyan-signal text-3xl font-bold mb-4">
                    0{i + 1}
                  </div>
                  <h3 className="font-display font-bold text-text-primary text-lg mb-2">
                    {step.title}
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {step.description}
                  </p>
                </SiteCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading
              label="// tech stack"
              title={<>Tools We Use</>}
              subtitle="Modern, well-supported, and battle-tested in production."
            />
          </Reveal>
          <Reveal delay={150} className="mt-14">
            <div className="flex flex-wrap gap-3 justify-center max-w-4xl mx-auto">
              {service.techStack.map((tech) => (
                <div
                  key={tech}
                  className="px-5 py-3 rounded-full bg-surface border border-border-subtle text-text-primary text-sm font-code font-medium hover:border-indigo-core/60 hover:bg-elevated transition-all"
                >
                  {tech}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Use Cases by Industry */}
      <section className="py-20 lg:py-28 bg-surface border-y border-border-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading
              label="// use cases"
              title={<>By Industry</>}
              subtitle="Real examples of how we apply this capability across different sectors."
            />
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-14">
            {service.useCases.map((uc, i) => (
              <Reveal key={uc.industry} delay={i * 80}>
                <SiteCard glowing className="h-full">
                  <h3 className="font-display font-bold text-text-primary text-xl mb-4">
                    {uc.industry}
                  </h3>
                  <ul className="flex flex-col gap-3">
                    {uc.cases.map((c) => (
                      <li key={c} className="flex items-start gap-2 text-text-secondary text-sm">
                        <Check size={18} className="text-cyan-signal flex-shrink-0 mt-0.5" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </SiteCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTABanner
        heading={`Ready to build with our ${service.title.toLowerCase()} team?`}
        subheading="Book a free 30-minute consultation. We'll scope your project, recommend the right approach, and give you a fixed-price quote within 48 hours."
        primaryLabel={ctaLabel}
        primaryHref="/contact"
        secondaryLabel="See Related Work"
        secondaryHref="/work"
      />
    </>
  );
}

const APPROACH_STEPS = [
  { title: "Discovery & Strategy", description: "Understand your business, goals, users, and constraints. Define what success looks like." },
  { title: "Architecture & Design", description: "Design the system architecture, schema, and UX. Pick the right tools for the job." },
  { title: "Build & Integrate", description: "Sprint-based development with weekly demos. CI/CD from day one. Tests, not vibes." },
  { title: "Deploy & Optimize", description: "Production launch with progressive rollout. Monitoring, observability, and ongoing iteration." },
];

function AccordionItem({
  icon,
  title,
  description,
  useCases,
}: {
  icon: string;
  title: string;
  description: string;
  useCases: string[];
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <div
      className={`rounded-2xl border bg-surface transition-all duration-300 cursor-pointer ${
        open ? "border-indigo-core/50" : "border-border-subtle hover:border-indigo-core/30"
      }`}
      onClick={() => setOpen(!open)}
    >
      <div className="p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl icon-halo flex items-center justify-center flex-shrink-0">
          <Icon name={icon} size={22} />
        </div>
        <h3 className="font-display font-bold text-text-primary text-lg flex-1">{title}</h3>
        <ChevronDown
          size={20}
          className={`text-text-muted transition-transform ${open ? "rotate-180" : ""}`}
        />
      </div>
      {open && (
        <div className="px-5 pb-5 pl-20 flex flex-col gap-4">
          <p className="text-text-secondary text-base leading-relaxed">{description}</p>
          <div className="flex flex-col gap-2">
            <p className="text-text-muted text-xs uppercase tracking-wider font-code">Use cases</p>
            <div className="flex flex-wrap gap-2">
              {useCases.map((uc) => (
                <span
                  key={uc}
                  className="px-3 py-1 rounded-full bg-elevated border border-border-subtle text-text-secondary text-xs"
                >
                  {uc}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
