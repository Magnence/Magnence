import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://magnence.com"),
  title: {
    template: "%s | Magnence",
    default: "Magnence — AI Software, Design, Automation & Creative Studio in India | Gurugram & Bangalore",
  },
  description:
    "Magnence is an AI-first technology and creative company in India with dedicated teams for AI, software development, web & mobile, automation, UI/UX design, branding, marketing, video editing, and 3D rendering — all under one roof. HQ in Gurugram, second office in Bangalore. 150+ projects shipped for 50+ clients across 8 countries. Strict 1-to-1 confidentiality on every engagement.",
  keywords: [
    // Brand
    "Magnence", "Magnence India", "Magnence tech", "Magnence Gurugram", "Magnence Bangalore",
    // AI
    "AI development company India", "AI agents", "RAG systems", "LLM integration", "AI consulting India",
    "AI automation", "generative AI development", "chatbot development India", "AI engineer India",
    "machine learning development", "prompt engineering services",
    // Software
    "custom software development India", "software development company Gurugram", "software development company Bangalore",
    "SaaS development", "enterprise software development", "ERP development India", "CRM development",
    "API development", "custom web app development",
    // Web & Mobile
    "web development company India", "mobile app development company India", "React development India",
    "Next.js development India", "PWA development", "e-commerce development India",
    // Automation
    "business automation India", "workflow automation", "RPA development", "marketing automation",
    "HR automation", "finance automation", "document automation",
    // Design
    "UI UX design company India", "product design agency India", "design system development",
    "UX research", "wireframing", "prototyping services",
    // Branding & Creative
    "branding agency India", "brand identity design", "logo design India", "brand guidelines",
    "motion graphics India", "video editing services India", "3D modeling India", "3D rendering services",
    "architectural rendering India", "product rendering",
    // Marketing
    "digital marketing agency India", "SEO services India", "social media marketing India",
    "performance marketing", "content marketing", "email marketing", "marketing analytics",
    // Industry keywords
    "technology company India", "digital transformation India", "IT services company India",
    "creative agency India", "full-service agency India", "product engineering company",
    // Location keywords
    "Gurugram software company", "Bangalore software company", "India IT company",
    "Haryana tech company", "Karnataka tech company", "Delhi NCR software company",
    // International
    "offshore software development India", "outsource to India", "India software outsourcing",
    "hire Indian developers", "India tech talent", "best software company in India",
  ],
  authors: [{ name: "Magnence" }],
  creator: "Magnence",
  publisher: "Magnence",
  applicationName: "Magnence",
  category: "Technology",
  icons: { icon: "/logo.svg", apple: "/logo.svg" },
  openGraph: {
    title: "Magnence — AI Software, Design, Automation & Creative Studio in India",
    description:
      "AI-first technology and creative company with dedicated teams for AI, software, design, automation, branding, marketing, video, and 3D — all under one roof. HQ in Gurugram, India. 150+ projects shipped. Strict 1-to-1 confidentiality.",
    siteName: "Magnence",
    type: "website",
    locale: "en_US",
    alternateLocale: ["en_IN", "en_GB", "en_SG", "en_AU", "en_CA"],
    url: "https://magnence.com",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Magnence — Imagine. Create. Engineer. Elevate." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Magnence — AI Software, Design, Automation & Creative Studio in India",
    description:
      "AI-first technology and creative company. Software · AI · Design · Marketing · Video · 3D — all under one roof, at your budget. Gurugram & Bangalore, India.",
    creator: "@magnenceindia",
    site: "@magnenceindia",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
      "max-image-preview:": "large",
    },
  },
  alternates: {
    canonical: "https://magnence.com/",
    languages: {
      "en-US": "https://magnence.com/",
      "en-IN": "https://magnence.com/",
      "en-GB": "https://magnence.com/",
      "en-SG": "https://magnence.com/",
      "en-AU": "https://magnence.com/",
      "en-CA": "https://magnence.com/",
      "x-default": "https://magnence.com/",
    },
  },
  other: {
    "geo.region": "IN-KA",
    "geo.placename": "Bangalore, Karnataka, India",
    "geo.position": "12.9716;77.5946",
    "ICBM": "12.9716, 77.5946",
    "theme-color": "#fbc607",
    "format-detection": "telephone=no",
  },
};

