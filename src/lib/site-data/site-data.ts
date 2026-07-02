export interface Industry {
  name: string;
  slug: string;
  icon: string;
  description: string;
  keyServices: string[];
  heroGradient: string;
  challenge: string;
  approach: string;
  capabilities: string[];
  outcomes: { value: string; label: string }[];
  techStack: string[];
}

export const INDUSTRIES: Industry[] = [
  {
    name: "Technology",
    slug: "technology",
    icon: "Cpu",
    description: "Product engineering, platform builds, and AI integrations for high-growth tech companies.",
    keyServices: ["Software Dev", "AI", "Automation"],
    heroGradient: "linear-gradient(135deg, #fbc607 0%, #f59e0b 100%)",
    challenge: "High-growth tech companies ship fast but accumulate tech debt just as fast. Legacy architectures, manual ops, and siloed data slow down the next phase of growth — and AI capabilities feel out of reach without dedicated ML engineers.",
    approach: "We embed with your engineering team, audit the existing stack, and ship incremental improvements that compound. AI integrations are designed as production systems from day one — not bolted-on demos.",
    capabilities: [
      "Platform engineering & architecture reviews",
      "AI agent & RAG system development",
      "Developer tools and internal platforms",
      "Real-time data pipelines",
      "API design and SDK generation",
      "Production observability and SRE practices",
    ],
    outcomes: [
      { value: "3×", label: "Faster feature shipping velocity" },
      { value: "60%", label: "Reduction in manual ops work" },
      { value: "99.95%", label: "Production uptime achieved" },
    ],
    techStack: ["Next.js", "Python", "FastAPI", "PostgreSQL", "Redis", "Kubernetes", "OpenAI", "LangChain"],
  },
  {
    name: "SaaS",
    slug: "saas",
    icon: "Cloud",
    description: "Multi-tenant SaaS platforms, design systems, and growth marketing for B2B and B2C SaaS.",
    keyServices: ["Software Dev", "UI/UX", "Marketing"],
    heroGradient: "linear-gradient(135deg, #f59e0b 0%, #fbc607 100%)",
    challenge: "SaaS companies need to ship features fast, keep multi-tenant data isolated, maintain 99.9%+ uptime, and grow monthly recurring revenue — all while keeping customer acquisition cost low enough to scale profitably.",
    approach: "We build multi-tenant SaaS platforms with billing, RBAC, audit trails, and analytics baked in. Our design systems ensure UX consistency across modules, and our growth marketing team runs PLG funnels end-to-end.",
    capabilities: [
      "Multi-tenant SaaS architecture",
      "Subscription billing (Stripe, Razorpay)",
      "Role-based access control",
      "In-app analytics & reporting",
      "Design systems & component libraries",
      "PLG growth marketing",
    ],
    outcomes: [
      { value: "0→$1M", label: "ARR in 9 months for NorthStar" },
      { value: "47", label: "SaaS companies onboarded" },
      { value: "4.7★", label: "Average customer rating" },
    ],
    techStack: ["Next.js", "Node.js", "PostgreSQL", "Stripe", "Vercel", "Mixpanel", "HubSpot"],
  },
  {
    name: "Healthcare",
    slug: "healthcare",
    icon: "HeartPulse",
    description: "HIPAA-aware systems, clinical workflows, and AI assistants for providers and payers.",
    keyServices: ["AI", "Software Dev", "Automation"],
    heroGradient: "linear-gradient(135deg, #fbc607 0%, #f59e0b 100%)",
    challenge: "Healthcare providers and payers operate under strict regulatory constraints (HIPAA, ABDM) while trying to modernize clinical workflows, reduce administrative burden, and improve patient outcomes — all without disrupting care.",
    approach: "We build HIPAA-aware systems with audit trails, role-based access, and ABDM integration. Our AI assistants help clinicians summarize records, draft notes, and surface relevant guidelines — never replacing clinical judgment, always augmenting it.",
    capabilities: [
      "HIPAA-compliant web & mobile apps",
      "ABDM (Ayushman Bharat Digital Mission) integration",
      "Clinical workflow automation",
      "AI medical record summarization",
      "Patient portals & telehealth",
      "Claims processing automation",
    ],
    outcomes: [
      { value: "42%", label: "Reduction in clinician admin time" },
      { value: "98%", label: "Claims processed without rework" },
      { value: "4.8★", label: "Patient satisfaction score" },
    ],
    techStack: ["Next.js", "FastAPI", "PostgreSQL", "ABDM SDK", "OpenAI", "LangChain", "AWS"],
  },
  {
    name: "Education",
    slug: "education",
    icon: "GraduationCap",
    description: "Learning platforms, student portals, and AI tutoring systems for K-12 and higher ed.",
    keyServices: ["Web & Mobile", "AI", "UI/UX"],
    heroGradient: "linear-gradient(135deg, #f59e0b 0%, #fbc607 100%)",
    challenge: "Educational institutions struggle with engagement, personalization, and assessment at scale. Traditional LMS platforms are clunky, teachers are overwhelmed with admin work, and students expect consumer-grade digital experiences.",
    approach: "We build learning platforms that students actually want to use. AI tutoring systems adapt to individual learning styles, automated assessment saves teacher time, and parent portals keep families engaged.",
    capabilities: [
      "Learning Management Systems (LMS)",
      "AI tutoring & personalized learning paths",
      "Automated assessment & grading",
      "Student & parent portals",
      "Live class & webinar platforms",
      "Analytics dashboards for educators",
    ],
    outcomes: [
      { value: "3.2×", label: "Increase in student engagement" },
      { value: "65%", label: "Reduction in teacher admin time" },
      { value: "4.9★", label: "Student app rating" },
    ],
    techStack: ["Next.js", "React Native", "Node.js", "PostgreSQL", "OpenAI", "WebRTC", "Mux"],
  },
  {
    name: "Logistics",
    slug: "logistics",
    icon: "Truck",
    description: "Fleet, route, and warehouse systems with real-time tracking and analytics.",
    keyServices: ["Software Dev", "Automation", "Web & Mobile"],
    heroGradient: "linear-gradient(135deg, #fbc607 0%, #f59e0b 100%)",
    challenge: "Logistics companies run on tight margins with high operational complexity — fleet tracking, route optimization, warehouse management, billing, and customer communication all need to work in real time across distributed teams.",
    approach: "We build vertical SaaS for logistics: real-time fleet tracking, AI route optimization, automated billing, and customer-facing tracking portals. Every system is observable, every action is auditable.",
    capabilities: [
      "Fleet tracking & telematics integration",
      "AI route optimization",
      "Warehouse management systems",
      "Automated billing & reconciliation",
      "Customer tracking portals",
      "Real-time analytics dashboards",
    ],
    outcomes: [
      { value: "32%", label: "Reduction in delivery times" },
      { value: "27%", label: "Lower fuel costs via route AI" },
      { value: "98%", label: "On-time delivery rate" },
    ],
    techStack: ["Next.js", "Node.js", "PostgreSQL", "Redis", "Mapbox", "MQTT", "WebSocket"],
  },
  {
    name: "Manufacturing",
    slug: "manufacturing",
    icon: "Factory",
    description: "ERP, inventory, procurement, and shop-floor automation for manufacturers.",
    keyServices: ["Software Dev", "Automation", "AI"],
    heroGradient: "linear-gradient(135deg, #f59e0b 0%, #fbc607 100%)",
    challenge: "Manufacturers run on legacy ERPs that don't talk to each other, manual procurement processes, opaque inventory, and shop-floor data locked in paper or siloed systems. The result: stockouts, overproduction, and missed delivery dates.",
    approach: "We build modern ERP modules that connect to legacy systems, automate procurement with AI demand forecasting, and instrument the shop floor with IoT sensors that feed real-time dashboards.",
    capabilities: [
      "Modern ERP modules (inventory, procurement, production)",
      "Legacy ERP integration (SAP, Tally, custom)",
      "AI demand forecasting",
      "Shop-floor IoT & real-time dashboards",
      "Vendor portal & supply chain automation",
      "Quality control automation",
    ],
    outcomes: [
      { value: "45%", label: "Reduction in inventory carrying cost" },
      { value: "62%", label: "Faster procurement cycle times" },
      { value: "99.2%", label: "On-time production completion" },
    ],
    techStack: ["Next.js", "Python", "PostgreSQL", "MQTT", "InfluxDB", "OpenAI", "Grafana"],
  },
  {
    name: "Retail",
    slug: "retail",
    icon: "ShoppingBag",
    description: "Omnichannel commerce, inventory, and customer experience systems for retailers.",
    keyServices: ["Web & Mobile", "AI", "Marketing"],
    heroGradient: "linear-gradient(135deg, #fbc607 0%, #f59e0b 100%)",
    challenge: "Retailers need to deliver seamless omnichannel experiences — online, in-store, mobile — while managing inventory across channels, personalizing marketing, and competing with the Amazons of the world on customer experience.",
    approach: "We build headless commerce platforms with real-time inventory sync, AI-powered product recommendations, and integrated marketing automation. In-store experiences connect to digital profiles for true omnichannel commerce.",
    capabilities: [
      "Headless e-commerce (Shopify, custom)",
      "Omnichannel inventory sync",
      "AI product recommendations",
      "Customer loyalty programs",
      "Marketing automation (email, SMS, social)",
      "In-store digital experiences",
    ],
    outcomes: [
      { value: "+38%", label: "Average order value increase" },
      { value: "2.4×", label: "Customer lifetime value lift" },
      { value: "32%", label: "Reduction in stockouts" },
    ],
    techStack: ["Next.js", "Shopify", "Stripe", "Klaviyo", "Segment", "OpenAI", "Algolia"],
  },
  {
    name: "Real Estate",
    slug: "real-estate",
    icon: "Building2",
    description: "Listing platforms, CRM, virtual tours, and architectural renders for real estate.",
    keyServices: ["Web & Mobile", "3D & Rendering", "CRM"],
    heroGradient: "linear-gradient(135deg, #f59e0b 0%, #fbc607 100%)",
    challenge: "Real estate buyers expect immersive digital experiences — virtual tours, photoreal renders, instant mortgage calc — but most brokerages run on outdated listing platforms and manual CRM processes.",
    approach: "We build listing platforms with virtual tour integration, CRM systems tailored to broker workflows, and our in-house 3D team delivers photoreal architectural renders that sell properties before they're built.",
    capabilities: [
      "Listing platforms with map search",
      "Broker CRM & lead management",
      "Virtual tour integration",
      "Architectural 3D rendering (interior + exterior)",
      "Mortgage calculator & pre-approval flows",
      "Buyer/seller portals",
    ],
    outcomes: [
      { value: "+47%", label: "Inquiry-to-site-visit conversion" },
      { value: "3.1×", label: "Faster property sell-through" },
      { value: "4.8★", label: "Buyer experience rating" },
    ],
    techStack: ["Next.js", "Mapbox", "Three.js", "Blender", "V-Ray", "Node.js", "PostgreSQL"],
  },
  {
    name: "Finance",
    slug: "finance",
    icon: "Landmark",
    description: "FinTech platforms, AP automation, and AI-driven analytics for financial services.",
    keyServices: ["Software Dev", "AI", "Automation"],
    heroGradient: "linear-gradient(135deg, #fbc607 0%, #f59e0b 100%)",
    challenge: "Financial services firms operate under strict regulatory oversight (RBI, SEBI) while trying to modernize legacy systems, automate manual processes, and deploy AI without introducing compliance risk or model bias.",
    approach: "We build FinTech platforms with audit trails, KYC/AML integrations, and escrow systems. AI is deployed with full observability — every decision explainable, every model version tracked, every drift detected.",
    capabilities: [
      "FinTech platforms (lending, payments, escrow)",
      "AP & AR automation",
      "KYC/AML integration",
      "AI risk scoring (explainable models)",
      "Regulatory compliance reporting",
      "Real-time fraud detection",
    ],
    outcomes: [
      { value: "87%", label: "Reduction in manual AP work" },
      { value: "30→7", label: "Days median payment cycle" },
      { value: "$2M+", label: "Escrow volume in first quarter" },
    ],
    techStack: ["Next.js", "Node.js", "PostgreSQL", "Stripe Connect", "Plaid", "OpenAI", "Temporal"],
  },
  {
    name: "Professional Services",
    slug: "professional-services",
    icon: "Briefcase",
    description: "Practice management, client portals, and document automation for services firms.",
    keyServices: ["Software Dev", "Automation", "UI/UX"],
    heroGradient: "linear-gradient(135deg, #f59e0b 0%, #fbc607 100%)",
    challenge: "Professional services firms (legal, accounting, consulting) lose billable hours to admin work — document drafting, time tracking, client communication, and engagement management all happen across disconnected tools.",
    approach: "We build practice management platforms that consolidate engagement lifecycle: client intake, matter/project management, document automation, time tracking, and billing — with client portals for transparent collaboration.",
    capabilities: [
      "Practice & matter management",
      "Client intake & engagement letters",
      "Document automation (contracts, reports)",
      "Time tracking & billing",
      "Client collaboration portals",
      "Knowledge management systems",
    ],
    outcomes: [
      { value: "+28%", label: "Billable hours captured" },
      { value: "65%", label: "Faster document turnaround" },
      { value: "4.7★", label: "Client satisfaction score" },
    ],
    techStack: ["Next.js", "Node.js", "PostgreSQL", "DocuSign", "OpenAI", "Pandadoc"],
  },
  {
    name: "Startups",
    slug: "startups",
    icon: "Rocket",
    description: "MVP builds, investor-ready demos, and full-stack execution for early-stage startups.",
    keyServices: ["Software Dev", "Branding", "Marketing"],
    heroGradient: "linear-gradient(135deg, #fbc607 0%, #f59e0b 100%)",
    challenge: "Early-stage startups need to ship an MVP in weeks, raise capital, and prove product-market fit — all with limited engineering bandwidth and zero room for technical debt that slows future iterations.",
    approach: "We act as your fractional engineering team — shipping MVPs in 4-8 weeks, building investor-ready demos, and providing the full-stack execution (software + design + branding + marketing) to get you from idea to Series A.",
    capabilities: [
      "MVP builds (4-8 week sprints)",
      "Investor demo engineering",
      "Brand identity & pitch deck design",
      "Landing page & growth site builds",
      "Analytics & event tracking setup",
      "Tech stack selection & architecture",
    ],
    outcomes: [
      { value: "6 wks", label: "Average MVP time-to-launch" },
      { value: "$15M+", label: "Funding raised by clients" },
      { value: "12+", label: "Startups scaled to Series A" },
    ],
    techStack: ["Next.js", "Node.js", "PostgreSQL", "Stripe", "Vercel", "Figma", "Mixpanel"],
  },
  {
    name: "SMB",
    slug: "smb",
    icon: "Store",
    description: "Affordable, right-sized systems that replace spreadsheets and siloed tools.",
    keyServices: ["Software Dev", "Automation", "Marketing"],
    heroGradient: "linear-gradient(135deg, #f59e0b 0%, #fbc607 100%)",
    challenge: "Small and medium businesses run on spreadsheets, WhatsApp, and a patchwork of point solutions that don't talk to each other. Off-the-shelf software is either too generic or too expensive — and customization feels out of reach.",
    approach: "We build right-sized systems that replace spreadsheet chaos with simple, automated workflows. Pricing is transparent and scalable — start small, add capabilities as you grow, never pay for features you don't use.",
    capabilities: [
      "Custom CRM & operations dashboards",
      "Workflow automation (no more spreadsheets)",
      "Customer-facing portals & forms",
      "Email & SMS marketing automation",
      "Local SEO & Google Business optimization",
      "Affordable retainer-based support",
    ],
    outcomes: [
      { value: "3 FTEs", label: "Worth of manual work automated" },
      { value: "₹1.5L/mo", label: "Starting retainer for full support" },
      { value: "4.8★", label: "Average client rating" },
    ],
    techStack: ["Next.js", "Node.js", "PostgreSQL", "Stripe", "Twilio", "Google Workspace"],
  },
  {
    name: "Enterprise",
    slug: "enterprise",
    icon: "Building",
    description: "Multi-region, multi-tenant platforms with compliance, RBAC, and observability baked in.",
    keyServices: ["Software Dev", "AI", "Automation"],
    heroGradient: "linear-gradient(135deg, #fbc607 0%, #f59e0b 100%)",
    challenge: "Enterprises need to modernize legacy systems without disrupting operations, deploy AI responsibly across business units, and maintain compliance (SOC 2, ISO 27001) while shipping at the speed of digital-native competitors.",
    approach: "We build multi-region, multi-tenant platforms with RBAC, audit trails, SSO, and observability baked in. Our delivery model includes dedicated teams, sprint cadences aligned to your governance, and full documentation for handoff.",
    capabilities: [
      "Multi-region platform engineering",
      "Legacy modernization (strangler pattern)",
      "Enterprise AI with full governance",
      "SSO (SAML, OIDC) & RBAC",
      "SOC 2 / ISO 27001 compliance support",
      "Dedicated team engagements",
    ],
    outcomes: [
      { value: "99.99%", label: "SLA uptime achieved" },
      { value: "12+", label: "Enterprise systems modernized" },
      { value: "SOC 2", label: "Compliance-ready deployments" },
    ],
    techStack: ["Next.js", "Java", "Python", "PostgreSQL", "Kubernetes", "AWS", "Okta", "Datadog"],
  },
];

