"use client";

import * as React from "react";
import { MagneticButton } from "./MagneticButton";
import { Reveal } from "./Reveal";
import { ArrowRight, PhoneCall } from "lucide-react";

interface CTABannerProps {
  heading?: string;
  subheading?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export function CTABanner({
  heading = "Ready to Build Something Extraordinary?",
  subheading = "Let's talk about your project. From idea to deployment, Magnence has you covered — with dedicated teams for every discipline, at your budget.",
  primaryLabel = "Start Your Project",
  primaryHref = "/contact",
  secondaryLabel = "Call Us Now",
  secondaryHref = "tel:+919470961258",
}: CTABannerProps) {
  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="cta-banner rounded-3xl p-10 md:p-16 text-center flex flex-col items-center gap-6 relative overflow-hidden">
            {/* Background orbs */}
            <div
              className="orb"
              style={{
                width: 320, height: 320,
                top: "-40%", left: "-10%",
                background: "radial-gradient(circle, rgba(251,198,7,0.25) 0%, transparent 70%)",
                animation: "none",
              }}
              aria-hidden
            />
            <div
              className="orb"
              style={{
                width: 280, height: 280,
                bottom: "-40%", right: "-10%",
                background: "radial-gradient(circle, rgba(245,158,11,0.18) 0%, transparent 70%)",
                animation: "none",
              }}
              aria-hidden
            />
            <div className="relative z-10 flex flex-col items-center gap-6">
              <h2 className="font-display font-bold text-text-primary text-4xl md:text-5xl leading-tight max-w-3xl">
                {heading}
              </h2>
              <p className="text-text-secondary text-lg max-w-2xl leading-relaxed">
                {subheading}
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
                <MagneticButton href={primaryHref} variant="primary">
                  {primaryLabel} <ArrowRight size={18} />
                </MagneticButton>
                <MagneticButton href={secondaryHref} variant="secondary">
                  <PhoneCall size={16} /> {secondaryLabel}
                </MagneticButton>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
