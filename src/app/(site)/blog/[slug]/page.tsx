import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, ArrowRight } from "lucide-react";
import { BLOG_POSTS, type BlogPost } from "@/lib/site-data/blog-posts";
import { SectionLabel } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { SiteCard } from "@/components/site/SiteCard";
import { CTABanner } from "@/components/site/CTABanner";
import { CaseStudyImage } from "@/components/site/CaseStudyImage";
import { ShareButtons } from "@/components/site/ShareButtons";
import { db } from "@/lib/db";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/** Try to load a published post from the CMS DB; fall back to hardcoded. */
async function loadPost(slug: string): Promise<BlogPost | null> {
  // 1. Hardcoded (always available, even if DB is empty)
  const hardcoded = BLOG_POSTS.find((p) => p.slug === slug);
  // 2. Try DB — published CMS post overrides hardcoded
  try {
    const dbPost = await db.blogPost.findUnique({
      where: { slug },
    });
    if (dbPost && dbPost.status === "published") {
      let content: { heading?: string; body: string }[] = [];
      try {
        content = JSON.parse(dbPost.content || "[]");
      } catch {}
      return {
        slug: dbPost.slug,
        title: dbPost.title,
        excerpt: dbPost.excerpt,
        category: dbPost.category,
        author: {
          name: dbPost.authorName,
          role: dbPost.authorRole,
          avatarGradient: dbPost.authorGradient || "linear-gradient(135deg, #fbc607, #f59e0b)",
        },
        date: dbPost.publishedAt?.toISOString() || new Date().toISOString(),
        readTime: "10 min read",
        imageGradient: dbPost.imageGradient || "linear-gradient(135deg, #fbc607, #f59e0b)",
        imageUrl: dbPost.imageUrl || "",
        content: content.length > 0 ? content : hardcoded?.content || [],
      };
    }
    // DB has the post but it's not published — fall back to hardcoded if it exists
    if (dbPost && !hardcoded) return null;
  } catch {
    // DB unavailable — fall through to hardcoded
  }
  return hardcoded || null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await loadPost(slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: `${post.title} | Magnence Blog`,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [post.author.name],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await loadPost(slug);
  if (!post) notFound();

  const related = BLOG_POSTS.filter((p) => p.slug !== slug).slice(0, 3);
  const shareUrl = `/blog/${post.slug}`;

  return (
    <>
      {/* Hero */}
      <article className="pt-20 sm:pt-24 pb-20 scroll-mt-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary text-sm transition-colors mb-6"
            >
              <ArrowLeft size={16} /> Back to all posts
            </Link>
            <div className="flex flex-col gap-4">
              <SectionLabel>{post.category}</SectionLabel>
              <h1 className="font-display font-bold text-text-primary text-3xl sm:text-4xl md:text-5xl leading-[1.15]">
                {post.title}
              </h1>
              <p className="text-text-secondary text-base sm:text-lg md:text-xl leading-relaxed">
                {post.excerpt}
              </p>
            </div>
            <div className="flex items-center justify-between flex-wrap gap-4 mt-6 pb-8 border-b border-border-subtle">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-text-primary font-display font-bold text-lg"
                  style={{ background: post.author.avatarGradient }}
                >
                  {post.author.name.charAt(0)}
                </div>
                <div>
                  <p className="text-text-primary font-semibold">{post.author.name}</p>
                  <p className="text-text-muted text-sm">{post.author.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-text-muted text-sm">
                <span>{new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                <span>·</span>
                <span className="inline-flex items-center gap-1">
                  <Clock size={12} /> {post.readTime}
                </span>
              </div>
            </div>
          </Reveal>

          {/* Cover */}
          <Reveal className="mt-10">
            <div className="aspect-[16/9] rounded-2xl overflow-hidden relative">
              <CaseStudyImage
                imageUrl={post.imageUrl}
                imageGradient={post.imageGradient}
                alt={post.title}
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </Reveal>

          {/* Body */}
          <div className="mt-12 flex flex-col gap-8">
            {post.content.map((section, i) => (
              <Reveal key={i}>
                {section.heading && (
                  <h2 className="font-display font-bold text-text-primary text-2xl md:text-3xl mt-8 mb-4">
                    {section.heading}
                  </h2>
                )}
                <p className="text-text-secondary text-lg leading-relaxed">
                  {section.body}
                </p>
              </Reveal>
            ))}
          </div>

          {/* Share buttons — working social share */}
          <div className="mt-12 pt-8 border-t border-border-subtle">
            <ShareButtons url={shareUrl} title={post.title} description={post.excerpt} />
          </div>

          {/* Author bio */}
          <Reveal className="mt-12">
            <SiteCard className="flex flex-col sm:flex-row items-start gap-6">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-text-primary font-display font-bold text-2xl flex-shrink-0"
                style={{ background: post.author.avatarGradient }}
              >
                {post.author.name.charAt(0)}
              </div>
              <div>
                <p className="text-text-muted text-xs uppercase tracking-wider font-code mb-1">
                  Written by
                </p>
                <p className="font-display font-bold text-text-primary text-xl">
                  {post.author.name}
                </p>
                <p className="text-cyan-signal text-sm mb-2">{post.author.role}</p>
                <p className="text-text-secondary text-base leading-relaxed">
                  {post.author.name} writes about engineering, design, and AI at Magnence —
                  sharing lessons learned from shipping production systems for clients across
                  13+ industries.
                </p>
              </div>
            </SiteCard>
          </Reveal>
        </div>
      </article>

      {/* Related posts */}
      <section className="py-20 lg:py-28 bg-surface border-y border-border-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display font-bold text-text-primary text-3xl mb-12">
            Related Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {related.map((p, i) => (
              <Reveal key={p.slug} delay={i * 80}>
                <Link href={`/blog/${p.slug}`} className="block h-full group">
                  <SiteCard glowing className="h-full flex flex-col gap-4">
                    <div className="h-40 rounded-xl overflow-hidden relative">
                      <CaseStudyImage
                        imageUrl={p.imageUrl}
                        imageGradient={p.imageGradient}
                        alt={p.title}
                        className="absolute inset-0 w-full h-full"
                      />
                    </div>
                    <SectionLabel className="self-start">{p.category}</SectionLabel>
                    <h3 className="font-display font-bold text-text-primary text-lg leading-tight group-hover:text-cyan-signal transition-colors">
                      {p.title}
                    </h3>
                    <span className="inline-flex items-center gap-1 text-cyan-signal text-xs font-semibold mt-auto pt-4 border-t border-border-subtle">
                      Read Article <ArrowRight size={12} />
                    </span>
                  </SiteCard>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTABanner
        heading="Like the way we think?"
        subheading="If our writing resonates, you'll probably love working with us. Book a free discovery call and find out."
        primaryLabel="Start a Project"
        primaryHref="/contact"
      />
    </>
  );
}