// === Company info (single source of truth) ===
export const COMPANY_INFO = {
  name: "Magnence",
  tagline: "Imagine. Create. Engineer. Elevate.",
  foundedYear: 2020,
  foundedLocation: "Bangalore, India",
  email: "support@magnence.com",
  careersEmail: "careers@magnence.com",
  phone: "+91 9470961258",
  phoneHref: "tel:+919470961258",
  locations: [
    {
      city: "Bangalore",
      region: "Karnataka",
      country: "India",
      label: "Bangalore, India (HQ)",
      address: "Bangalore, Karnataka, India",
    },
    {
      city: "Gurugram",
      region: "Haryana",
      country: "India",
      label: "Gurugram, India",
      address: "Gurugram, Haryana, India",
    },
  ],
  primaryLocation: "Bangalore, India",
  hours: "24×7 Available",
  website: "https://magnence.com",
  countries: ["India", "United States", "United Kingdom", "Singapore", "UAE", "Australia", "Canada", "Germany"],
};

export const SOCIAL_LINKS = {
  linkedin: "https://www.linkedin.com/company/magnenceindia/",
  instagram: "https://www.instagram.com/magnenceindia/",
  twitter: "https://x.com/magnenceindia",
  facebook: "https://facebook.com/magnenceindia",
  youtube: "https://youtube.com/@magnenceindia",
};

