"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { SectionHeading } from "../Section";
import { Reveal } from "../Reveal";
import { MagneticButton } from "../MagneticButton";
import { CASE_STUDIES } from "@/lib/site-data/case-studies";
import { CaseStudyImage } from "../CaseStudyImage";

export function FeaturedWork() {
  // Use useMemo to ensure stable reference between server and client renders
  const featured = React.useMemo(() => CASE_STUDIES.slice(0, 3), []);
  const [first, second, third] = featured;

  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            label="// our work"
            title={<>Solutions That Ship</>}
            subtitle="Real products. Real results. Not mockups - production systems in the wild."
          />
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mt-14">
          {[first, second].map((cs, i) => (
            <Reveal key={cs.slug} delay={i * 100}>
              <Link href={`/work/${cs.slug}`} className="group block">
                <div
                  className="relative rounded-2xl overflow-hidden border border-border-subtle group-hover:border-indigo-core/40 transition-all duration-300 min-h-[380px] lg:aspect-[4/3] lg:min-h-0"
                >
                  <CaseStudyImage
                    imageUrl={cs.imageUrl}
                    imageGradient={cs.imageGradient}
                    alt={`${cs.name} - ${cs.tagline}`}
                    className="absolute inset-0 w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent" />
                  <div className="absolute inset-0 p-6 lg:p-8 flex flex-col justify-end gap-3 group-hover:scale-[1.02] transition-transform duration-500">
                    <span className="tag-ember self-start">{cs.industry}</span>
                    <h3 className="font-display font-bold text-text-primary text-xl lg:text-3xl">
                      {cs.name}
                    </h3>
                    <p className="text-cyan-signal text-xs lg:text-sm font-code">
                      {cs.tagline}
                    </p>
                    <p className="text-text-secondary text-sm lg:text-base">
                      {cs.resultMetric}
                    </p>
                    <span className="inline-flex items-center gap-1 text-text-primary text-xs lg:text-sm font-semibold mt-2 group-hover:text-cyan-signal transition-colors">
                      View Case Study <ArrowUpRight size={16} />
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200} className="mt-6 lg:mt-8">
          <Link href={`/work/${third.slug}`} className="group block">
            <div
              className="relative rounded-2xl overflow-hidden border border-border-subtle group-hover:border-indigo-core/40 transition-all duration-300 min-h-[400px] lg:aspect-[21/9] lg:min-h-0"
            >
              <CaseStudyImage
                imageUrl={third.imageUrl}
                imageGradient={third.imageGradient}
                alt={`${third.name} - ${third.tagline}`}
                className="absolute inset-0 w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/60 to-transparent lg:bg-gradient-to-r lg:from-white lg:via-white/50 lg:to-transparent" />
              <div className="absolute inset-0 p-6 lg:p-12 flex flex-col justify-end lg:justify-center gap-3 max-w-xl group-hover:scale-[1.02] transition-transform duration-500">
                <span className="tag-ember self-start">{third.industry}</span>
                <h3 className="font-display font-bold text-text-primary text-2xl lg:text-4xl">
                  {third.name}
                </h3>
                <p className="text-cyan-signal text-sm lg:text-base font-code">{third.tagline}</p>
                <p className="text-text-secondary text-base lg:text-lg">{third.resultMetric}</p>
                <span className="inline-flex items-center gap-1 text-text-primary text-sm font-semibold mt-2 group-hover:text-cyan-signal transition-colors">
                  View Case Study <ArrowUpRight size={16} />
                </span>
              </div>
            </div>
          </Link>
        </Reveal>

        <div className="flex justify-center mt-12">
          <MagneticButton href="/work" variant="secondary">
            View All Case Studies <ArrowRight size={16} />
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
