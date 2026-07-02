import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Calendar, Building2, Clock, Wrench } from "lucide-react";
import { CASE_STUDIES } from "@/lib/site-data/case-studies";
import { SectionLabel } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { SiteCard } from "@/components/site/SiteCard";
import { CTABanner } from "@/components/site/CTABanner";
import { CaseStudyImage } from "@/components/site/CaseStudyImage";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const cs = CASE_STUDIES.find((c) => c.slug === slug);
  if (!cs) return { title: "Case Study Not Found" };
  return {
    title: `${cs.name} — ${cs.tagline} | Magnence Case Study`,
    description: cs.description,
    alternates: { canonical: `/work/${cs.slug}` },
    openGraph: {
      title: `${cs.name} — ${cs.tagline}`,
      description: cs.description,
      type: "article",
    },
  };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const cs = CASE_STUDIES.find((c) => c.slug === slug);
  if (!cs) notFound();

  const idx = CASE_STUDIES.findIndex((c) => c.slug === slug);
  const next = CASE_STUDIES[(idx + 1) % CASE_STUDIES.length];

  return (
    <>
      {/* Hero */}
      <section className="relative pt-20 sm:pt-24 pb-16 overflow-hidden hero-bg scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <Link
              href="/work"
              className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary text-sm mb-8 transition-colors"
            >
              <ArrowLeft size={16} /> Back to all work
            </Link>
            <div className="flex flex-col gap-3">
              <SectionLabel>{"// "}{cs.category} · {cs.industry}</SectionLabel>
              <h1 className="font-display font-bold text-text-primary text-4xl md:text-5xl lg:text-6xl mt-4 mb-4 leading-[1.1]">
                {cs.name}
              </h1>
              <p className="font-code text-cyan-signal text-lg md:text-xl mb-4">{cs.tagline}</p>
              <p className="text-text-secondary text-base md:text-lg max-w-3xl leading-relaxed">
                {cs.description}
              </p>
              <p className="text-cyan-signal font-display font-bold text-xl md:text-2xl mt-4">
                {cs.resultMetric}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Hero image */}
      <section className="pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="relative h-64 md:h-96 rounded-3xl overflow-hidden border border-border-subtle">
              <CaseStudyImage
                imageUrl={cs.imageUrl}
                imageGradient={cs.imageGradient}
                alt={`${cs.name} — ${cs.tagline}`}
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Metadata sidebar + content */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Sidebar */}
          <Reveal className="lg:col-span-1">
            <div className="sticky top-28 flex flex-col gap-4">
              <SiteCard className="bg-surface/70">
                <h3 className="font-display font-bold text-text-primary text-lg mb-4">
                  Project Metadata
                </h3>
                <div className="flex flex-col gap-4 text-sm">
                  <MetaRow icon={<Building2 size={16} />} label="Client" value={cs.client} />
                  <MetaRow icon={<Building2 size={16} />} label="Industry" value={cs.industry} />
                  <MetaRow icon={<Clock size={16} />} label="Timeline" value={cs.timeline} />
                  <MetaRow icon={<Wrench size={16} />} label="Services" value={cs.services.join(", ")} />
                  <MetaRow icon={<Calendar size={16} />} label="Stack" value={cs.technologies.join(", ")} />
                </div>
              </SiteCard>
            </div>
          </Reveal>

          {/* Content */}
          <div className="lg:col-span-2 flex flex-col gap-12">
            <Reveal>
              <CaseSection title="The Challenge" body={cs.challenge} />
            </Reveal>
            <Reveal>
              <CaseSection title="Our Approach" body={cs.approach} />
            </Reveal>
            <Reveal>
              <CaseSection title="The Solution" body={cs.solution} />
            </Reveal>

            {/* What We Built — structured breakdown */}
            <Reveal>
              <h2 className="font-display font-bold text-text-primary text-3xl mb-6">
                What We Built
              </h2>
              <div className="flex flex-col gap-3">
                {cs.services.map((svc, i) => (
                  <div key={svc} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#fbc607]/15 border border-[#fbc607]/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check size={12} style={{ color: "#d4a017" }} />
                    </div>
                    <p className="text-text-secondary text-base leading-relaxed">
                      <strong className="text-text-primary">{svc}</strong> — {getServiceDescription(svc, cs.category)}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Tech Stack Details */}
            <Reveal>
              <h2 className="font-display font-bold text-text-primary text-3xl mb-6">
                Technology Stack
              </h2>
              <div className="flex flex-wrap gap-2">
                {cs.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-4 py-2 rounded-lg border border-border-subtle bg-surface/50 text-text-primary text-sm font-code"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <p className="text-text-secondary text-sm leading-relaxed mt-4">
                Stack chosen for {cs.industry.toLowerCase()} industry requirements — balancing performance, maintainability, and team scalability. Every technology above was selected based on the client's existing infrastructure, hiring constraints, and long-term roadmap.
              </p>
            </Reveal>

            {/* Results */}
            <Reveal>
              <h2 className="font-display font-bold text-text-primary text-3xl mb-6">
                Results & Impact
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {cs.results.map((r) => (
                  <SiteCard key={r.label} glowing className="text-center">
                    <p className="font-display font-extrabold text-gradient-brand text-4xl md:text-5xl mb-2">
                      {r.value}
                    </p>
                    <p className="text-text-secondary text-sm">{r.label}</p>
                  </SiteCard>
                ))}
              </div>
              <p className="text-text-muted text-xs font-code mt-4">
                Project timeline: {cs.timeline} | Delivered for {cs.client}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Next project */}
      <section className="py-12 border-t border-border-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href={`/work/${next.slug}`}
            className="group flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-8 rounded-2xl border border-border-subtle hover:border-[#fbc607]/40 hover:bg-[#fafafa] transition-all"
          >
            <div>
              <p className="text-text-muted text-xs uppercase tracking-wider font-code mb-2">
                Next Project
              </p>
              <h3 className="font-display font-bold text-text-primary text-2xl group-hover:text-[#b8881a] transition-colors">
                {next.name}
              </h3>
              <p className="text-text-secondary text-sm">{next.tagline}</p>
            </div>
            <ArrowRight size={32} className="text-text-secondary group-hover:text-[#b8881a] group-hover:translate-x-2 transition-all" />
          </Link>
        </div>
      </section>

      <CTABanner
        heading="Have a similar challenge?"
        subheading="If this case study sounds like your problem, let's talk. We'll scope your project and give you a fixed-price quote within 48 hours."
        primaryLabel="Start Your Project"
        primaryHref="/contact"
      />
    </>
  );
}

function MetaRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2 text-text-muted text-xs uppercase tracking-wider font-code">
        {icon} {label}
      </div>
      <p className="text-text-primary text-sm">{value}</p>
    </div>
  );
}

function CaseSection({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h2 className="font-display font-bold text-text-primary text-3xl mb-4">{title}</h2>
      <p className="text-text-secondary text-lg leading-relaxed">{body}</p>
    </div>
  );
}

function getServiceDescription(service: string, category: string): string {
  const descriptions: Record<string, string> = {
    AI: "Custom model development, training, and deployment tailored to the client's data and use case.",
    Software: "Full-stack application development with production-grade architecture, testing, and observability.",
    Web: "Responsive, SEO-optimized web application built on Next.js with server-side rendering.",
    Mobile: "Cross-platform mobile app (iOS + Android) with offline-first architecture and native performance.",
    Automation: "Workflow automation with idempotent design, retry logic, and full observability.",
    Design: "UX research, UI design, and design system development aligned to user needs.",
    Branding: "Brand identity, visual system, and guidelines that scale across channels.",
    Marketing: "SEO, content, and performance marketing integrated with the product roadmap.",
  };
  return descriptions[service] || `Professional ${service.toLowerCase()} services delivered with senior-level expertise and production-grade quality.`;
}
