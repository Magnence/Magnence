"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { ServiceHero } from "@/components/site/ServiceHero";
import { SectionLabel } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { SiteCard } from "@/components/site/SiteCard";
import { CTABanner } from "@/components/site/CTABanner";
import { CaseStudyImage } from "@/components/site/CaseStudyImage";
import { BLOG_POSTS, BLOG_CATEGORIES, type BlogPost } from "@/lib/site-data/blog-posts";

interface DBPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  authorName: string;
  authorRole: string;
  authorGradient: string;
  imageUrl: string | null;
  imageGradient: string;
  status: string;
  featured: boolean;
  publishedAt: string | null;
  content: string; // JSON string of sections
  readTime?: string;
}

/** Convert a CMS DB post to the public BlogPost shape. */
function dbPostToBlogPost(p: DBPost): BlogPost {
  let content: { heading?: string; body: string }[] = [];
  try {
    content = JSON.parse(p.content || "[]");
  } catch {
    content = [];
  }
  return {
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    category: p.category,
    author: {
      name: p.authorName,
      role: p.authorRole,
      avatarGradient: p.authorGradient || "linear-gradient(135deg, #fbc607, #f59e0b)",
    },
    date: p.publishedAt || new Date().toISOString(),
    readTime: p.readTime || "10 min read",
    imageGradient: p.imageGradient || "linear-gradient(135deg, #fbc607, #f59e0b)",
    imageUrl: p.imageUrl || "",
    content,
  };
}

export default function BlogPage() {
  const [filter, setFilter] = React.useState<string>("All");
  const [mergedPosts, setMergedPosts] = React.useState<BlogPost[]>(BLOG_POSTS);

  // Fetch DB-published posts and merge with hardcoded posts.
  // DB posts override hardcoded ones by slug; new DB posts are appended.
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/cms/blog?status=published", { cache: "no-store" });
        const data = await res.json();
        if (!data.ok || cancelled) return;
        const dbPosts: BlogPost[] = (data.posts as DBPost[])
          .filter((p) => p.status === "published")
          .map(dbPostToBlogPost);
        // Merge: start with hardcoded, override with DB by slug, then append DB-only posts
        const dbSlugs = new Set(dbPosts.map((p) => p.slug));
        const overridden = BLOG_POSTS.map((p) =>
          dbSlugs.has(p.slug) ? dbPosts.find((d) => d.slug === p.slug)! : p
        );
        const hardcodedSlugs = new Set(BLOG_POSTS.map((p) => p.slug));
        const newFromDb = dbPosts.filter((p) => !hardcodedSlugs.has(p.slug));
        const merged = [...overridden, ...newFromDb].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        if (!cancelled) setMergedPosts(merged);
      } catch {
        // Fail silently — fall back to hardcoded posts
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const featured = mergedPosts[0];
  const rest = mergedPosts.slice(1);

  const filtered = React.useMemo(() => {
    if (filter === "All") return rest;
    return rest.filter((p) => p.category === filter);
  }, [filter, rest]);

  if (!featured) return null;

  return (
    <>
      <ServiceHero
        eyebrow="// insights"
        title={<>Insights from the Magnence Team</>}
        subtitle="Engineering, design, AI, automation, and growth — straight from the people building Magnence and shipping for our clients."
      />

      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Featured */}
          <Reveal className="mb-16">
            <Link href={`/blog/${featured.slug}`} className="group block">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div
                  className="aspect-[16/10] rounded-2xl overflow-hidden relative"
                >
                  <CaseStudyImage
                    imageUrl={featured.imageUrl}
                    imageGradient={featured.imageGradient}
                    alt={featured.title}
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <SectionLabel>{featured.category}</SectionLabel>
                  <h2 className="font-display font-bold text-text-primary text-3xl md:text-4xl group-hover:text-cyan-signal transition-colors leading-tight">
                    {featured.title}
                  </h2>
                  <p className="text-text-secondary text-lg leading-relaxed">
                    {featured.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-text-muted text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-text-primary font-bold text-xs"
                        style={{ background: featured.author.avatarGradient }}
                      >
                        {featured.author.name.charAt(0)}
                      </div>
                      <span>{featured.author.name}</span>
                    </div>
                    <span>·</span>
                    <span>{new Date(featured.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                    <span>·</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock size={12} /> {featured.readTime}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-2 text-cyan-signal text-sm font-semibold mt-2 group-hover:translate-x-1 transition-transform">
                    Read Article <ArrowRight size={16} />
                  </span>
                </div>
              </div>
            </Link>
          </Reveal>

          {/* Filter */}
          <Reveal className="mb-8">
            <div className="flex flex-wrap items-center gap-2">
              {BLOG_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`tab-pill ${filter === cat ? "active" : ""}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </Reveal>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filtered.map((post, i) => (
              <Reveal key={post.slug} delay={(i % 3) * 80}>
                <Link href={`/blog/${post.slug}`} className="block h-full group">
                  <SiteCard glowing className="h-full flex flex-col gap-4">
                    <div className="h-40 rounded-xl overflow-hidden relative">
                      <CaseStudyImage
                        imageUrl={post.imageUrl}
                        imageGradient={post.imageGradient}
                        alt={post.title}
                        className="absolute inset-0 w-full h-full"
                      />
                    </div>
                    <SectionLabel className="self-start">{post.category}</SectionLabel>
                    <h3 className="font-display font-bold text-text-primary text-xl leading-tight group-hover:text-cyan-signal transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-text-secondary text-sm leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-text-muted text-xs mt-auto pt-4 border-t border-border-subtle">
                      <span>{new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                      <span className="inline-flex items-center gap-1">
                        <Clock size={12} /> {post.readTime}
                      </span>
                    </div>
                  </SiteCard>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTABanner
        heading="Want insights like these in your inbox?"
        subheading="Subscribe to our newsletter — one email a month, no spam, unsubscribe anytime."
        primaryLabel="Subscribe"
        primaryHref="/#"
        secondaryLabel="Work With Us"
        secondaryHref="/contact"
      />
    </>
  );
}
