import type { Metadata } from "next";
import { Hero } from "@/components/site/home/Hero";
import { TrustedBy } from "@/components/site/home/TrustedBy";
import { ServicesGrid } from "@/components/site/home/ServicesGrid";
import { Stats } from "@/components/site/home/Stats";
import { FeaturedWork } from "@/components/site/home/FeaturedWork";
import { ProcessPreview } from "@/components/site/home/ProcessPreview";
import { IndustryCloud } from "@/components/site/home/IndustryCloud";
import { CreativeServices } from "@/components/site/home/CreativeServices";
import { Testimonials } from "@/components/site/home/Testimonials";
import { CTABanner } from "@/components/site/CTABanner";
import { BlogPreviews } from "@/components/site/home/BlogPreviews";
import { DedicatedTeams } from "@/components/site/home/DedicatedTeams";

export const metadata: Metadata = {
  title: "Magnence — AI Software, Design, Automation & Creative Studio in India | Bangalore & Gurugram",
  description:
    "Magnence is India's AI-first technology and creative company with specialized, dedicated teams for every discipline — Artificial Intelligence, Software Engineering, Web & Mobile, Automation, UX/UI Design, Branding, Digital Marketing, Video Production, and 3D Rendering — operating as one coordinated unit under a single roof. Headquartered in Bangalore, second office in Gurugram. 150+ projects shipped for 50+ clients across 8 countries. Strict 1-to-1 confidentiality on every engagement.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Magnence — AI Software, Design, Automation & Creative Studio in India",
    description:
      "Specialized, dedicated teams for every discipline — AI, Software Engineering, Web & Mobile, Automation, UX/UI Design, Branding, Digital Marketing, Video Production, and 3D Rendering — operating as one coordinated unit under a single roof. Headquartered in Bangalore, second office in Gurugram, India. 150+ projects shipped. Strict 1-to-1 confidentiality.",
    type: "website",
    url: "/",
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustedBy />
      <DedicatedTeams />
      <ServicesGrid />
      <Stats />
      <FeaturedWork />
      <ProcessPreview />
      <IndustryCloud />
      <CreativeServices />
      <Testimonials />
      <CTABanner />
      <BlogPreviews />
    </>
  );
}
