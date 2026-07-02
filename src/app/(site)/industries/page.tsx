import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ServiceHero } from "@/components/site/ServiceHero";
import { SectionHeading } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { SiteCard } from "@/components/site/SiteCard";
import { Icon } from "@/components/site/Icon";
import { CTABanner } from "@/components/site/CTABanner";
import { INDUSTRIES } from "@/lib/site-data/site-data";

export const metadata: Metadata = {
  title: "Industries — Solutions Built for Your Sector",
  description:
    "We've shipped production systems across 13+ industries — Technology, SaaS, Healthcare, Education, Logistics, Manufacturing, Retail, Real Estate, Finance, and more.",
  alternates: { canonical: "/industries" },
};

export default function IndustriesPage() {
  return (
    <>
      <ServiceHero
        eyebrow="// industries"
        title={<>Solutions Built for Your Industry</>}
        subtitle="We understand the specific challenges, regulations, and opportunities in your sector — because we've shipped there before."
        showOrb
      />

      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading
              label="// sectors we serve"
              title={<>13 Industries. One Senior Team.</>}
              subtitle="From healthcare compliance to logistics optimization, we bring deep context to every engagement."
            />
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-14">
            {INDUSTRIES.map((ind, i) => (
              <Reveal key={ind.slug} delay={(i % 3) * 80}>
                <Link href={`/industries/${ind.slug}`} className="block h-full group">
                  <SiteCard glowing className="h-full flex flex-col gap-4">
                    <div className="w-14 h-14 rounded-2xl icon-halo flex items-center justify-center">
                      <Icon name={ind.icon} size={26} />
                    </div>
                    <h3 className="font-display font-bold text-text-primary text-xl">
                      {ind.name}
                    </h3>
                    <p className="text-text-secondary text-base leading-relaxed">
                      {ind.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-border-subtle">
                      {ind.keyServices.map((s) => (
                        <span
                          key={s}
                          className="px-3 py-1 rounded-full bg-elevated border border-border-subtle text-text-muted text-xs font-code"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-2 text-cyan-signal text-sm font-semibold group-hover:translate-x-1 transition-transform">
                      Explore Solutions <ArrowRight size={16} />
                    </span>
                  </SiteCard>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTABanner
        heading="Don't see your industry?"
        subheading="We've worked with clients across 13+ sectors — and we're always up for a new challenge. If your industry isn't listed, let's talk. We'll tell you honestly whether we're the right fit."
        primaryLabel="Talk to Us"
        primaryHref="/contact"
        secondaryLabel="See Our Work"
        secondaryHref="/work"
      />
    </>
  );
}
