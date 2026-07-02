import type { Metadata } from "next";
import { ServiceHero } from "@/components/site/ServiceHero";
import { Reveal } from "@/components/site/Reveal";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Magnence privacy policy — how we collect, use, and protect your personal information.",
  alternates: { canonical: "/privacy" },
};

const SECTIONS = [
  {
    heading: "1. Introduction",
    body: "This Privacy Policy describes how Magnence (\"we\", \"us\", \"our\") collects, uses, and protects personal information when you visit magnence.com or use our services. Magnence operates across multiple countries including India, United States, United Kingdom, Singapore, UAE, Australia, Canada, and Germany. By using our website or services, you consent to the practices described in this policy. We are committed to protecting your privacy and being transparent about how your data is handled.",
  },
  {
    heading: "2. Information We Collect",
    body: "We collect information you provide directly to us — such as your name, email address, phone number, company name, and project details when you fill out our contact form or subscribe to our newsletter. We also collect information automatically when you visit our site, including your IP address, browser type, device information, pages visited, and usage data through cookies and similar technologies.",
  },
  {
    heading: "3. How We Use Your Information",
    body: "We use the information we collect to respond to your inquiries, provide services you request, send you updates and marketing communications (with your consent), analyze and improve our website and services, comply with legal obligations, and protect against fraud or unauthorized access. We do not sell your personal information to third parties under any circumstances.",
  },
  {
    heading: "4. Information Sharing",
    body: "We may share your information with service providers who help us operate our business (e.g., hosting providers, email delivery, analytics), with your consent, when required by law, or in connection with a merger or acquisition. All third-party service providers are contractually bound to protect your information and use it only for the purposes we specify.",
  },
  {
    heading: "5. Data Security",
    body: "We implement industry-standard technical and organizational security measures to protect your personal information, including encryption in transit (TLS) and at rest, access controls, regular security audits, and incident response procedures. However, no system is 100% secure, and we cannot guarantee absolute security of your data.",
  },
  {
    heading: "6. Cookies",
    body: "We use cookies and similar technologies to remember your preferences, analyze site traffic, and improve your browsing experience. You can control cookies through your browser settings, and our cookie banner allows you to accept or decline non-essential cookies. Essential cookies are necessary for the site to function and cannot be disabled.",
  },
  {
    heading: "7. Your Rights",
    body: "Depending on your location, you may have rights to access, correct, delete, or export your personal information; object to or restrict certain processing; withdraw consent; and lodge a complaint with a data protection authority. To exercise any of these rights, contact us at support@magnence.com.",
  },
  {
    heading: "8. Data Retention",
    body: "We retain personal information only as long as necessary to fulfill the purposes for which it was collected, comply with legal obligations, resolve disputes, and enforce our agreements. Retention periods vary by data type and applicable legal requirements.",
  },
  {
    heading: "9. International Transfers",
    body: "Your information may be transferred to and processed in countries other than your own, including India and the United States. We take appropriate measures to ensure your data is protected in accordance with this policy and applicable law during such transfers.",
  },
  {
    heading: "10. Changes to This Policy",
    body: "We may update this Privacy Policy from time to time. When we do, we'll revise the \"last updated\" date at the top of this page. For material changes, we'll provide a more prominent notice (such as on our homepage or via email). We encourage you to review this policy periodically.",
  },
  {
    heading: "11. Contact Us",
    body: "If you have questions or concerns about this Privacy Policy or our data practices, please contact us at support@magnence.com or write to us at: Magnence, Bangalore, Karnataka, India.",
  },
];

export default function PrivacyPage() {
  return (
    <>
      <ServiceHero
        eyebrow="// legal"
        title={<>Privacy Policy</>}
        subtitle="Last updated: June 2026. How we collect, use, and protect your personal information."
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
