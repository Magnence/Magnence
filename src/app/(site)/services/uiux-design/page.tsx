import type { Metadata } from "next";
import { ServicePage } from "@/components/site/ServicePage";
import { SERVICES } from "@/lib/site-data/services";

export const metadata: Metadata = {
  title: "UI/UX Design — Product Strategy, UX Research, Design Systems",
  description:
    "Product strategy, UX design, UI design, design systems, prototyping, user research, and wireframing.",
  alternates: { canonical: "/services/uiux-design" },
};

export default function UIUXPage() {
  const service = SERVICES.find((s) => s.id === "uiux")!;
  return <ServicePage service={service} ctaLabel="Start a Design Project" />;
}
