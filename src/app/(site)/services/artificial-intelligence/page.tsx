import type { Metadata } from "next";
import { ServicePage } from "@/components/site/ServicePage";
import { SERVICES } from "@/lib/site-data/services";

export const metadata: Metadata = {
  title: "Artificial Intelligence — AI Agents, RAG, LLM Integrations",
  description:
    "AI agents, enterprise AI assistants, RAG systems, custom LLM integrations, AI automation, workflow design, prompt engineering, and AI consulting.",
  alternates: { canonical: "/services/artificial-intelligence" },
};

export default function AIServicePage() {
  const service = SERVICES.find((s) => s.id === "ai")!;
  return <ServicePage service={service} ctaLabel="Book an AI Consultation" />;
}
