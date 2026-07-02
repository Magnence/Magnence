import type { Metadata } from "next";
import { ServicePage } from "@/components/site/ServicePage";
import { SERVICES } from "@/lib/site-data/services";

export const metadata: Metadata = {
  title: "Branding & Creative — Identity, Logo, Motion, Video, 3D",
  description:
    "Brand identity, logo design, brand guidelines, marketing assets, presentation design, motion graphics, visual content, video editing, and 3D modeling & rendering.",
  alternates: { canonical: "/services/branding" },
};

export default function BrandingPage() {
  const service = SERVICES.find((s) => s.id === "branding")!;
  return <ServicePage service={service} ctaLabel="Start a Creative Project" />;
}
