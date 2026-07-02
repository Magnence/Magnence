import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin, Globe, FileText, Layout, Briefcase, Mail, Phone } from "lucide-react";
import { ServiceHero } from "@/components/site/ServiceHero";
import { SectionHeading, SectionLabel } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { SiteCard } from "@/components/site/SiteCard";
import { CTABanner } from "@/components/site/CTABanner";
import { COMPANY_INFO } from "@/lib/site-data/site-data";
import { SERVICES } from "@/lib/site-data/services";
import { INDUSTRIES } from "@/lib/site-data/site-data";
import { CASE_STUDIES } from "@/lib/site-data/case-studies";
import { BLOG_POSTS } from "@/lib/site-data/blog-posts";

export const metadata: Metadata = {
  title: "Sitemap — Explore All Magnence Pages",
  description:
    "Complete sitemap of magnence.com — all pages, services, industries, case studies, and blog posts. Magnence operates across 8 countries including India, US, UK, Singapore, UAE, Australia, Canada, and Germany.",
  alternates: { canonical: "/site-map" },
  openGraph: {
    title: "Magnence Sitemap",
    description: "Explore all pages on magnence.com — services, industries, work, blog, and more.",
  },
};

interface SitemapGroup {
  title: string;
  icon: string;
  description: string;
  links: { label: string; href: string; description?: string }[];
}

