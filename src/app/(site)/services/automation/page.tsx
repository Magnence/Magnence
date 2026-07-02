import type { Metadata } from "next";
import { ServicePage } from "@/components/site/ServicePage";
import { SERVICES } from "@/lib/site-data/services";

export const metadata: Metadata = {
  title: "Automation — Business Process, CRM, HR, Finance Automation",
  description:
    "Business process automation, workflow automation, CRM, marketing, HR, finance, document, and integration automation.",
  alternates: { canonical: "/services/automation" },
};

export default function AutomationPage() {
  const service = SERVICES.find((s) => s.id === "automation")!;
  return <ServicePage service={service} ctaLabel="Book an Automation Audit" />;
}
