import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Cpu, Cloud, HeartPulse, GraduationCap, Truck, Factory, ShoppingBag, Building2, Landmark, Briefcase, Rocket, Store, Building } from "lucide-react";
import { INDUSTRIES } from "@/lib/site-data/site-data";
import { SectionLabel } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { SiteCard } from "@/components/site/SiteCard";
import { CTABanner } from "@/components/site/CTABanner";
import { ServiceHero } from "@/components/site/ServiceHero";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const ICONS: Record<string, any> = {
  Cpu, Cloud, HeartPulse, GraduationCap, Truck, Factory, ShoppingBag,
  Building2, Landmark, Briefcase, Rocket, Store, Building,
};

export async function generateStaticParams() {
  return INDUSTRIES.map((ind) => ({ slug: ind.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const ind = INDUSTRIES.find((i) => i.slug === slug);
  if (!ind) return { title: "Industry Not Found" };
  return {
    title: `${ind.name} — Magnence Industry Solutions`,
    description: ind.description,
    alternates: { canonical: `/industries/${ind.slug}` },
    openGraph: {
      title: `${ind.name} — Magnence Industry Solutions`,
      description: ind.description,
      type: "website",
    },
  };
}

export default async function IndustryPage({ params }: PageProps) {
  const { slug } = await params;
  const ind = INDUSTRIES.find((i) => i.slug === slug);
  if (!ind) notFound();

  const idx = INDUSTRIES.findIndex((i) => i.slug === slug);
  const next = INDUSTRIES[(idx + 1) % INDUSTRIES.length];
  const Icon = ICONS[ind.icon] ?? Cpu;

  return (
    <>
      <ServiceHero
        eyebrow={`// ${ind.name.toLowerCase()}`}
        title={<>{ind.name} <span className="text-gradient-brand">Solutions</span></>}
        subtitle={ind.description}
        primaryCta={{ label: "Start a Project", href: "/contact" }}
        secondaryCta={{ label: "See Related Work", href: "/work" }}
        gradient={`radial-gradient(ellipse 120% 80% at 60% -10%, rgba(251,198,7,0.25) 0%, transparent 60%)`}
        minHeight="min-h-[70vh]"
      />

      {/* Challenge & Approach */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            <Reveal>
              <SectionLabel>{"// the challenge"}</SectionLabel>
              <h2 className="font-display font-bold text-text-primary text-3xl md:text-4xl mt-4 mb-6 leading-tight">
                What makes {ind.name.toLowerCase()} hard?
              </h2>
              <p className="text-text-secondary text-lg leading-relaxed">{ind.challenge}</p>
            </Reveal>

            <Reveal delay={150}>
              <SectionLabel>{"// our approach"}</SectionLabel>
              <h2 className="font-display font-bold text-text-primary text-3xl md:text-4xl mt-4 mb-6 leading-tight">
                How we work in {ind.name.toLowerCase()}
              </h2>
              <p className="text-text-secondary text-lg leading-relaxed">{ind.approach}</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-20 lg:py-28 bg-surface border-y border-border-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex flex-col items-center gap-4 text-center mb-14">
              <SectionLabel>{"// capabilities"}</SectionLabel>
              <h2 className="font-display font-bold text-text-primary text-4xl md:text-5xl max-w-3xl leading-tight">
                What we build for {ind.name.toLowerCase()}
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {ind.capabilities.map((cap, i) => (
              <Reveal key={cap} delay={(i % 3) * 80}>
                <SiteCard glowing className="h-full">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full icon-halo flex items-center justify-center flex-shrink-0">
                      <Check size={16} />
                    </div>
                    <p className="text-text-primary text-base font-medium leading-snug">{cap}</p>
                  </div>
                </SiteCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Outcomes */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex flex-col items-center gap-4 text-center mb-14">
              <SectionLabel>{"// outcomes"}</SectionLabel>
              <h2 className="font-display font-bold text-text-primary text-4xl md:text-5xl max-w-3xl leading-tight">
                Real results we've delivered
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {ind.outcomes.map((o, i) => (
              <Reveal key={o.label} delay={i * 100}>
                <SiteCard glowing className="text-center p-10">
                  <p className="font-display font-extrabold text-gradient-brand text-5xl md:text-6xl mb-3">
                    {o.value}
                  </p>
                  <p className="text-text-secondary text-base">{o.label}</p>
                </SiteCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 lg:py-28 bg-surface border-y border-border-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex flex-col items-center gap-4 text-center mb-14">
              <SectionLabel>{"// tech stack"}</SectionLabel>
              <h2 className="font-display font-bold text-text-primary text-4xl md:text-5xl max-w-3xl leading-tight">
                Tools we use for {ind.name.toLowerCase()}
              </h2>
            </div>
          </Reveal>
          <Reveal delay={150}>
            <div className="flex flex-wrap gap-3 justify-center max-w-4xl mx-auto">
              {ind.techStack.map((tech) => (
                <div
                  key={tech}
                  className="px-5 py-3 rounded-full bg-white border border-border-subtle text-text-primary text-sm font-code font-medium hover:border-indigo-core hover:bg-cream transition-all"
                >
                  {tech}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Next industry */}
      <section className="py-12 border-t border-border-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href={`/industries/${next.slug}`}
            className="group flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-8 rounded-2xl border border-border-subtle hover:border-[#fbc607]/40 hover:bg-[#fafafa] transition-all"
          >
            <div>
              <p className="text-text-muted text-xs uppercase tracking-wider font-code mb-2">
                Next Industry
              </p>
              <h3 className="font-display font-bold text-text-primary text-2xl group-hover:text-[#b8881a] transition-colors">
                {next.name}
              </h3>
              <p className="text-text-secondary text-sm line-clamp-1">{next.description}</p>
            </div>
            <ArrowRight size={32} className="text-text-secondary group-hover:text-[#b8881a] group-hover:translate-x-2 transition-all" />
          </Link>
        </div>
      </section>

      <CTABanner
        heading={`Building something in ${ind.name.toLowerCase()}?`}
        subheading="Tell us about your project. We'll scope it, recommend the right approach, and send a fixed-price quote within 48 hours."
        primaryLabel="Start Your Project"
        primaryHref="/contact"
        secondaryLabel="See All Industries"
        secondaryHref="/industries"
      />
    </>
  );
}
