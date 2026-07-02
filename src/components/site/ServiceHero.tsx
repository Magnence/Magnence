"use client";

import * as React from "react";
import { SectionLabel } from "./Section";
import { MagneticButton } from "./MagneticButton";
import { ArrowRight, Play } from "lucide-react";
import { DotGrid } from "./DotGrid";

interface ServiceHeroProps {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  gradient?: string;
  showOrb?: boolean;
  minHeight?: string;
}

export function ServiceHero({
  eyebrow,
  title,
  subtitle,
  primaryCta = { label: "Start Your Project", href: "/contact" },
  secondaryCta = { label: "Book a Free Call", href: "/contact" },
  gradient = "radial-gradient(ellipse 120% 80% at 60% -10%, rgba(251,198,7,0.35) 0%, transparent 60%)",
  showOrb = false,
  minHeight = "min-h-[70vh]",
}: ServiceHeroProps) {
  return (
    <section
      className={`relative ${minHeight} flex flex-col justify-center overflow-hidden hero-bg pt-32 sm:pt-36 pb-16`}
      style={{ backgroundImage: `${gradient}, #ffffff` }}
    >
      <DotGrid />
      {showOrb && (
        <>
          <div
            className="orb hidden lg:block"
            style={{
              width: 560, height: 560,
              right: -80, top: "50%", transform: "translateY(-50%)",
              background: "radial-gradient(circle, rgba(251,198,7,0.5) 0%, rgba(245,158,11,0.3) 40%, transparent 70%)",
            }}
          />
          <div
            className="orb hidden lg:block"
            style={{
              width: 280, height: 280,
              left: -60, top: "20%",
              background: "radial-gradient(circle, rgba(245,158,11,0.25) 0%, transparent 70%)",
              animationDelay: "-6s",
            }}
          />
        </>
      )}

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center gap-6">
        <SectionLabel>{eyebrow}</SectionLabel>
        <h1 className="font-display font-bold text-text-primary text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-text-secondary text-lg md:text-xl max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
          <MagneticButton href={primaryCta.href} variant="primary">
            {primaryCta.label} <ArrowRight size={18} />
          </MagneticButton>
          <MagneticButton href={secondaryCta.href} variant="secondary">
            <Play size={16} /> {secondaryCta.label}
          </MagneticButton>
        </div>
      </div>

      {/* Scroll indicator removed — was overlapping content */}
    </section>
  );
}
