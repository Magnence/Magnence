"use client";

import * as React from "react";
import { SectionHeading } from "../Section";
import { Reveal } from "../Reveal";
import { INDUSTRIES } from "@/lib/site-data/site-data";
import Link from "next/link";

export function IndustryCloud() {
  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            label={"// industries we serve"}
            title={<>Built for Every Sector</>}
            subtitle="From startups to enterprises, we've shipped production systems across 13+ industries."
          />
        </Reveal>

        <Reveal delay={150} className="mt-14">
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 max-w-5xl mx-auto">
            {INDUSTRIES.map((ind) => (
              <Link key={ind.slug} href={`/industries/${ind.slug}`} className="industry-tag">
                {ind.name}
              </Link>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