export const INDUSTRY_TAGS = [
  "Technology", "SaaS", "Healthcare", "Education", "Logistics", "Manufacturing",
  "Retail", "Real Estate", "Finance", "Professional Services", "Startups", "SMB", "Enterprise",
];

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
  icon: string;
  deliverables: string[];
}

export const PROCESS_STEPS: ProcessStep[] = [
  { number: "01", title: "Discovery & Business Analysis", description: "We start by understanding your goals, market, users, and technical constraints — not your feature list.", icon: "Search", deliverables: ["Stakeholder interviews", "User research", "Constraints doc"] },
  { number: "02", title: "Strategy & Solution Design", description: "Roadmap, tech stack selection, scope definition, and timeline — aligned to your business outcomes.", icon: "Target", deliverables: ["Product roadmap", "Tech stack", "Scope document"] },
  { number: "03", title: "Architecture Planning", description: "System design, database schema, API contracts, and infrastructure — built for scale and change.", icon: "GitBranch", deliverables: ["Architecture diagrams", "Schema", "API contracts"] },
  { number: "04", title: "UI/UX Design", description: "Wireframes, prototypes, design system, and user testing — before a single line of production code.", icon: "Palette", deliverables: ["Wireframes", "Hi-fi prototypes", "Design system"] },
  { number: "05", title: "Agile Development", description: "Sprint-based builds, daily updates, code reviews, and CI/CD — with you in the loop every step.", icon: "Code2", deliverables: ["Sprint demos", "Code reviews", "CI/CD pipeline"] },
  { number: "06", title: "Testing & Quality Assurance", description: "Unit, integration, E2E, performance, and security testing — automated and continuous.", icon: "ShieldCheck", deliverables: ["Test suite", "Perf report", "Security audit"] },
  { number: "07", title: "Deployment", description: "Cloud provisioning, containerization, and production launch — with progressive rollout and rollback.", icon: "Rocket", deliverables: ["Production deploy", "Runbook", "Monitoring"] },
  { number: "08", title: "Training & Knowledge Transfer", description: "Documentation, team onboarding, and video walkthroughs — so your team owns the system.", icon: "GraduationCap", deliverables: ["Docs", "Onboarding sessions", "Video walkthroughs"] },
  { number: "09", title: "Ongoing Support & Optimization", description: "Monitoring, bug fixes, feature iterations, and scale — a true partnership, not a handoff.", icon: "RefreshCw", deliverables: ["SLA", "Monthly reviews", "Roadmap updates"] },
];

