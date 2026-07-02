import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ServiceHero } from "@/components/site/ServiceHero";
import { SectionHeading, SectionLabel } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { SiteCard } from "@/components/site/SiteCard";
import { Icon } from "@/components/site/Icon";
import { CTABanner } from "@/components/site/CTABanner";
import { SERVICES } from "@/lib/site-data/services";
import { TECH_FOCUS } from "@/lib/site-data/site-data";

export const metadata: Metadata = {
  title: "Services — Full-Spectrum Digital Capabilities",
  description:
    "AI, software development, web & mobile, automation, UI/UX, branding, marketing, video editing, and 3D rendering — all under one roof. Explore Magnence services.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <ServiceHero
        eyebrow="// what we build"
        title={<>Full-Spectrum Digital Services</>}
        subtitle="From AI systems to brand identity, from SaaS platforms to architectural renders — we do it all, with senior specialists in every discipline."
        showOrb
      />

      {/* Services Grid */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading
              label="// our services"
              title={<>Dedicated Teams for Every Domain.</>}
              subtitle="Each practice is staffed by senior specialists — and coordinated by a single project team that owns your outcome end-to-end."
            />
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-14">
            {SERVICES.map((svc, i) => (
              <Reveal key={svc.id + i} delay={(i % 3) * 80}>
                <Link href={`/services/${svc.slug}`} className="block h-full group">
                  <SiteCard glowing className="h-full flex flex-col gap-4">
                    <div
                      className="h-32 rounded-xl flex items-center justify-center relative overflow-hidden"
                      style={{ background: svc.heroGradient }}
                    >
                      <div className="w-16 h-16 rounded-2xl bg-white/30 backdrop-blur-sm flex items-center justify-center text-text-primary">
                        <Icon name={svc.icon} size={32} />
                      </div>
                    </div>
                    <h3 className="font-display font-bold text-text-primary text-xl">
                      {svc.title}
                    </h3>
                    <p className="text-text-secondary text-base leading-relaxed">
                      {svc.tagline}
                    </p>
                    <p className="text-xs text-text-muted font-code mt-auto pt-4 border-t border-border-subtle">
                      {svc.subServices.slice(0, 4).map((s) => s.title).join(" · ")}
                    </p>
                    <span className="inline-flex items-center gap-2 text-cyan-signal text-sm font-semibold group-hover:translate-x-1 transition-transform">
                      Learn More <ArrowRight size={16} />
                    </span>
                  </SiteCard>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Focus */}
      <section className="py-20 lg:py-28 bg-surface border-y border-border-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading
              label="// technology focus"
              title={<>Our Tech Arsenal</>}
              subtitle="The tools and platforms we use to ship production systems — modern, well-supported, and battle-tested."
            />
          </Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6 mt-14">
            {TECH_FOCUS.map((tech, i) => (
              <Reveal key={tech.name} delay={(i % 5) * 60}>
                <div className="site-card p-6 flex flex-col items-center gap-3 text-center">
                  <div className="w-14 h-14 rounded-xl icon-halo flex items-center justify-center">
                    <Icon name={tech.icon} size={26} />
                  </div>
                  <p className="text-text-primary text-sm font-semibold">{tech.name}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTABanner
        heading="Not sure which service you need?"
        subheading="Book a free 30-minute discovery call. We'll help you scope your project, pick the right services, and give you an honest estimate — even if you don't end up working with us."
        primaryLabel="Book a Free Call"
        primaryHref="/contact"
        secondaryLabel="See Our Work"
        secondaryHref="/work"
      />
    </>
  );
}
