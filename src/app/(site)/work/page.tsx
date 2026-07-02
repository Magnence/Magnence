"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, LayoutGrid, Rows3 } from "lucide-react";
import { ServiceHero } from "@/components/site/ServiceHero";
import { SectionHeading, SectionLabel } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { CTABanner } from "@/components/site/CTABanner";
import { CaseStudyImage } from "@/components/site/CaseStudyImage";
import { CASE_STUDIES, CASE_STUDY_CATEGORIES, type CaseStudy } from "@/lib/site-data/case-studies";

interface DBCaseStudy {
  slug: string;
  name: string;
  category: string;
  industry: string;
  tagline: string;
  resultMetric: string;
  description: string;
  imageUrl: string | null;
  imageGradient: string;
  challenge: string;
  approach: string;
  solution: string;
  results: string; // JSON string
  technologies: string;
  services: string;
  timeline: string;
  client: string;
  status: string;
  publishedAt: string | null;
}

/** Convert a CMS DB case study to the public CaseStudy shape. */
function dbStudyToCaseStudy(s: DBCaseStudy): CaseStudy {
  let results: { value: string; label: string }[] = [];
  try {
    results = JSON.parse(s.results || "[]");
  } catch {}
  let technologies: string[] = [];
  try {
    technologies = JSON.parse(s.technologies || "[]");
  } catch {}
  let services: string[] = [];
  try {
    services = JSON.parse(s.services || "[]");
  } catch {}
  return {
    slug: s.slug,
    name: s.name,
    category: (s.category as CaseStudy["category"]),
    industry: s.industry,
    tagline: s.tagline,
    resultMetric: s.resultMetric,
    description: s.description,
    imageGradient: s.imageGradient || "linear-gradient(135deg, #fbc607, #f59e0b)",
    imageUrl: s.imageUrl || "",
    technologies,
    services,
    timeline: s.timeline || "",
    client: s.client || "",
    challenge: s.challenge,
    approach: s.approach,
    solution: s.solution,
    results,
    date: s.publishedAt || new Date().toISOString(),
  };
}

