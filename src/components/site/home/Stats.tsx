"use client";

import * as React from "react";
import { AnimatedCounter } from "../AnimatedCounter";
import { Reveal } from "../Reveal";
import { STATS } from "@/lib/site-data/site-data";

export function Stats() {
  return (
    <section className="py-16 lg:py-20 bg-surface border-y border-border-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 80}>
              <div className="text-center flex flex-col gap-2">
                <div className="font-display font-extrabold text-5xl md:text-6xl text-gradient-brand">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-text-secondary text-sm md:text-base uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
