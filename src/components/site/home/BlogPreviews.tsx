"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { SectionHeading } from "../Section";
import { Reveal } from "../Reveal";
import { SiteCard } from "../SiteCard";
import { CaseStudyImage } from "../CaseStudyImage";
import { BLOG_POSTS } from "@/lib/site-data/blog-posts";

export function BlogPreviews() {
  // Use useMemo to ensure stable reference between server and client renders
  const posts = React.useMemo(() => BLOG_POSTS.slice(0, 3), []);
  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            label="// insights"
            title={<>From Our Team</>}
            subtitle="Engineering, design, AI, and growth - straight from the people building Magnence."
          />
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-14">
          {posts.map((post, i) => (
            <Reveal key={post.slug} delay={i * 100}>
              <Link href={`/blog/${post.slug}`} className="block h-full group">
                <SiteCard glowing className="h-full flex flex-col gap-4">
                  <div className="h-44 rounded-xl overflow-hidden relative">
                    <CaseStudyImage
                      imageUrl={post.imageUrl}
                      imageGradient={post.imageGradient}
                      alt={post.title}
                      className="absolute inset-0 w-full h-full"
                    />
                  </div>
                  <span className="section-label self-start">{post.category}</span>
                  <h3 className="font-display font-bold text-text-primary text-xl leading-tight group-hover:text-cyan-signal transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-text-muted text-xs mt-auto pt-4 border-t border-border-subtle">
                    <span>{new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock size={12} /> {post.readTime}
                    </span>
                  </div>
                </SiteCard>
              </Link>
            </Reveal>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-cyan-signal font-semibold hover:underline"
          >
            Read All Posts <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
