import type { Metadata } from "next";
import { ServicePage } from "@/components/site/ServicePage";
import { SERVICES } from "@/lib/site-data/services";

export const metadata: Metadata = {
  title: "Software Development — Custom Web Apps, SaaS, ERP, CRM",
  description:
    "Custom web applications, enterprise software, SaaS platforms, CRM, ERP, internal platforms, business portals, and API development.",
  alternates: { canonical: "/services/software-development" },
};

export default function SoftwareDevPage() {
  const service = SERVICES.find((s) => s.id === "software")!;
  return <ServicePage service={service} ctaLabel="Start Your Project" />;
}
