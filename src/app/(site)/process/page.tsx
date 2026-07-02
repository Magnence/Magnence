import type { Metadata } from "next";
import { ServiceHero } from "@/components/site/ServiceHero";
import { SectionHeading, SectionLabel } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { SiteCard } from "@/components/site/SiteCard";
import { Icon } from "@/components/site/Icon";
import { CTABanner } from "@/components/site/CTABanner";
import { PROCESS_STEPS } from "@/lib/site-data/site-data";
import { Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Our Process — From Idea to Impact in 9 Steps",
  description:
    "A proven, structured approach to digital delivery: discovery, strategy, architecture, design, development, testing, deployment, training, and support.",
  alternates: { canonical: "/process" },
};

const ENGAGEMENT_MODELS = [
  {
    name: "Project-Based",
    description: "Fixed scope, fixed price, fixed timeline. Best for well-defined projects with clear deliverables.",
    best: ["MVP builds", "Marketing sites", "Brand projects", "Single-feature builds"],
    pricing: "Starting from ₹2L",
  },
  {
    name: "Retainer",
    description: "Monthly engagement with a dedicated pod. Best for ongoing product development and iteration.",
    best: ["Product evolution", "Continuous design", "Marketing programs", "Automation ops"],
    pricing: "Starting from ₹1.5L/month",
  },
  {
    name: "Dedicated Team",
    description: "A full Magnence team embedded with yours. Best for complex, multi-year initiatives.",
    best: ["Platform builds", "Multi-product programs", "Long-term R&D", "Scale-ups"],
    pricing: "Custom quote",
  },
];

export default function ProcessPage() {
  return (
    <>
      <ServiceHero
        eyebrow="// our process"
        title={<>How We Turn Ideas Into Reality</>}
        subtitle="A proven, structured approach to digital delivery — refined over 150+ shipped projects."
        showOrb
      />

      {/* 9-step process */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading
              label="// nine steps"
              title={<>A Process That Scales With You</>}
              subtitle="From first conversation to long-term partnership — here's exactly how we work."
            />
          </Reveal>

          <div className="relative mt-16">
            {/* Center line for desktop */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-core via-cyan-signal to-transparent opacity-30" />

            <div className="flex flex-col gap-8 sm:gap-12 lg:gap-16">
              {PROCESS_STEPS.map((step, i) => (
                <Reveal key={step.number} delay={(i % 2) * 100}>
                  <div
                    className={`relative flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-12 items-start ${
                      i % 2 === 1 ? "lg:flex-row-reverse" : ""
                    }`}
                  >
                    {/* Step number — large faded */}
                    <div className="flex-1 flex flex-col gap-3 sm:gap-4 w-full">
                      <div
                        className={`flex items-center gap-3 sm:gap-4 ${
                          i % 2 === 1 ? "lg:flex-row-reverse" : ""
                        }`}
                      >
                        <span className="font-code font-bold text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-indigo-core/30 leading-none">
                          {step.number}
                        </span>
                        <div className="w-11 h-11 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-2xl icon-halo flex items-center justify-center flex-shrink-0">
                          <Icon name={step.icon} size={22} />
                        </div>
                      </div>
                      <h3 className="font-display font-bold text-text-primary text-xl sm:text-2xl lg:text-3xl">
                        {step.title}
                      </h3>
                      <p className="text-text-secondary text-base sm:text-lg leading-relaxed max-w-md">
                        {step.description}
                      </p>
                    </div>

                    {/* Deliverables card */}
                    <div className="flex-1 lg:mt-8">
                      <SiteCard className="bg-surface/70">
                        <p className="text-text-muted text-xs uppercase tracking-wider font-code mb-3">
                          Deliverables
                        </p>
                        <ul className="flex flex-col gap-2">
                          {step.deliverables.map((d) => (
                            <li key={d} className="flex items-center gap-2 text-text-primary text-sm">
                              <Check size={16} className="text-cyan-signal flex-shrink-0" />
                              {d}
                            </li>
                          ))}
                        </ul>
                      </SiteCard>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Engagement Models */}
      <section className="py-20 lg:py-28 bg-surface border-y border-border-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading
              label="// engagement models"
              title={<>Three Ways to Work With Us</>}
              subtitle="Pick the engagement that fits your stage, scope, and budget — or talk to us and we'll recommend one."
            />
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-14">
            {ENGAGEMENT_MODELS.map((model, i) => (
              <Reveal key={model.name} delay={i * 100}>
                <SiteCard glowing className="h-full flex flex-col gap-4">
                  <h3 className="font-display font-bold text-text-primary text-2xl">
                    {model.name}
                  </h3>
                  <p className="text-text-secondary text-base leading-relaxed">
                    {model.description}
                  </p>
                  <div className="flex flex-col gap-2 mt-2">
                    {model.best.map((b) => (
                      <div key={b} className="flex items-center gap-2 text-sm text-text-secondary">
                        <Check size={16} className="text-cyan-signal flex-shrink-0" />
                        {b}
                      </div>
                    ))}
                  </div>
                  <div className="mt-auto pt-4 border-t border-border-subtle">
                    <p className="font-code text-cyan-signal text-sm">{model.pricing}</p>
                  </div>
                </SiteCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTABanner
        heading="Let's start with a discovery call."
        subheading="A free, no-pressure 30-minute conversation about your project. We'll tell you honestly whether we're the right partner — and if we're not, we'll point you to someone who is."
        primaryLabel="Book a Free Call"
        primaryHref="/contact"
      />
    </>
  );
}