// JSON-LD: Organization
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://magnence.com/#organization",
  "name": "Magnence",
  "alternateName": ["Magnence Tech", "Magnence India", "Magnence OS"],
  "description": "AI-first technology and creative company with dedicated teams for AI, software development, web & mobile, automation, UI/UX design, branding, marketing, video editing, and 3D rendering — all under one roof. Strict 1-to-1 confidentiality on every engagement.",
  "slogan": "Imagine. Create. Engineer. Elevate.",
  "url": "https://magnence.com",
  "email": "support@magnence.com",
  "telephone": "+91-9470961258",
  "logo": "https://magnence.com/logo.svg",
  "image": "https://magnence.com/og-image.png",
  "foundingDate": "2020",
  "foundingLocation": "Bangalore, India",
  "founders": [
    { "@type": "Person", "name": "Anurag Singh", "jobTitle": "Founder & CEO" },
  ],
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Bangalore",
    "addressLocality": "Bangalore",
    "addressRegion": "Karnataka",
    "postalCode": "560001",
    "addressCountry": "IN",
  },
  "contactPoint": [
    {
      "@type": "ContactPoint",
      "email": "support@magnence.com",
      "telephone": "+91-9470961258",
      "contactType": "customer support",
      "areaServed": ["IN", "US", "GB", "SG", "AE", "AU", "CA", "DE"],
      "availableLanguage": ["English", "Hindi"],
      "hoursAvailable": "Mo-Su 00:00-23:59",
    },
    {
      "@type": "ContactPoint",
      "email": "careers@magnence.com",
      "contactType": "careers",
      "areaServed": "IN",
      "availableLanguage": ["English", "Hindi"],
    },
  ],
  "sameAs": [
    "https://www.linkedin.com/company/magnenceindia/",
    "https://www.instagram.com/magnenceindia/",
    "https://x.com/magnenceindia",
    "https://facebook.com/magnenceindia",
    "https://youtube.com/@magnenceindia",
  ],
  "knowsAbout": [
    "Artificial Intelligence", "Software Development", "Web Development", "Mobile App Development",
    "Automation", "UI/UX Design", "Branding", "Digital Marketing", "Video Editing",
    "3D Modeling", "3D Rendering", "SaaS Development", "ERP Development", "CRM Development",
    "AI Agents", "RAG Systems", "LLM Integration", "Business Process Automation",
  ],
};

// JSON-LD: WebSite (with SearchAction)
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://magnence.com/#website",
  "url": "https://magnence.com",
  "name": "Magnence",
  "description": "AI-first technology and creative company. Dedicated teams for AI, software, design, automation, branding, marketing, video, and 3D — all under one roof.",
  "publisher": { "@id": "https://magnence.com/#organization" },
  "inLanguage": ["en-US", "en-IN", "en-GB", "en-SG", "en-AU", "en-CA"],
  "potentialAction": {
    "@type": "SearchAction",
    "target": { "@type": "EntryPoint", "urlTemplate": "https://magnence.com/blog?q={search_term_string}" },
    "query-input": "required name=search_term_string",
  },
};

// JSON-LD: ProfessionalService
const professionalServiceSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Magnence",
  "description": "AI-first software development, design, automation, branding, marketing, video editing, and 3D rendering services with dedicated teams for each domain under one roof.",
  "url": "https://magnence.com",
  "logo": "https://magnence.com/logo.svg",
  "image": "https://magnence.com/og-image.png",
  "priceRange": "₹₹₹",
  "currenciesAccepted": "INR, USD, EUR, GBP, SGD, AED, AUD, CAD",
  "paymentAccepted": "Credit Card, Debit Card, Bank Transfer, UPI, Wire Transfer",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Bangalore",
    "addressLocality": "Bangalore",
    "addressRegion": "Karnataka",
    "postalCode": "560001",
    "addressCountry": "IN",
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 12.9716,
    "longitude": 77.5946,
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "7",
    "bestRating": "5",
    "worstRating": "1",
  },
  "areaServed": [
    { "@type": "Country", "name": "India" },
    { "@type": "Country", "name": "United States" },
    { "@type": "Country", "name": "United Kingdom" },
    { "@type": "Country", "name": "Singapore" },
    { "@type": "Country", "name": "United Arab Emirates" },
    { "@type": "Country", "name": "Australia" },
    { "@type": "Country", "name": "Canada" },
    { "@type": "Country", "name": "Germany" },
  ],
  "serviceType": [
    "AI Development", "Software Development", "Web Development", "Mobile App Development",
    "UI/UX Design", "Branding", "Digital Marketing", "Video Editing",
    "3D Modeling", "3D Rendering", "Automation", "SaaS Development", "ERP Development",
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Magnence Services",
    "itemListElement": [
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Artificial Intelligence Development" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Custom Software Development" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Web & Mobile Development" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Business Automation" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "UI/UX Design" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Branding & Creative" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Digital Marketing" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Video Editing" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "3D Modeling & Rendering" } },
    ],
  },
};

