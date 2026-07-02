"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Quote } from "lucide-react";
import { ServiceHero } from "@/components/site/ServiceHero";
import { SectionHeading } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { SiteCard } from "@/components/site/SiteCard";
import { Icon } from "@/components/site/Icon";
import { CTABanner } from "@/components/site/CTABanner";
import { CAREERS_BENEFITS, OPEN_POSITIONS, CAREERS_DEPARTMENTS, COMPANY_INFO } from "@/lib/site-data/site-data";

const CULTURE_VALUES = [
  { icon: "ShieldCheck", title: "Default to ownership", description: "If you see a problem, fix it. Don't wait for permission, don't ask who's responsible. You are." },
  { icon: "Eye", title: "Default to transparency", description: "Share work early. Surface bad news fast. Hide nothing from clients, teammates, or yourself." },
  { icon: "GraduationCap", title: "Default to learning", description: "Every week, ship something you couldn't have shipped last month. Learn out loud, with the team." },
  { icon: "Zap", title: "Default to action", description: "A bad decision today beats a perfect one next month. Bias toward shipping and iterating." },
];

export default function CareersPage() {
  const [department, setDepartment] = React.useState("All");

  const filtered = React.useMemo(() => {
    if (department === "All") return OPEN_POSITIONS;
    return OPEN_POSITIONS.filter((p) => p.department === department);
  }, [department]);

  return (
    <>
      <ServiceHero
        eyebrow={"// careers"}
        title={<>Build the Future with Magnence</>}
        subtitle="We're looking for curious, driven people who want to shape how AI changes business. Senior roles only — we don't believe in juniors learning on client time."
        showOrb
      />

      {/* Why work here */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading
              label={"// why work here"}
              title={<>What You Get Working Here</>}
              subtitle="Real ownership, top-of-market pay, and a team that ships — without the studio grind."
            />
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-14">
            {CAREERS_BENEFITS.map((b, i) => (
              <Reveal key={b.title} delay={(i % 3) * 80}>
                <SiteCard glowing className="h-full">
                  <div className="w-12 h-12 rounded-xl icon-halo flex items-center justify-center mb-4">
                    <Icon name={b.icon} size={24} />
                  </div>
                  <h3 className="font-display font-bold text-text-primary text-lg mb-2">
                    {b.title}
                  </h3>
                  <p className="text-text-secondary text-base leading-relaxed">
                    {b.description}
                  </p>
                </SiteCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Culture */}
      <section className="py-20 lg:py-28 bg-surface border-y border-border-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="rounded-3xl bg-white border border-border-subtle p-8 md:p-12 mb-16 relative overflow-hidden">
              <Quote size={120} className="absolute -top-4 -left-4 text-indigo-core opacity-10" strokeWidth={1} />
              <div className="relative z-10 max-w-3xl">
                <p className="font-display text-2xl md:text-3xl text-text-primary italic leading-snug mb-6">
                  "We started Magnence because we were tired of studios that overpromise, underdeliver, and burn out their juniors. We wanted to build a place where senior people do their best work — for clients who actually value it."
                </p>
                <p className="text-cyan-signal font-code">— Anurag Singh, Founder & CEO</p>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <SectionHeading
              label={"// our culture"}
              title={<>Four Defaults</>}
              subtitle="The principles every Magnence team member is hired and evaluated against."
            />
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">
            {CULTURE_VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 80}>
                <SiteCard glowing className="h-full">
                  <div className="w-12 h-12 rounded-xl icon-halo flex items-center justify-center mb-4">
                    <Icon name={v.icon} size={24} />
                  </div>
                  <h3 className="font-display font-bold text-text-primary text-lg mb-2">
                    {v.title}
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {v.description}
                  </p>
                </SiteCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Open positions */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading
              label={"// open positions"}
              title={<>Find Your Next Role</>}
              subtitle="Filter by department to see what's open. Click Apply Now to fill out the application form."
            />
          </Reveal>

          <Reveal delay={150} className="mt-10 mb-10">
            <div className="flex flex-wrap items-center justify-center gap-2">
              {CAREERS_DEPARTMENTS.map((d) => (
                <button
                  key={d}
                  onClick={() => setDepartment(d)}
                  className={`tab-pill ${department === d ? "active" : ""}`}
                >
                  {d}
                </button>
              ))}
            </div>
          </Reveal>

          <div className="flex flex-col gap-4">
            {filtered.map((pos, i) => {
              // Create slug for apply page
              const applySlug = encodeURIComponent(`${pos.title}--${pos.department}`);
              return (
                <Reveal key={pos.title} delay={i * 50}>
                  <div className="rounded-2xl bg-white border border-border-subtle p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-indigo-core/40 transition-all">
                    <div className="flex flex-col gap-2">
                      <h3 className="font-display font-bold text-text-primary text-xl">
                        {pos.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        <span className="tag-ember">{pos.department}</span>
                        <span className="text-text-secondary">{pos.location}</span>
                        <span className="text-text-muted">·</span>
                        <span className="text-text-secondary">{pos.type}</span>
                      </div>
                    </div>
                    <Link
                      href={`/careers/apply/${applySlug}`}
                      className="btn-primary whitespace-nowrap"
                    >
                      Apply Now <ArrowRight size={16} />
                    </Link>
                  </div>
                </Reveal>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-text-secondary mt-12">
              No open positions in this department right now. Check back soon, or email us at {COMPANY_INFO.careersEmail}.
            </p>
          )}
        </div>
      </section>

      <CTABanner
        heading="Don't see your role? Email us anyway."
        subheading="We're always looking for senior engineers, designers, and creative talent. If you're exceptional at what you do, send your portfolio and a note about what you'd want to build."
        primaryLabel="Email Careers"
        primaryHref={`mailto:${COMPANY_INFO.careersEmail}`}
      />
    </>
  );
}