export const HOME_PROCESS_PREVIEW = [
  { number: "01", title: "Discovery", description: "Understand goals, users, and constraints." },
  { number: "02", title: "Strategy", description: "Roadmap, tech stack, scope, timeline." },
  { number: "03", title: "Design", description: "Wireframes, prototypes, design system." },
  { number: "04", title: "Engineering", description: "Sprint-based builds with CI/CD." },
  { number: "05", title: "Launch", description: "Production deploy and ongoing support." },
];

export interface Stat {
  value: number;
  suffix: string;
  label: string;
}

export const STATS: Stat[] = [
  { value: 150, suffix: "+", label: "Projects Delivered" },
  { value: 50, suffix: "+", label: "Clients Worldwide" },
  { value: 98, suffix: "%", label: "Client Satisfaction" },
  { value: 24, suffix: "/7", label: "Support & Monitoring" },
];

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  avatarGradient: string;
  rating: number;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote: "Magnence rebuilt our dealer management portal end-to-end in 11 weeks. The old system used to crash during quarter-close; the new one handled 4× the load without a hiccup. Their team felt like our own engineers, not vendors.",
    name: "Harshvardhan Poddar",
    role: "Director",
    company: "Mewar Ferro Alloys",
    avatarGradient: "linear-gradient(135deg, #fbc607, #f59e0b)",
    rating: 5,
  },
  {
    quote: "We hired Magnence to design our D2C packaging and launch website for a niche ayurvedic brand. They understood the category better than agencies twice their size. Sold out our first batch in 9 days.",
    name: "Saanvi Mehta",
    role: "Founder",
    company: "Vridhi Botanicals",
    avatarGradient: "linear-gradient(135deg, #f59e0b, #fbc607)",
    rating: 5,
  },
  {
    quote: "Our cooperative bank needed a chatbot that actually understood Hindi queries. Magnence shipped a RAG system that handles Marathi, Hindi and English fluently. 64% of Tier-1 queries now resolved without a human agent.",
    name: "Rajeshwar Iyer",
    role: "IT Head",
    company: "Sahyadri Gramin Bank",
    avatarGradient: "linear-gradient(135deg, #e07b3a, #fbc607)",
    rating: 5,
  },
  {
    quote: "We were spending ₹14 lakh a month on paid ads with flat growth. Magnence restructured our funnels, rebuilt the landing pages, and rewrote the creative. Three months in, CAC dropped 38% and we hit our best quarter ever.",
    name: "Tenzin Norbu",
    role: "Marketing Lead",
    company: "Himalaya Craft Collective",
    avatarGradient: "linear-gradient(135deg, #fbc607, #e07b3a)",
    rating: 5,
  },
  {
    quote: "Magnence built our entire logistics tracking platform — driver app, customer portal, ops dashboard. What stood out was the engineering maturity: tests, monitoring, proper rollback. Felt like working with a Series-B tech team, not a services firm.",
    name: "Deepika Raghunathan",
    role: "VP Operations",
    company: "Coromandel Carriers",
    avatarGradient: "linear-gradient(135deg, #f59e0b, #e07b3a)",
    rating: 5,
  },
  {
    quote: "We needed 3D renders for a 240-unit residential project on a tight marketing deadline. Magnence turned around photorealistic interiors and exteriors in 18 days. Our pre-launch conversions jumped 27% — directly attributable to those visuals.",
    name: "Karthik Venkataraman",
    role: "Sales Director",
    company: "Aadya Infra Ventures",
    avatarGradient: "linear-gradient(135deg, #fbc607, #f59e0b)",
    rating: 5,
  },
  {
    quote: "Our SaaS was bleeding churn at 9% monthly. Magnence audited the product, rebuilt the onboarding flow, and added AI-driven in-app nudges. Six months later, churn is down to 3.4% and net revenue retention crossed 115%. Genuinely transformational.",
    name: "Ananya Bhattacharya",
    role: "CEO",
    company: "Lakshya HR Tech",
    avatarGradient: "linear-gradient(135deg, #e07b3a, #f59e0b)",
    rating: 5,
  },
];

