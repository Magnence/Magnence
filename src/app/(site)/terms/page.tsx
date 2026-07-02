import type { Metadata } from "next";
import { ServiceHero } from "@/components/site/ServiceHero";
import { Reveal } from "@/components/site/Reveal";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Magnence terms of service — the terms and conditions that govern your use of our website and services.",
  alternates: { canonical: "/terms" },
};

const SECTIONS = [
  {
    heading: "1. Acceptance of Terms",
    body: "By accessing or using magnence.com (the \"Site\") and any services provided by Magnence (\"Services\"), you agree to be bound by these Terms of Service (\"Terms\"). If you do not agree to these Terms, you may not access or use the Site or Services. These Terms apply to all visitors and users of the Site.",
  },
  {
    heading: "2. Description of Services",
    body: "Magnence provides AI-first software development, design, automation, branding, marketing, video editing, and 3D rendering services to businesses worldwide. We operate across multiple countries including India, United States, United Kingdom, Singapore, UAE, Australia, Canada, and Germany, design, automation, branding, marketing, video editing, and 3D rendering services to businesses worldwide. Specific services, deliverables, timelines, and pricing are defined in separate written agreements (\"Statements of Work\" or \"SOWs\") between you and Magnence. In case of conflict between these Terms and a SOW, the SOW prevails.",
  },
  {
    heading: "3. Use of the Site",
    body: "You agree to use the Site only for lawful purposes and in a manner that does not infringe the rights of, restrict, or inhibit anyone else's use and enjoyment. Prohibited conduct includes harassment, defamation, submitting false or misleading information, attempting to gain unauthorized access, transmitting viruses or malicious code, and using automated tools to scrape or disrupt the Site.",
  },
  {
    heading: "4. Intellectual Property",
    body: "All content on this Site — including text, graphics, logos, images, software, and design — is the property of Magnence or its licensors and is protected by Indian and international intellectual property laws. You may not reproduce, distribute, modify, or create derivative works from any content without our prior written consent. Upon full payment, clients receive ownership of custom work product as specified in their SOW.",
  },
  {
    heading: "5. Project Engagements",
    body: "Each project engagement is governed by a separate SOW that specifies scope, deliverables, timeline, pricing, payment terms, and acceptance criteria. Change requests outside the original scope may incur additional fees. We reserve the right to pause or terminate work on any project that is more than 14 days overdue on payment.",
  },
  {
    heading: "6. Payment Terms",
    body: "Payment terms are specified in each SOW. Standard terms are 50% upfront, 50% on delivery for project-based work; monthly invoicing in advance for retainer engagements. Invoices are due within 7 days of issue unless otherwise stated. Late payments may incur interest at 1.5% per month.",
  },
  {
    heading: "7. Confidentiality",
    body: "Both parties agree to keep confidential any non-public information shared during the course of an engagement, including project details, business strategies, and technical information. This obligation survives termination of any engagement and may be formalized in a separate Non-Disclosure Agreement upon request.",
  },
  {
    heading: "8. Warranties and Disclaimers",
    body: "We warrant that our services will be performed in a professional, workmanlike manner consistent with industry standards. We do not warrant that the Site or any deliverable will be error-free, uninterrupted, or achieve any specific business result. To the maximum extent permitted by law, all other warranties are disclaimed.",
  },
  {
    heading: "9. Limitation of Liability",
    body: "To the maximum extent permitted by law, Magnence shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including lost profits, lost data, or business interruption, arising out of or related to the Site or Services. Our total liability for any claim shall not exceed the amounts paid by you to us in the three months preceding the claim.",
  },
  {
    heading: "10. Indemnification",
    body: "You agree to indemnify and hold harmless Magnence and its affiliates from any claims, damages, losses, or expenses (including reasonable attorney fees) arising out of your use of the Site, your violation of these Terms, or your infringement of any third-party rights.",
  },
  {
    heading: "11. Termination",
    body: "We may suspend or terminate your access to the Site at any time, with or without cause, and without notice. Upon termination of any project engagement, all unpaid invoices become immediately due, and any pre-paid fees for undelivered work will be refunded on a pro-rata basis.",
  },
  {
    heading: "12. Governing Law",
    body: "These Terms are governed by the laws of India. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts in Bangalore, Karnataka, India, without regard to conflict of law principles.",
  },
  {
    heading: "13. Changes to These Terms",
    body: "We may modify these Terms at any time. When we do, we'll revise the \"last updated\" date at the top of this page. Your continued use of the Site after changes constitutes acceptance of the revised Terms.",
  },
  {
    heading: "14. Contact",
    body: "Questions about these Terms? Contact us at support@magnence.com or write to us at: Magnence, Bangalore, Karnataka, India.",
  },
];

export default function TermsPage() {
  return (
    <>
      <ServiceHero
        eyebrow="// legal"
        title={<>Terms of Service</>}
        subtitle="Last updated: June 2026. The terms that govern your use of magnence.com and our services."
        minHeight="min-h-[50vh]"
      />
      <section className="py-20 lg:py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-10">
            {SECTIONS.map((s, i) => (
              <Reveal key={i}>
                <h2 className="font-display font-bold text-text-primary text-2xl mb-4">
                  {s.heading}
                </h2>
                <p className="text-text-secondary text-lg leading-relaxed">{s.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
