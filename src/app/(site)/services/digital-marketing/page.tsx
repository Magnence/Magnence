import type { Metadata } from "next";
import { ServicePage } from "@/components/site/ServicePage";
import { SERVICES } from "@/lib/site-data/services";

export const metadata: Metadata = {
  title: "Digital Marketing — SEO, Social, Performance, Email",
  description:
    "Search engine optimization, social media management, performance marketing, content marketing, email marketing, and analytics & reporting.",
  alternates: { canonical: "/services/digital-marketing" },
};

export default function MarketingPage() {
  const service = SERVICES.find((s) => s.id === "marketing")!;
  return <ServicePage service={service} ctaLabel="Book a Growth Audit" />;
}