// Keep only 5 testimonials for the "What Clients Say" section
export const TESTIMONIALS_5 = TESTIMONIALS.slice(0, 5);

export interface CoreValue {
  icon: string;
  name: string;
  description: string;
}

export const CORE_VALUES: CoreValue[] = [
  { icon: "Users", name: "Customer First", description: "Your outcomes are our outcomes. We optimize for your success, not our convenience." },
  { icon: "ShieldCheck", name: "Integrity", description: "We tell you the truth — about feasibility, timelines, and trade-offs. Even when it's hard." },
  { icon: "Lightbulb", name: "Innovation with Purpose", description: "We use the latest tech to solve real problems — not to chase shiny objects." },
  { icon: "Code2", name: "Engineering Excellence", description: "Clean code, rigorous testing, and architecture that scales. No shortcuts." },
  { icon: "GraduationCap", name: "Continuous Learning", description: "We invest in our team's growth — and bring that learning back to your project." },
  { icon: "Target", name: "Accountability", description: "We own outcomes. If something breaks, we fix it. If we miss, we make it right." },
  { icon: "Eye", name: "Transparency", description: "Full visibility into progress, code, and decisions. You always know where things stand." },
  { icon: "Handshake", name: "Collaboration", description: "We work with you, not at you. Your team is part of the build from day one." },
  { icon: "Lock", name: "Security by Design", description: "Security isn't a phase — it's how we build. RBAC, encryption, and audit trails by default." },
  { icon: "TrendingUp", name: "Long-Term Thinking", description: "We build for the next 5 years, not the next demo. Decisions compound — make good ones." },
];

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  avatarGradient: string;
  linkedin: string;
}

