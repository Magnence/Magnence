export interface SubService {
  title: string;
  icon: string;
  description: string;
  useCases: string[];
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  icon: string;
  tagline: string;
  description: string;
  subServices: SubService[];
  techStack: string[];
  useCases: { industry: string; cases: string[] }[];
  heroGradient: string;
}

export const SERVICES: Service[] = [
  {
    id: "ai",
    title: "Artificial Intelligence",
    slug: "artificial-intelligence",
    icon: "Bot",
    tagline: "AI agents, RAG systems, LLM integrations, and enterprise AI assistants",
    description:
      "We design and deploy production-grade AI systems — from autonomous agents and retrieval-augmented generation pipelines to bespoke LLM integrations that fit your business like a glove.",
    subServices: [
      { title: "AI Agents", icon: "Bot", description: "Autonomous goal-driven agents that plan, call tools, and execute multi-step business workflows.", useCases: ["Lead qualification & scheduling", "Support triage", "Internal research agents"] },
      { title: "Enterprise AI Assistants", icon: "MessageSquare", description: "Domain-tuned chat assistants wired to your knowledge base, policies, and systems of record.", useCases: ["Employee helpdesk", "Sales copilot", "Ops assistant"] },
      { title: "Retrieval-Augmented Generation (RAG)", icon: "Database", description: "Hybrid vector + keyword retrieval pipelines with reranking and citation for grounded answers.", useCases: ["Document Q&A", "Policy search", "Codebase assistant"] },
      { title: "Custom LLM Integrations", icon: "Code2", description: "Fine-tuned, prompt-tuned, or function-calling LLM workflows integrated directly into your stack.", useCases: ["Content generation", "Data extraction", "Classification"] },
      { title: "AI Automation", icon: "Workflow", description: "Replace repetitive cognitive work with reliable, observable AI pipelines.", useCases: ["Email triage", "Invoice processing", "Report drafting"] },
      { title: "AI Workflow Design", icon: "GitBranch", description: "End-to-end design of human-in-the-loop AI workflows with evals and observability.", useCases: ["Compliance review", "Content approval", "Customer onboarding"] },
      { title: "Prompt Engineering", icon: "Terminal", description: "Systematic prompt design, evaluation harnesses, and prompt management infrastructure.", useCases: ["Prompt libraries", "Eval suites", "Version control"] },
      { title: "AI Consulting", icon: "Lightbulb", description: "Strategy, roadmap, vendor selection, and feasibility assessments for AI initiatives.", useCases: ["AI readiness audit", "Roadmap workshop", "Build vs. buy analysis"] },
    ],
    techStack: ["OpenAI", "Anthropic", "LangChain", "LlamaIndex", "Hugging Face", "FastAPI", "Python", "Pinecone", "Weaviate", "AWS Bedrock"],
    useCases: [
      { industry: "Healthcare", cases: ["Clinical document Q&A", "Triage assistants", "Claims summarization"] },
      { industry: "Finance", cases: ["KYC automation", "Risk scoring", "Investment research agents"] },
      { industry: "Retail", cases: ["Product recommendations", "Review summarization", "Inventory forecasting"] },
      { industry: "Logistics", cases: ["Route optimization", "Shipment anomaly detection", "Carrier negotiation copilot"] },
      { industry: "Education", cases: ["Tutoring assistants", "Curriculum generation", "Plagiarism detection"] },
    ],
    heroGradient: "radial-gradient(ellipse at 50% 0%, rgba(251,198,7,0.45) 0%, transparent 60%)",
  },
  {
    id: "software",
    title: "Software Development",
    slug: "software-development",
    icon: "Code2",
    tagline: "Custom web apps, SaaS platforms, ERP, CRM, and enterprise systems",
    description:
      "Custom software built for scale — from SaaS platforms and internal tools to enterprise ERP and CRM systems. Architectured right, shipped on time, and engineered to evolve.",
    subServices: [
      { title: "Custom Web Applications", icon: "Globe", description: "Bespoke web apps architected for your exact business logic and user workflows.", useCases: ["Operations dashboards", "Customer portals", "Internal tools"] },
      { title: "Enterprise Software", icon: "Building2", description: "Large-scale systems with multi-tenancy, RBAC, audit trails, and compliance baked in.", useCases: ["ERP", "CRM", "HRMS", "Procurement"] },
      { title: "SaaS Platforms", icon: "Layers", description: "Multi-tenant SaaS with billing, onboarding, analytics, and team management.", useCases: ["Vertical SaaS", "Internal productization", "Marketplace SaaS"] },
      { title: "CRM Systems", icon: "Users", description: "Custom CRMs tailored to your sales process, pipeline, and customer lifecycle.", useCases: ["Sales CRM", "Customer success", "Partner management"] },
      { title: "ERP Systems", icon: "Boxes", description: "Unified ERP connecting finance, inventory, HR, procurement, and operations.", useCases: ["Manufacturing ERP", "Retail ERP", "Services ERP"] },
      { title: "Internal Platforms", icon: "Server", description: "Operator-grade internal tools that replace spreadsheets and siloed systems.", useCases: ["Ops dashboards", "Approval workflows", "Reporting"] },
      { title: "Business Portals", icon: "LayoutDashboard", description: "Self-service portals for customers, vendors, partners, and employees.", useCases: ["Vendor portal", "Customer portal", "Partner portal"] },
      { title: "API Development", icon: "Webhook", description: "REST and GraphQL APIs with auth, rate-limiting, versioning, and SDK generation.", useCases: ["Public APIs", "Internal APIs", "Partner integrations"] },
    ],
    techStack: ["Next.js", "React", "Node.js", "FastAPI", "Django", "PostgreSQL", "MongoDB", "Redis", "Docker", "Kubernetes"],
    useCases: [
      { industry: "Startup", cases: ["MVP builds", "Investor demos", "Launch-ready SaaS"] },
      { industry: "SMB", cases: ["Custom CRM", "Inventory system", "Booking platform"] },
      { industry: "Enterprise", cases: ["Multi-region ERP", "Internal platform", "Legacy modernization"] },
    ],
    heroGradient: "radial-gradient(ellipse at 50% 0%, rgba(245,158,11,0.35) 0%, transparent 60%)",
  },
  {
    id: "web-mobile",
    title: "Web & Mobile",
    slug: "web-mobile",
    icon: "Smartphone",
    tagline: "Responsive websites, PWAs, mobile apps, and admin dashboards",
    description:
      "Beautiful, fast, accessible web and mobile experiences — built mobile-first, optimized for Core Web Vitals, and shipped with clean component systems.",
    subServices: [
      { title: "Responsive Websites", icon: "Monitor", description: "Marketing sites, landing pages, and corporate websites built for conversion.", useCases: ["Corporate site", "Product launch", "Marketing campaign"] },
      { title: "Progressive Web Apps", icon: "Smartphone", description: "Installable, offline-capable PWAs with push notifications and native-like UX.", useCases: ["Field tools", "Customer apps", "Internal apps"] },
      { title: "Mobile Apps", icon: "Phone", description: "Native and cross-platform mobile apps for iOS and Android.", useCases: ["Consumer apps", "Field force apps", "Companion apps"] },
      { title: "Customer Portals", icon: "Users", description: "Secure self-service portals for customers, vendors, and partners.", useCases: ["Account portal", "Order tracking", "Support portal"] },
      { title: "Admin Dashboards", icon: "LayoutDashboard", description: "Operator dashboards with tables, charts, filters, and bulk actions.", useCases: ["Ops dashboard", "Analytics dashboard", "Reporting"] },
      { title: "E-commerce", icon: "ShoppingCart", description: "Headless commerce with custom checkout, subscriptions, and B2B catalogs.", useCases: ["D2C store", "B2B catalog", "Subscription box"] },
    ],
    techStack: ["Next.js", "React Native", "Expo", "TailwindCSS", "Stripe", "Shopify", "Vercel", "Sentry"],
    useCases: [
      { industry: "Retail", cases: ["D2C store", "Loyalty app", "B2B catalog"] },
      { industry: "Logistics", cases: ["Driver app", "Tracking portal", "Dispatcher dashboard"] },
      { industry: "Healthcare", cases: ["Patient portal", "Telehealth app", "Provider dashboard"] },
    ],
    heroGradient: "radial-gradient(ellipse at 50% 0%, rgba(251,198,7,0.35) 0%, transparent 60%)",
  },
  {
    id: "automation",
    title: "Automation",
    slug: "automation",
    icon: "Workflow",
    tagline: "Business process, CRM, HR, finance, and document automation",
    description:
      "Replace repetitive work with reliable, observable automations. We integrate your stack, design workflows with human checkpoints, and instrument everything for monitoring.",
    subServices: [
      { title: "Business Process Automation", icon: "Workflow", description: "End-to-end automation of operational workflows with audit trails.", useCases: ["Order processing", "Approval flows", "Onboarding"] },
      { title: "Workflow Automation", icon: "GitBranch", description: "Multi-step workflows with branching, retries, and human-in-the-loop steps.", useCases: ["Document review", "Lead routing", "Compliance checks"] },
      { title: "CRM Automation", icon: "Users", description: "Lead scoring, nurture sequences, deal updates, and CRM hygiene automations.", useCases: ["Lead routing", "Follow-up sequences", "Win-back campaigns"] },
      { title: "Marketing Automation", icon: "Megaphone", description: "Lifecycle marketing, segmentation, and trigger-based campaigns.", useCases: ["Welcome series", "Re-engagement", "Behaviour triggers"] },
      { title: "HR Automation", icon: "UserCog", description: "Onboarding, leave, payroll prep, and performance review automations.", useCases: ["Onboarding flows", "Leave approval", "Review cycles"] },
      { title: "Finance Automation", icon: "DollarSign", description: "Invoice processing, expense approvals, and reconciliation workflows.", useCases: ["AP automation", "Expense approvals", "Reconciliation"] },
      { title: "Document Automation", icon: "FileText", description: "Generate, route, e-sign, and archive documents at scale.", useCases: ["Contracts", "Invoices", "Offer letters"] },
      { title: "Integration Automation", icon: "Webhook", description: "Connect SaaS tools, legacy systems, and internal APIs into a cohesive stack.", useCases: ["iPaaS builds", "Webhook orchestration", "ETL pipelines"] },
    ],
    techStack: ["n8n", "Zapier", "Make", "Temporal", "Inngest", "BullMQ", "PostgreSQL", "Redis"],
    useCases: [
      { industry: "Finance", cases: ["AP automation", "Reconciliation", "Compliance reporting"] },
      { industry: "Healthcare", cases: ["Claims processing", "Patient onboarding", "Records routing"] },
      { industry: "Retail", cases: ["Order routing", "Inventory sync", "Returns processing"] },
    ],
    heroGradient: "radial-gradient(ellipse at 50% 0%, rgba(245,158,11,0.35) 0%, transparent 60%)",
  },
  {
    id: "uiux",
    title: "UI/UX Design",
    slug: "uiux-design",
    icon: "Palette",
    tagline: "Product strategy, UX research, interface design, and design systems",
    description:
      "We design products people love to use — grounded in research, prototyped early, and shipped as reusable design systems that scale with your product.",
    subServices: [
      { title: "Product Strategy", icon: "Target", description: "Define the right product to build — market research, jobs-to-be-done, and roadmap.", useCases: ["Product discovery", "Feature prioritization", "Roadmap"] },
      { title: "UX Design", icon: "MousePointerClick", description: "Information architecture, user flows, wireframes, and usability testing.", useCases: ["Flow design", "Wireframes", "Usability testing"] },
      { title: "UI Design", icon: "Palette", description: "High-fidelity interface design with accessibility, motion, and polish.", useCases: ["App design", "Web design", "Dashboard design"] },
      { title: "Design Systems", icon: "Component", description: "Token-driven, componentized design systems with docs and governance.", useCases: ["Component library", "Design tokens", "Documentation"] },
      { title: "Prototyping", icon: "Frame", description: "Interactive prototypes for testing and stakeholder alignment.", useCases: ["Concept testing", "Stakeholder demos", "Investor pitches"] },
      { title: "User Research", icon: "Search", description: "Interviews, surveys, and usability studies that surface real user needs.", useCases: ["Discovery research", "Usability testing", "Segmentation"] },
      { title: "Wireframing", icon: "PenTool", description: "Low-fidelity layouts to align structure before high-fidelity design.", useCases: ["Layout exploration", "Information architecture", "Stakeholder review"] },
    ],
    techStack: ["Figma", "Framer", "Storybook", "Radix UI", "shadcn/ui", "TailwindCSS", "Maze"],
    useCases: [
      { industry: "SaaS", cases: ["Dashboard redesign", "Onboarding flow", "Design system"] },
      { industry: "Consumer", cases: ["Mobile app design", "Onboarding", "Loyalty experience"] },
      { industry: "Enterprise", cases: ["Operator tools", "Design system", "Compliance UX"] },
    ],
    heroGradient: "radial-gradient(ellipse at 50% 0%, rgba(251,198,7,0.35) 0%, transparent 60%)",
  },
  {
    id: "branding",
    title: "Branding & Creative",
    slug: "branding",
    icon: "Brush",
    tagline: "Brand identity, logo design, motion graphics, and visual content",
    description:
      "Distinctive brands and creative systems — from identity and logo design to motion graphics, presentation design, and a full in-house team for video editing, 3D modeling, and rendering.",
    subServices: [
      { title: "Brand Identity", icon: "Sparkles", description: "Naming, positioning, voice, and full visual identity systems.", useCases: ["Startup identity", "Rebrand", "Sub-brand"] },
      { title: "Logo Design", icon: "PenTool", description: "Distinctive, scalable logo systems with usage guidelines.", useCases: ["Wordmark", "Monogram", "Logo system"] },
      { title: "Brand Guidelines", icon: "BookOpen", description: "Comprehensive brand books covering logo, color, type, voice, and usage.", useCases: ["Brand book", "Voice guide", "Asset library"] },
      { title: "Marketing Assets", icon: "Image", description: "Campaign-ready visual assets for digital and print.", useCases: ["Campaign creative", "Social assets", "Print collateral"] },
      { title: "Presentation Design", icon: "Presentation", description: "Investor decks, sales decks, and keynote presentations that convert.", useCases: ["Pitch deck", "Sales deck", "Keynote"] },
      { title: "Motion Graphics", icon: "Film", description: "Logo animations, explainer animations, and product motion design.", useCases: ["Logo animation", "Explainer", "Product demo"] },
      { title: "Visual Content", icon: "Brush", description: "Social-ready creative, illustrations, and editorial design.", useCases: ["Social creative", "Illustrations", "Editorial"] },
      { title: "Video Editing", icon: "Video", description: "Professional post-production for reels, ads, and explainers.", useCases: ["Reels", "Ads", "Explainer videos"] },
      { title: "3D Modeling & Rendering", icon: "Box", description: "Product visualization, architectural renders, and 3D assets.", useCases: ["Product renders", "Architectural", "Configurators"] },
    ],
    techStack: ["Figma", "After Effects", "Premiere Pro", "Cinema 4D", "Blender", "Photoshop", "Illustrator"],
    useCases: [
      { industry: "Startup", cases: ["Identity & deck", "Pitch creative", "Product renders"] },
      { industry: "Retail", cases: ["Packaging", "Campaign creative", "Product visualization"] },
      { industry: "Real Estate", cases: ["Architectural renders", "Brochure", "Walkthrough"] },
    ],
    heroGradient: "radial-gradient(ellipse at 50% 0%, rgba(224,123,58,0.3) 0%, transparent 60%)",
  },
  {
    id: "marketing",
    title: "Digital Marketing",
    slug: "digital-marketing",
    icon: "Megaphone",
    tagline: "SEO, social media, performance marketing, and analytics",
    description:
      "Full-funnel digital marketing — from technical SEO and content strategy to paid acquisition, social, and analytics. We grow revenue, not just traffic.",
    subServices: [
      { title: "Search Engine Optimization", icon: "Search", description: "Technical, on-page, and content SEO with measurable rankings growth.", useCases: ["Technical audit", "Content strategy", "Link building"] },
      { title: "Social Media Management", icon: "Share2", description: "Platform-native content, community management, and growth.", useCases: ["LinkedIn", "Instagram", "YouTube"] },
      { title: "Performance Marketing", icon: "TrendingUp", description: "Paid search, paid social, and retargeting managed to ROAS targets.", useCases: ["Google Ads", "Meta Ads", "LinkedIn Ads"] },
      { title: "Content Marketing", icon: "FileText", description: "Editorial strategy, production, and distribution for thought leadership.", useCases: ["Blog", "Newsletter", "Long-form content"] },
      { title: "Email Marketing", icon: "Mail", description: "Lifecycle email, automation, and CRM-driven nurture sequences.", useCases: ["Welcome series", "Nurture", "Win-back"] },
      { title: "Analytics & Reporting", icon: "BarChart3", description: "GA4, attribution, dashboards, and weekly insights.", useCases: ["GA4 setup", "Attribution", "Dashboards"] },
    ],
    techStack: ["GA4", "Google Ads", "Meta Ads", "HubSpot", "Ahrefs", "SEMrush", "Mailchimp", "Klaviyo"],
    useCases: [
      { industry: "SaaS", cases: ["PLG funnel", "LinkedIn ABM", "Content engine"] },
      { industry: "E-commerce", cases: ["Shopping ads", "Email lifecycle", "Influencer"] },
      { industry: "Local", cases: ["Local SEO", "Google Business", "Reputation"] },
    ],
    heroGradient: "radial-gradient(ellipse at 50% 0%, rgba(251,198,7,0.35) 0%, transparent 60%)",
  },
  {
    id: "video",
    title: "Video Editing",
    slug: "branding",
    icon: "Video",
    tagline: "Professional post-production, reels, ads, explainer videos",
    description:
      "Our in-house video team handles everything from short-form reels to long-form explainers, brand films, and ad creative — scripted, edited, color-graded, and delivered platform-ready.",
    subServices: [
      { title: "Short-form Reels", icon: "Smartphone", description: "Vertical-first reels for Instagram, TikTok, and YouTube Shorts.", useCases: ["Brand reels", "Product reels", "Founder content"] },
      { title: "Ad Creative", icon: "Megaphone", description: "Performance-ready ad creative with hooks, CTAs, and variants.", useCases: ["Meta ads", "YouTube ads", "LinkedIn ads"] },
      { title: "Explainer Videos", icon: "Lightbulb", description: "Animated and live-action explainers that simplify complex products.", useCases: ["Product explainers", "How-to videos", "Onboarding"] },
      { title: "Brand Films", icon: "Film", description: "Cinematic brand stories for homepage, decks, and events.", useCases: ["Brand story", "Culture film", "Investor film"] },
      { title: "Color Grading", icon: "Droplet", description: "Cinematic color grading and audio mixing for premium finish.", useCases: ["Film grade", "Ad grade", "Series grade"] },
      { title: "Subtitling & Captioning", icon: "Captions", description: "Burned-in and SRT captions for accessibility and silent autoplay.", useCases: ["Multi-language", "Burned captions", "SRT delivery"] },
    ],
    techStack: ["Premiere Pro", "After Effects", "DaVinci Resolve", "Final Cut Pro", "Audition"],
    useCases: [
      { industry: "Startup", cases: ["Founder reels", "Product demo", "Pitch film"] },
      { industry: "E-commerce", cases: ["Product reels", "Ad variants", "UGC edits"] },
      { industry: "B2B", cases: ["Explainer", "Customer stories", "Webinar edits"] },
    ],
    heroGradient: "radial-gradient(ellipse at 50% 0%, rgba(224,123,58,0.3) 0%, transparent 60%)",
  },
  {
    id: "rendering",
    title: "3D & Rendering",
    slug: "branding",
    icon: "Box",
    tagline: "3D modeling, architectural renders, product visualization",
    description:
      "Photoreal 3D modeling, architectural renders, and product visualization — from concept to final render, with dedicated artists for every discipline under one roof.",
    subServices: [
      { title: "3D Modeling", icon: "Box", description: "Hard-surface and organic 3D models optimized for render or real-time use.", useCases: ["Product models", "Environment", "Props"] },
      { title: "Architectural Rendering", icon: "Building2", description: "Photoreal interior and exterior renders for real estate and architecture.", useCases: ["Exterior renders", "Interior renders", "Walkthroughs"] },
      { title: "Product Visualization", icon: "Package", description: "Studio and lifestyle product renders for e-commerce and marketing.", useCases: ["Hero shots", "Lifestyle", "360 spins"] },
      { title: "3D Animation", icon: "Film", description: "Animated 3D sequences for explainers, configurators, and ads.", useCases: ["Explainer animation", "Configurator", "Logo animation"] },
      { title: "Concept Art", icon: "Brush", description: "Mood boards, concept frames, and look development.", useCases: ["Look dev", "Mood boards", "Concept frames"] },
      { title: "AR/3D Web", icon: "Smartphone", description: "WebGL and AR-ready 3D experiences for browsers and devices.", useCases: ["3D configurator", "AR try-on", "Web viewer"] },
    ],
    techStack: ["Blender", "Cinema 4D", "Octane", "V-Ray", "Substance Painter", "Unreal Engine", "Three.js"],
    useCases: [
      { industry: "Real Estate", cases: ["Exterior renders", "Interior renders", "Walkthroughs"] },
      { industry: "Product", cases: ["Hero renders", "360 spins", "Exploded views"] },
      { industry: "Marketing", cases: ["3D ads", "Logo animation", "Configurator"] },
    ],
    heroGradient: "radial-gradient(ellipse at 50% 0%, rgba(251,198,7,0.35) 0%, transparent 60%)",
  },
];