// JSON-LD: FAQPage — captures high-intent search queries
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What services does Magnence offer?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Magnence offers 7 core services with dedicated teams for each: Artificial Intelligence (AI agents, RAG, LLM integration), Software Development, Web & Mobile, Automation, UI/UX Design, Branding & Creative (video editing, 3D modeling and rendering), and Digital Marketing — all under one roof with strict 1-to-1 confidentiality.",
      },
    },
    {
      "@type": "Question",
      "name": "Where is Magnence located?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Magnence is headquartered in Gurugram, Haryana, India, with a second office in Bangalore, Karnataka, India. We work with clients worldwide across 8 countries including India, US, UK, Singapore, UAE, Australia, Canada, and Germany.",
      },
    },
    {
      "@type": "Question",
      "name": "How much does a project with Magnence cost?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Project-based engagements start from ₹2 lakh (fixed scope, fixed price, fixed timeline). Retainer engagements start from ₹1.5 lakh per month. Dedicated team engagements are custom-quoted. Most projects range from ₹2L to ₹50L depending on scope. Book a free 30-minute discovery call at magnence.com/contact for a tailored quote.",
      },
    },
    {
      "@type": "Question",
      "name": "How long does a typical project take?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "MVP builds take 4-8 weeks. Full SaaS platforms take 3-6 months. Enterprise systems take 6+ months. We ship in weekly sprints with demos so you see progress every week.",
      },
    },
    {
      "@type": "Question",
      "name": "Does Magnence sign NDAs and keep client data confidential?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Every engagement is 1-to-1 and confidential. We sign NDAs by default. Client data, code, project details, and work products are kept private to each client — no cross-client sharing, no reuse of confidential assets. Your work stays yours.",
      },
    },
    {
      "@type": "Question",
      "name": "Does Magnence work with international clients?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. We have shipped 150+ projects for 50+ clients across 8 countries: India, United States, United Kingdom, Singapore, UAE, Australia, Canada, and Germany. We accept payments in INR, USD, EUR, GBP, SGD, AED, AUD, and CAD.",
      },
    },
    {
      "@type": "Question",
      "name": "What is Magnence's team structure?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Magnence is a senior-only, founder-led company with different dedicated teams for different works and domains — AI engineers, software engineers, designers, automation architects, branding specialists, marketers, video editors, and 3D artists — all under one roof, coordinated by a single accountable project team. No juniors learning on client time.",
      },
    },
    {
      "@type": "Question",
      "name": "What industries does Magnence serve?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We have shipped production systems across 13+ industries: Technology, SaaS, Healthcare, Education, Logistics, Manufacturing, Retail, Real Estate, Finance, Professional Services, Startups, SMB, and Enterprise. See magnence.com/industries for case studies.",
      },
    },
  ],
};

// JSON-LD: BreadcrumbList (helps Google show breadcrumbs in SERPs)
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://magnence.com/" },
    { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://magnence.com/services" },
    { "@type": "ListItem", "position": 3, "name": "About", "item": "https://magnence.com/about" },
    { "@type": "ListItem", "position": 4, "name": "Contact", "item": "https://magnence.com/contact" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalServiceSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      </head>
      <body className={`${geistSans.variable} antialiased bg-white text-foreground`}>
        {children}
        <Toaster />
        <SonnerToaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