export const TEAM: TeamMember[] = [
  { name: "Anurag Singh", role: "Founder & CEO", bio: "12+ years building AI systems at scale. Believes the best software is invisible — it just works, quietly, every single time.", avatarGradient: "linear-gradient(135deg, #fbc607, #f59e0b)", linkedin: "https://www.linkedin.com/company/magnenceindia/" },
  { name: "Rituraj Sharma", role: "Head of Design & Creative", bio: "10+ years designing products people love. Obsessed with the details users feel but never see — the micro-interactions that build trust.", avatarGradient: "linear-gradient(135deg, #e07b3a, #fbc607)", linkedin: "https://www.linkedin.com/company/magnenceindia/" },
  { name: "Yashraj Kumar", role: "Principal Engineer", bio: "11+ years shipping production systems. Lives and breathes observability — if it's not monitored, it's not in production.", avatarGradient: "linear-gradient(135deg, #f59e0b, #fbc607)", linkedin: "https://www.linkedin.com/company/magnenceindia/" },
  { name: "Reeshav Raj", role: "Automation Architect", bio: "Has automated more workflows than he can count. Loves a good idempotency key and a clean retry policy.", avatarGradient: "linear-gradient(135deg, #fbc607, #e07b3a)", linkedin: "https://www.linkedin.com/company/magnenceindia/" },
];