export const SERVICE_OVERVIEW_CARDS = [
  { icon: "Bot", name: "Artificial Intelligence", description: "AI agents, RAG systems, LLM integrations, and enterprise AI assistants", slug: "artificial-intelligence" },
  { icon: "Code2", name: "Software Development", description: "Custom web apps, SaaS platforms, ERP, CRM, and enterprise systems", slug: "software-development" },
  { icon: "Smartphone", name: "Web & Mobile", description: "Responsive websites, PWAs, mobile apps, and admin dashboards", slug: "web-mobile" },
  { icon: "Workflow", name: "Automation", description: "Business process, CRM, HR, finance, and document automation", slug: "automation" },
  { icon: "Palette", name: "UI/UX Design", description: "Product strategy, UX research, interface design, and design systems", slug: "uiux-design" },
  { icon: "Megaphone", name: "Digital Marketing", description: "SEO, social media, performance marketing, and analytics", slug: "digital-marketing" },
  { icon: "Brush", name: "Branding & Creative", description: "Brand identity, logo design, motion graphics, and visual content", slug: "branding" },
  { icon: "Video", name: "Video Editing", description: "Professional post-production, reels, ads, explainer videos", slug: "branding" },
  { icon: "Box", name: "3D & Rendering", description: "3D modeling, architectural renders, product visualization", slug: "branding" },
];
