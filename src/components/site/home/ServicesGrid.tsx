"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "../Section";
import { SiteCard } from "../SiteCard";
import { Reveal } from "../Reveal";
import { Icon } from "../Icon";
import { SERVICE_OVERVIEW_CARDS } from "@/lib/site-data/services";
import { MagneticButton } from "../MagneticButton";

export function ServicesGrid() {
  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            label="// what we do"
            title={<>End-to-End Digital Capabilities</>}
            subtitle="From strategy to deployment — dedicated teams for every domain. Software, AI, design, automation, branding, marketing, video, and 3D, all under one roof."
          />
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-14">
          {SERVICE_OVERVIEW_CARDS.map((svc, i) => (
            <Reveal key={svc.slug + svc.name} delay={i * 60}>
              <Link href={`/services/${svc.slug}`} className="block h-full">
                <SiteCard glowing className="h-full group flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="w-14 h-14 rounded-2xl icon-halo flex items-center justify-center">
                      <Icon name={svc.icon} size={26} />
                    </div>
                    <ArrowRight
                      size={20}
                      className="text-text-muted group-hover:text-cyan-signal group-hover:translate-x-1 transition-all"
                    />
                  </div>
                  <h3 className="font-display font-bold text-text-primary text-xl">
                    {svc.name}
                  </h3>
                  <p className="text-text-secondary text-base leading-relaxed">
                    {svc.description}
                  </p>
                </SiteCard>
              </Link>
            </Reveal>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <MagneticButton href="/services" variant="secondary">
            Explore All Services <ArrowRight size={16} />
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