export const WHY_CHOOSE_MAGNENCE = [
  { icon: "Brain", title: "AI-First by Default", description: "We don't bolt AI on after the fact — we design systems with AI at the core from day one. Every project benefits from our deep AI engineering bench." },
  { icon: "Layers", title: "Specialized Dedicated Teams, One Roof", description: "Specialized, dedicated teams for every discipline — AI engineers, software engineers, designers, automation architects, branding specialists, marketers, video editors, and 3D artists — operating as one coordinated unit under a single roof, led by one accountable project team. No handoffs, no finger-pointing." },
  { icon: "Users", title: "Senior Team, No Offshoring", description: "Every project is staffed with senior engineers and designers. No juniors learning on your dime, no opaque offshore teams." },
  { icon: "ShieldCheck", title: "Production-Grade Engineering", description: "We ship systems that scale — with tests, observability, and architecture built for the long haul. Not demos that fall over in week two." },
  { icon: "Gauge", title: "Fast Without Reckless", description: "We ship in weeks, not quarters — but with progressive delivery, automated rollback, and observability baked in. Speed you can trust." },
  { icon: "Wallet", title: "Transparent, Fixed Pricing", description: "Fixed-scope quotes with no surprise change orders. You know exactly what you're paying for and when, before we start." },
  { icon: "RefreshCw", title: "True Partnership", description: "We don't disappear after launch. Ongoing support, monthly reviews, and roadmap updates — a real partnership, not a vendor handoff." },
  { icon: "Lock", title: "Strict 1-to-1 Confidentiality", description: "Your projects, data, source code, and deliverables remain strictly confidential between you and our team. Non-Disclosure Agreements are executed by default on every engagement. We do not share client information across accounts, nor do we repurpose your proprietary assets elsewhere. Full intellectual property ownership transfers to you — from the first consultation through final deployment. No exceptions, no caveats." },
];

