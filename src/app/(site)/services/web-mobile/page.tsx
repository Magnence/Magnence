import type { Metadata } from "next";
import { ServicePage } from "@/components/site/ServicePage";
import { SERVICES } from "@/lib/site-data/services";

export const metadata: Metadata = {
  title: "Web & Mobile — Responsive Sites, PWAs, Mobile Apps",
  description:
    "Responsive websites, progressive web apps, mobile apps, customer portals, admin dashboards, and e-commerce solutions.",
  alternates: { canonical: "/services/web-mobile" },
};

export default function WebMobilePage() {
  const service = SERVICES.find((s) => s.id === "web-mobile")!;
  return <ServicePage service={service} ctaLabel="Start Your Project" />;
}
