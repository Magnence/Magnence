"use client";

import * as React from "react";
import { Marquee } from "../Marquee";
import { TECH_MARQUEE } from "@/lib/site-data/site-data";

export function TrustedBy() {
  return (
    <section className="py-12 border-y border-border-subtle bg-surface/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-text-muted text-sm uppercase tracking-widest mb-6 font-code">
          Trusted by teams using
        </p>
        <Marquee items={TECH_MARQUEE} />
      </div>
    </section>
  );
}
