"use client";

import * as React from "react";
import { ArrowRight, Play } from "lucide-react";
import { MagneticButton } from "../MagneticButton";
import { DotGrid } from "../DotGrid";
import { SectionLabel } from "../Section";

const WORDS = ["Imagine.", "Create.", "Engineer.", "Elevate."];

export function Hero() {
  const [activeIndex, setActiveIndex] = React.useState(0);

  // Cycle the active (gold) word every 1.8 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % WORDS.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden hero-bg">
      <DotGrid />

      {/* Floating orbs */}
      <div
        className="orb hidden lg:block"
        style={{
          width: 560, height: 560,
          right: -80, top: "50%", transform: "translateY(-50%)",
          background: "radial-gradient(circle, rgba(251,198,7,0.5) 0%, rgba(245,158,11,0.3) 40%, transparent 70%)",
        }}
        aria-hidden
      />
      <div
        className="orb hidden lg:block"
        style={{
          width: 280, height: 280,
          left: -60, top: "25%",
          background: "radial-gradient(circle, rgba(245,158,11,0.25) 0%, transparent 70%)",
          animationDelay: "-6s",
        }}
        aria-hidden
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center gap-8">
        <SectionLabel>{"// AI-First Technology Company"}</SectionLabel>

        <h1 className="font-display font-extrabold text-text-primary text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-[1.02] tracking-tight">
          {WORDS.map((word, i) => (
            <span
              key={word}
              className={`block reveal is-visible transition-all duration-700 ${
                i === activeIndex
                  ? "text-gradient-brand"
                  : "text-text-primary"
              }`}
              style={{ transitionDelay: "0.1s" }}
            >
              {word}
            </span>
          ))}
        </h1>

        <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
          <MagneticButton href="/work" variant="primary">
            Explore Our Work <ArrowRight size={18} />
          </MagneticButton>
          <MagneticButton href="/about" variant="secondary">
            <Play size={16} /> Watch Overview
          </MagneticButton>
        </div>
      </div>

      {/* Scroll indicator removed — was overlapping content on mobile */}
    </section>
  );
}