export default function SitemapPage() {
  const groups: SitemapGroup[] = [
    {
      title: "Main Pages",
      icon: "Layout",
      description: "Core navigation pages of the Magnence website.",
      links: [
        { label: "Home", href: "/", description: "Imagine. Create. Engineer. Elevate." },
        { label: "About Us", href: "/about", description: "Founded 2020 in Bangalore, India" },
        { label: "Services", href: "/services", description: "Dedicated Teams for Every Domain" },
        { label: "Industries", href: "/industries", description: "13 industries served" },
        { label: "Our Process", href: "/process", description: "9-step delivery methodology" },
        { label: "Our Work", href: "/work", description: "Real case studies & portfolio" },
        { label: "Blog", href: "/blog", description: "Insights from the Magnence team" },
        { label: "Contact", href: "/contact", description: "24×7 available · +91 9470961258" },
        { label: "Careers", href: "/careers", description: "Build the future with us" },
      ],
    },
    {
      title: "Services",
      icon: "Briefcase",
      description: "Full-spectrum digital capabilities — software, AI, design, marketing, creative.",
      links: SERVICES.map((s) => ({
        label: s.title,
        href: `/services/${s.slug}`,
        description: s.tagline,
      })),
    },
    {
      title: "Industries We Serve",
      icon: "Globe",
      description: "Production systems shipped across 13+ industries in 8 countries.",
      links: INDUSTRIES.map((ind) => ({
        label: ind.name,
        href: `/industries/${ind.slug}`,
        description: ind.description,
      })),
    },
    {
      title: "Case Studies",
      icon: "FileText",
      description: "Real products, real results — shipped to production.",
      links: CASE_STUDIES.map((cs) => ({
        label: cs.name,
        href: `/work/${cs.slug}`,
        description: `${cs.tagline} · ${cs.industry}`,
      })),
    },
    {
      title: "Blog Posts",
      icon: "FileText",
      description: "Insights on engineering, design, AI, automation, and growth.",
      links: BLOG_POSTS.map((p) => ({
        label: p.title,
        href: `/blog/${p.slug}`,
        description: `${p.category} · ${p.readTime}`,
      })),
    },
    {
      title: "Legal & Policies",
      icon: "FileText",
      description: "Policies and terms governing your use of magnence.com.",
      links: [
        { label: "Privacy Policy", href: "/privacy", description: "How we handle your data" },
        { label: "Terms of Service", href: "/terms", description: "Terms of use for magnence.com" },
        { label: "XML Sitemap", href: "/sitemap.xml", description: "Machine-readable sitemap for search engines" },
        { label: "Robots.txt", href: "/robots.txt", description: "Search engine crawl directives" },
      ],
    },
  ];

  const totalLinks = groups.reduce((sum, g) => sum + g.links.length, 0);

  return (
    <>
      <ServiceHero
        eyebrow={"// sitemap"}
        title={<>Explore Magnence</>}
        subtitle={`A complete map of every page on magnence.com — ${totalLinks} pages across services, industries, case studies, blog, and more.`}
        minHeight="min-h-[60vh]"
      />

      {/* Countries served banner */}
      <section className="py-12 bg-surface border-y border-border-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full icon-halo flex items-center justify-center">
                  <Globe size={24} />
                </div>
                <div>
                  <p className="font-display font-bold text-text-primary text-lg">
                    Operating in 8 Countries
                  </p>
                  <p className="text-text-secondary text-sm">
                    Magnence serves clients worldwide with 24×7 availability
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {COMPANY_INFO.countries.map((country) => (
                  <span
                    key={country}
                    className="px-3 py-1.5 rounded-full bg-white border border-border-subtle text-text-primary text-xs font-code"
                  >
                    {country}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Sitemap groups */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading
              label={"// all pages"}
              title={<>Every Page, One Place</>}
              subtitle="Browse the complete structure of magnence.com. Click any link to navigate."
            />
          </Reveal>

          <div className="flex flex-col gap-16 mt-14">
            {groups.map((group, gi) => (
              <Reveal key={group.title} delay={gi * 80}>
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl icon-halo flex items-center justify-center">
                      {group.icon === "Layout" && <Layout size={20} />}
                      {group.icon === "Briefcase" && <Briefcase size={20} />}
                      {group.icon === "Globe" && <Globe size={20} />}
                      {group.icon === "FileText" && <FileText size={20} />}
                    </div>
                    <div>
                      <h2 className="font-display font-bold text-text-primary text-2xl">
                        {group.title}
                      </h2>
                      <p className="text-text-secondary text-sm">{group.description}</p>
                    </div>
                    <span className="ml-auto text-text-muted text-sm font-code">
                      {group.links.length} {group.links.length === 1 ? "page" : "pages"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {group.links.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="group block rounded-xl bg-white border border-border-subtle p-4 hover:border-indigo-core/50 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-display font-bold text-text-primary text-sm group-hover:text-cyan-signal transition-colors">
                              {link.label}
                            </p>
                            {link.description && (
                              <p className="text-text-muted text-xs mt-1 line-clamp-2">
                                {link.description}
                              </p>
                            )}
                            <p className="text-text-muted text-[10px] font-code mt-2 truncate">
                              {link.href}
                            </p>
                          </div>
                          <ArrowRight
                            size={16}
                            className="text-text-muted group-hover:text-cyan-signal group-hover:translate-x-1 transition-all flex-shrink-0 mt-1"
                          />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 lg:py-28 bg-surface border-y border-border-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SiteCard className="text-center p-8">
                <div className="w-12 h-12 rounded-full icon-halo flex items-center justify-center mx-auto mb-4">
                  <Mail size={22} />
                </div>
                <p className="font-display font-bold text-text-primary text-lg mb-1">Email Us</p>
                <p className="text-text-secondary text-sm mb-4">24×7 available</p>
                <a href={`mailto:${COMPANY_INFO.email}`} className="text-cyan-signal text-sm font-code hover:underline break-all">
                  {COMPANY_INFO.email}
                </a>
              </SiteCard>
              <SiteCard className="text-center p-8">
                <div className="w-12 h-12 rounded-full icon-halo flex items-center justify-center mx-auto mb-4">
                  <Phone size={22} />
                </div>
                <p className="font-display font-bold text-text-primary text-lg mb-1">Call Us</p>
                <p className="text-text-secondary text-sm mb-4">24×7 available</p>
                <a href={COMPANY_INFO.phoneHref} className="text-cyan-signal text-sm font-code hover:underline">
                  {COMPANY_INFO.phone}
                </a>
              </SiteCard>
              <SiteCard className="text-center p-8">
                <div className="w-12 h-12 rounded-full icon-halo flex items-center justify-center mx-auto mb-4">
                  <MapPin size={22} />
                </div>
                <p className="font-display font-bold text-text-primary text-lg mb-1">Visit Us</p>
                <p className="text-text-secondary text-sm mb-4">Headquarters</p>
                <p className="text-cyan-signal text-sm font-code">
                  {COMPANY_INFO.primaryLocation}
                </p>
              </SiteCard>
            </div>
          </Reveal>
        </div>
      </section>

      <CTABanner
        heading="Can't find what you're looking for?"
        subheading="Reach out and we'll point you in the right direction. We respond within 24 hours, 24×7."
        primaryLabel="Start Your Project"
        primaryHref="/contact"
        secondaryLabel="Call Us Now"
        secondaryHref="tel:+919470961258"
      />
    </>
  );
}