export const TECH_MARQUEE = [
  "React", "Next.js", "Python", "FastAPI", "PostgreSQL", "AWS", "Docker",
  "OpenAI", "LangChain", "Figma", "Vercel", "Node.js", "MongoDB", "Redis",
  "Kubernetes", "TailwindCSS", "Stripe", "Supabase",
];

export const TECH_FOCUS = [
  { name: "AI/ML", icon: "Brain" },
  { name: "Full-Stack", icon: "Code2" },
  { name: "Mobile", icon: "Smartphone" },
  { name: "Cloud", icon: "Cloud" },
  { name: "DevOps", icon: "Server" },
  { name: "APIs", icon: "Webhook" },
  { name: "Automation", icon: "Workflow" },
  { name: "Data Engineering", icon: "Database" },
  { name: "Analytics", icon: "BarChart3" },
  { name: "Security", icon: "ShieldCheck" },
];

export const CAREERS_BENEFITS = [
  { icon: "Home", title: "Remote-First", description: "Work from anywhere in India. Quarterly offsites in Bangalore, Goa, or wherever the team votes to meet." },
  { icon: "Wallet", title: "Competitive Pay", description: "Top-of-market salaries reviewed every 6 months. Equity for early team members." },
  { icon: "GraduationCap", title: "Learning Budget", description: "₹50K annual learning budget for courses, books, and conferences. Plus dedicated learning Fridays." },
  { icon: "TrendingUp", title: "Equity Options", description: "Every full-time hire gets equity. We all win when Magnence wins." },
  { icon: "Laptop", title: "Modern Tools", description: "Top-tier MacBook, 4K monitor, and your pick of software. Plus a ₹1L home-office setup budget." },
  { icon: "Zap", title: "High Ownership", description: "Real ownership from day one. You'll ship to production in your first week — not your sixth month." },
];

export const OPEN_POSITIONS = [
  { title: "Senior Full-Stack Engineer", department: "Engineering", location: "Remote / Gurugram", type: "Full-time" },
  { title: "AI Engineer", department: "AI/ML", location: "Remote / Gurugram", type: "Full-time" },
  { title: "Product Designer", department: "Design", location: "Remote / Gurugram", type: "Full-time" },
  { title: "DevOps Engineer", department: "Engineering", location: "Remote", type: "Full-time" },
  { title: "Motion Designer", department: "Design", location: "Remote / Bangalore", type: "Contract" },
  { title: "Growth Marketer", department: "Marketing", location: "Remote", type: "Full-time" },
  { title: "Engineering Manager", department: "Engineering", location: "Remote / Gurugram", type: "Full-time" },
  { title: "3D Artist", department: "Design", location: "Remote", type: "Contract" },
];

export const CAREERS_DEPARTMENTS = ["All", "Engineering", "Design", "AI/ML", "Marketing", "Operations"];

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Industries", href: "/industries" },
  { label: "Process", href: "/process" },
  { label: "Work", href: "/work" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export const FOOTER_LINKS = {
  quick: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Industries", href: "/industries" },
    { label: "Process", href: "/process" },
  ],
  services: [
    { label: "Artificial Intelligence", href: "/services/artificial-intelligence" },
    { label: "Software Development", href: "/services/software-development" },
    { label: "Web & Mobile", href: "/services/web-mobile" },
    { label: "Automation", href: "/services/automation" },
    { label: "UI/UX Design", href: "/services/uiux-design" },
    { label: "Branding", href: "/services/branding" },
    { label: "Marketing", href: "/services/digital-marketing" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Blog", href: "/blog" },
    { label: "Work", href: "/work" },
    { label: "Contact", href: "/contact" },
  ],
};