export default function WorkPage() {
  const [filter, setFilter] = React.useState<string>("All");
  const [view, setView] = React.useState<"grid" | "list">("grid");
  const [mergedStudies, setMergedStudies] = React.useState<CaseStudy[]>(CASE_STUDIES);

  // Fetch DB-published case studies and merge with hardcoded.
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/cms/case-studies?status=published", { cache: "no-store" });
        const data = await res.json();
        if (!data.ok || cancelled) return;
        const dbStudies: CaseStudy[] = (data.studies as DBCaseStudy[])
          .filter((s) => s.status === "published")
          .map(dbStudyToCaseStudy);
        const dbSlugs = new Set(dbStudies.map((s) => s.slug));
        const overridden = CASE_STUDIES.map((s) =>
          dbSlugs.has(s.slug) ? dbStudies.find((d) => d.slug === s.slug)! : s
        );
        const hardcodedSlugs = new Set(CASE_STUDIES.map((s) => s.slug));
        const newFromDb = dbStudies.filter((s) => !hardcodedSlugs.has(s.slug));
        const merged = [...overridden, ...newFromDb].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        if (!cancelled) setMergedStudies(merged);
      } catch {
        // Fail silently — fall back to hardcoded
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = React.useMemo(() => {
    if (filter === "All") return mergedStudies;
    return mergedStudies.filter((cs) => cs.category === filter);
  }, [filter, mergedStudies]);

  return (
    <>
      <ServiceHero
        eyebrow={"// our work"}
        title={<>Our Work Speaks for Itself</>}
        subtitle="Real products, shipped to production, with real outcomes. Not mockups - systems running in the wild across 8 countries and 13 industries."
        showOrb
      />

      {/* Stats strip */}
      <section className="py-12 bg-surface border-y border-border-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "150+", label: "Projects Shipped" },
              { value: "50+", label: "Clients Worldwide" },
              { value: "8", label: "Countries Served" },
              { value: "98%", label: "Client Satisfaction" },
            ].map((stat, i) => (
              <Reveal key={stat.label} delay={i * 80}>
                <div className="text-center">
                  <div className="font-display font-extrabold text-4xl md:text-5xl text-gradient-brand mb-1">
                    {stat.value}
                  </div>
                  <div className="text-text-secondary text-xs md:text-sm uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter + view toggle */}
          <Reveal className="mb-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex flex-wrap items-center gap-2">
                {CASE_STUDY_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`tab-pill ${filter === cat ? "active" : ""}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-text-muted text-xs font-code mr-2">View:</span>
                <button
                  onClick={() => setView("grid")}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                    view === "grid"
                      ? "bg-indigo-core text-text-primary"
                      : "border border-border-subtle text-text-secondary hover:border-indigo-core"
                  }`}
                  aria-label="Grid view"
                >
                  <LayoutGrid size={16} />
                </button>
                <button
                  onClick={() => setView("list")}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                    view === "list"
                      ? "bg-indigo-core text-text-primary"
                      : "border border-border-subtle text-text-secondary hover:border-indigo-core"
                  }`}
                  aria-label="List view"
                >
                  <Rows3 size={16} />
                </button>
              </div>
            </div>
          </Reveal>

          {/* Grid view */}
          {view === "grid" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {filtered.map((cs, i) => (
                <Reveal key={cs.slug} delay={(i % 2) * 100}>
                  <Link href={`/work/${cs.slug}`} className="group block h-full">
                    <div className="relative rounded-2xl overflow-hidden border border-border-subtle group-hover:border-indigo-core/40 transition-all duration-300 aspect-[4/3]">
                      <CaseStudyImage
                        imageUrl={cs.imageUrl}
                        imageGradient={cs.imageGradient}
                        alt={`${cs.name} - ${cs.tagline}`}
                        className="absolute inset-0 w-full h-full group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
                      <div className="absolute inset-0 p-6 lg:p-8 flex flex-col justify-end gap-3">
                        <div className="flex items-center gap-2">
                          <span className="tag-ember">{cs.category}</span>
                          <span className="text-text-muted text-xs font-code">·</span>
                          <span className="text-text-secondary text-xs font-code">{cs.industry}</span>
                        </div>
                        <h3 className="font-display font-bold text-text-primary text-2xl lg:text-3xl">
                          {cs.name}
                        </h3>
                        <p className="text-cyan-signal text-sm font-code">{cs.tagline}</p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-text-secondary text-sm">{cs.resultMetric}</p>
                          <span className="inline-flex items-center gap-1 text-text-primary text-sm font-semibold group-hover:text-cyan-signal transition-colors">
                            View <ArrowUpRight size={14} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}

          {/* List view */}
          {view === "list" && (
            <div className="flex flex-col gap-4">
              {filtered.map((cs, i) => (
                <Reveal key={cs.slug} delay={i * 50}>
                  <Link
                    href={`/work/${cs.slug}`}
                    className="group block rounded-2xl overflow-hidden border border-border-subtle hover:border-indigo-core/40 transition-all bg-white"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                      <div className="relative aspect-[4/3] md:aspect-auto overflow-hidden">
                        <CaseStudyImage
                          imageUrl={cs.imageUrl}
                          imageGradient={cs.imageGradient}
                          alt={`${cs.name} - ${cs.tagline}`}
                          className="absolute inset-0 w-full h-full group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                      <div className="md:col-span-2 p-6 lg:p-8 flex flex-col gap-3 justify-center">
                        <div className="flex items-center gap-2">
                          <span className="tag-ember">{cs.category}</span>
                          <span className="text-text-muted text-xs font-code">·</span>
                          <span className="text-text-secondary text-xs font-code">{cs.industry}</span>
                          <span className="text-text-muted text-xs font-code">·</span>
                          <span className="text-text-secondary text-xs font-code">{cs.timeline}</span>
                        </div>
                        <h3 className="font-display font-bold text-text-primary text-2xl lg:text-3xl group-hover:text-cyan-signal transition-colors">
                          {cs.name}
                        </h3>
                        <p className="text-cyan-signal text-sm font-code">{cs.tagline}</p>
                        <p className="text-text-secondary text-sm leading-relaxed line-clamp-2">
                          {cs.description}
                        </p>
                        <div className="flex items-center justify-between mt-2 pt-4 border-t border-border-subtle">
                          <p className="text-gradient-brand font-display font-bold text-lg">
                            {cs.resultMetric}
                          </p>
                          <span className="inline-flex items-center gap-1 text-cyan-signal text-sm font-semibold group-hover:translate-x-1 transition-transform">
                            View Case Study <ArrowUpRight size={16} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-text-secondary text-lg">
                No case studies in this category yet. Check back soon.
              </p>
              <button
                onClick={() => setFilter("All")}
                className="btn-secondary mt-6"
              >
                View All Case Studies
              </button>
            </div>
          )}
        </div>
      </section>

      <CTABanner
        heading="Want to be our next case study?"
        subheading="We're always looking for ambitious projects to add to our portfolio. If you have a hard problem and a real budget, we'd love to talk."
        primaryLabel="Start Your Project"
        primaryHref="/contact"
        secondaryLabel="Call Us Now"
        secondaryHref="tel:+919470961258"
      />
    </>
  );
}
