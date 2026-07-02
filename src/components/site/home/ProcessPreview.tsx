"use client";

import * as React from "react";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "../Section";
import { Reveal } from "../Reveal";
import { HOME_PROCESS_PREVIEW } from "@/lib/site-data/site-data";
import Link from "next/link";

export function ProcessPreview() {
  return (
    <section className="py-20 lg:py-28 bg-surface border-y border-border-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            label="// our process"
            title={<>From Idea to Impact</>}
            subtitle="A proven, structured approach that turns ambitious ideas into shipped products."
          />
        </Reveal>

        <div className="mt-14 overflow-x-auto overflow-y-hidden pb-6 thin-scroll md:overflow-visible">
          <div className="flex items-start gap-6 min-w-max md:min-w-0 md:grid md:grid-cols-5 md:gap-0 snap-x snap-mandatory">
            {HOME_PROCESS_PREVIEW.map((step, i) => (
              <Reveal key={step.number} delay={i * 100}>
                <div className="relative px-4 py-6 flex flex-col gap-4 group w-[200px] md:w-auto snap-start">
                  {/* Connector line */}
                  {i < HOME_PROCESS_PREVIEW.length - 1 && (
                    <div
                      className="hidden md:block absolute top-14 left-1/2 right-0 h-px process-line opacity-30"
                      aria-hidden
                    />
                  )}
                  <div className="w-16 h-16 rounded-full bg-elevated border border-indigo-core/40 flex items-center justify-center font-code font-bold text-cyan-signal text-xl group-hover:bg-indigo-core/20 group-hover:shadow-[0_8px_24px_rgba(251,198,7,0.4)] transition-all relative z-10">
                    {step.number}
                  </div>
                  <h3 className="font-display font-bold text-text-primary text-base md:text-lg">
                    {step.title}
                  </h3>
                  <p className="text-text-secondary text-xs md:text-sm leading-relaxed max-w-[180px] md:max-w-[200px]">
                    {step.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <Link
            href="/process"
            className="inline-flex items-center gap-2 text-cyan-signal font-semibold text-sm hover:underline"
          >
            See Full Process <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
