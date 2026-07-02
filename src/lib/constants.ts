// Magnence OS — Phase 1 constants

export const ROLE_TYPES = [
  "CEO",
  "CFO",
  "CTO",
  "CMO",
  "CHRO",
  "EMPLOYEE",
  "FREELANCER",
  "CLIENT",
  "INTERN",
] as const;

export const ROLE_LABELS: Record<string, string> = {
  CEO: "CEO",
  CFO: "CFO (Chief Financial Officer)",
  CTO: "CTO (Chief Technology Officer)",
  CMO: "CMO (Chief Marketing Officer)",
  CHRO: "CHRO (Chief HR Officer)",
  EMPLOYEE: "Employee",
  FREELANCER: "Freelancer",
  CLIENT: "Client",
  INTERN: "Intern",
};

export const ROLE_STYLES: Record<string, string> = {
  CEO: "bg-red-100 text-red-700",
  CFO: "bg-emerald-100 text-emerald-700",
  CTO: "bg-blue-100 text-blue-700",
  CMO: "bg-violet-100 text-violet-700",
  CHRO: "bg-orange-100 text-orange-700",
  EMPLOYEE: "bg-zinc-100 text-zinc-700",
  FREELANCER: "bg-pink-100 text-pink-700",
  CLIENT: "bg-teal-100 text-teal-700",
  INTERN: "bg-zinc-100 text-zinc-500",
};

// Admin / privileged roles
export const ADMIN_ROLES = ["CEO"];
export const SUPPORT_ROLES = ["CEO", "CHRO"];
export const MANAGER_ROLES = ["CEO", "CFO", "CTO", "CMO", "CHRO"];

// ============ MODULES & PERMISSIONS ============

export const MODULES = [
  "dashboard",
  "ai-center",
  "search",
  "projects",
  "tasks",
  "time",
  "documents",
  "leads",
  "crm",
  "clients",
  "contracts",
  "finance",
  "people",
  "calendar",
  "support",
  "admin",
  "rbac-matrix",
  "settings",
  "cms-blog",
  "cms-case-studies",
];

// ============ PERMISSIONS ============

export const ACTIONS = ["view", "create", "edit", "delete"] as const;

export const MODULE_LABELS: Record<string, string> = {
  "dashboard": "Dashboard",
  "ai-center": "AI Center",
  "search": "Search",
  "projects": "Projects",
  "tasks": "Tasks",
  "time": "Time Tracking",
  "documents": "Documents",
  "leads": "Leads",
  "crm": "CRM",
  "clients": "Clients",
  "contracts": "Contracts",
  "finance": "Finance",
  "people": "People",
  "calendar": "Calendar",
  "support": "Support",
  "admin": "User Management",
  "rbac-matrix": "Roles & Permissions",
  "settings": "Settings",
  "cms-blog": "Blog Posts",
  "cms-case-studies": "Case Studies",
};

export const DEFAULT_PERMISSIONS: Record<string, Record<string, string[]>> = {
  CEO: Object.fromEntries(MODULES.map((m) => ["view", "create", "edit", "delete"])),
  CFO: {
    "dashboard": ["view"], "ai-center": ["view"], "search": ["view"],
    "finance": ["view", "create", "edit"], "contracts": ["view", "create", "edit"],
    "people": ["view"], "settings": ["view"],
  },
  CTO: {
    "dashboard": ["view"], "ai-center": ["view"], "search": ["view"],
    "projects": ["view", "create", "edit"], "tasks": ["view", "create", "edit"],
    "time": ["view", "create", "edit"], "documents": ["view", "create", "edit"],
    "people": ["view"], "settings": ["view"],
  },
  CMO: {
    "dashboard": ["view"], "ai-center": ["view"], "search": ["view"],
    "projects": ["view", "create", "edit"], "tasks": ["view", "create", "edit"],
    "documents": ["view", "create", "edit"], "leads": ["view", "create", "edit"], "crm": ["view", "create", "edit"],
    "clients": ["view", "create", "edit"], "settings": ["view"],
  },
  CHRO: {
    "dashboard": ["view"], "ai-center": ["view"], "search": ["view"],
    "people": ["view", "create", "edit"], "support": ["view", "create", "edit"],
    "settings": ["view"],
  },
  EMPLOYEE: {
    "dashboard": ["view"], "ai-center": ["view"], "search": ["view"],
    "projects": ["view", "create", "edit"], "tasks": ["view", "create", "edit"],
    "time": ["view", "create", "edit"], "documents": ["view", "create", "edit"],
    "settings": ["view"],
  },
  FREELANCER: {
    "dashboard": ["view"], "ai-center": ["view"], "search": ["view"],
    "projects": ["view", "create", "edit"], "tasks": ["view", "create", "edit"],
    "time": ["view", "create", "edit"], "documents": ["view", "create", "edit"],
    "settings": ["view"],
  },
  CLIENT: {
    "dashboard": ["view"], "ai-center": ["view"], "search": ["view"],
    "projects": ["view"], "tasks": ["view"], "support": ["view", "create"],
    "settings": ["view"],
  },
  INTERN: {
    "dashboard": ["view"], "ai-center": ["view"], "search": ["view"],
    "tasks": ["view", "create", "edit"], "documents": ["view"], "settings": ["view"],
  },
};

// ============ NAVIGATION ============

export const NAV_GROUPS: {
  label: string;
  items: { id: string; label: string; icon: string; description: string }[];
}[] = [
  {
    label: "Workspace",
    items: [
      { id: "dashboard", label: "Dashboard", icon: "LayoutDashboard", description: "Overview & project status" },
      { id: "ai-center", label: "AI Center", icon: "Brain", description: "AI Assistant & Knowledge Base" },
      { id: "search", label: "Search", icon: "Search", description: "Find anything" },
    ],
  },
  {
    label: "Projects",
    items: [
      { id: "projects", label: "Projects", icon: "FolderKanban", description: "All client projects" },
      { id: "tasks", label: "Tasks", icon: "CheckSquare", description: "Task management" },
      { id: "time", label: "Time Tracking", icon: "Clock", description: "Track work hours" },
      { id: "documents", label: "Documents", icon: "FolderOpen", description: "Project files & deliverables" },
    ],
  },
  {
    label: "Clients",
    items: [
      { id: "leads", label: "Leads", icon: "Users", description: "Website & bot inquiries" },
      { id: "crm", label: "CRM", icon: "Users", description: "Leads & contacts" },
      { id: "clients", label: "Clients", icon: "HeartHandshake", description: "Active clients" },
      { id: "contracts", label: "Contracts", icon: "FileSignature", description: "Project contracts" },
      { id: "finance", label: "Finance", icon: "DollarSign", description: "Invoices & expenses" },
    ],
  },
  {
    label: "Team",
    items: [
      { id: "people", label: "People", icon: "Users", description: "Team directory" },
      { id: "calendar", label: "Calendar", icon: "Calendar", description: "Deadlines & meetings" },
      { id: "support", label: "Support", icon: "LifeBuoy", description: "Internal helpdesk" },
    ],
  },
  {
    label: "Admin",
    items: [
      { id: "admin", label: "User Management", icon: "UserCog", description: "Create & manage users" },
      { id: "rbac-matrix", label: "Roles & Permissions", icon: "ShieldCheck", description: "Access control" },
      { id: "cms-blog", label: "Blog Posts", icon: "FileText", description: "Manage website blog" },
      { id: "cms-case-studies", label: "Case Studies", icon: "Briefcase", description: "Manage website case studies" },
      { id: "settings", label: "Settings", icon: "Settings", description: "Profile & preferences" },
    ],
  },
];

// ============ AI AGENTS ============

export const AGENT_TYPES = [
  {
    id: "company",
    label: "Company Assistant",
    icon: "Sparkles",
    description: "General company questions",
    color: "#f1c24e",
    suggestedQuestions: [
      "What is the leave policy?",
      "How do I file an expense report?",
      "What are the company working hours?",
    ],
  },
  {
    id: "sop",
    label: "SOP Assistant",
    icon: "ClipboardList",
    description: "Standard Operating Procedures",
    color: "#f1c24e",
    suggestedQuestions: [
      "What is the SOP for onboarding a new client?",
      "How do I raise a purchase order?",
      "What is the procedure for requesting time off?",
    ],
  },
  {
    id: "policy",
    label: "Policy Assistant",
    icon: "Scale",
    description: "Company policies & compliance",
    color: "#f1c24e",
    suggestedQuestions: [
      "What is our remote work policy?",
      "How many sick days am I entitled to?",
      "What is the data privacy policy?",
    ],
  },
  {
    id: "feature",
    label: "Feature Support",
    icon: "Wrench",
    description: "How to use Magnence features",
    color: "#f1c24e",
    suggestedQuestions: [
      "How do I create a task?",
      "How do I track time on a project?",
      "How do I apply for leave?",
    ],
  },
  {
    id: "screen",
    label: "Screen Helper",
    icon: "Eye",
    description: "Explain what's on your screen",
    color: "#f1c24e",
    suggestedQuestions: [
      "I see a yellow chart with numbers, what is this?",
      "There's a list of names on the left, what do I do?",
      "I see a button that says Publish — should I click it?",
    ],
  },
  {
    id: "hr",
    label: "HR Assistant",
    icon: "HeartHandshake",
    description: "HR questions, leave, payroll",
    color: "#f1c24e",
    suggestedQuestions: [
      "When is the next payday?",
      "How do I apply for parental leave?",
      "What benefits am I eligible for as an intern?",
    ],
  },
  {
    id: "productivity",
    label: "Productivity AI",
    icon: "Zap",
    description: "Plan your day, break down tasks, find blockers",
    color: "#f1c24e",
    suggestedQuestions: [
      "What should I work on today?",
      "Break down this task: 'Launch new marketing website'",
      "Show me my overdue tasks",
      "Summarize my team's progress",
    ],
  },
  {
    id: "crm",
    label: "CRM AI",
    icon: "Users",
    description: "Lead scoring, qualification, customer insights",
    color: "#f1c24e",
    suggestedQuestions: [
      "Which leads should I prioritize today?",
      "Score my top 5 leads",
      "Suggest follow-ups for stalled deals",
      "Predict which deals will close this month",
    ],
  },
  {
    id: "sales",
    label: "Sales AI",
    icon: "TrendingUp",
    description: "Proposals, quotes, forecasting, deal coaching",
    color: "#f1c24e",
    suggestedQuestions: [
      "Generate a proposal for Acme Corp",
      "Forecast Q3 revenue",
      "Analyze risk on the Hooli deal",
      "Coach me on handling price objections",
    ],
  },
  {
    id: "finance",
    label: "Finance AI",
    icon: "DollarSign",
    description: "Expense analysis, budgets, cash flow insights",
    color: "#f1c24e",
    suggestedQuestions: [
      "Analyze our expenses this quarter",
      "Suggest budget optimizations",
      "What's our cash flow outlook?",
      "Review overdue invoices",
    ],
  },
  {
    id: "procurement",
    label: "Procurement AI",
    icon: "ShoppingCart",
    description: "Vendor recommendations, cost optimization",
    color: "#f1c24e",
    suggestedQuestions: [
      "Recommend vendors for office supplies",
      "Suggest cost optimizations",
      "Predict demand for next quarter",
      "Compare vendor performance",
    ],
  },
  {
    id: "client",
    label: "Client AI",
    icon: "HeartHandshake",
    description: "Client health, churn prediction, relationship insights",
    color: "#f1c24e",
    suggestedQuestions: [
      "Calculate health score for Acme Corp",
      "Which clients are at risk of churning?",
      "Summarize communication with Hooli",
      "Suggest relationship-building actions",
    ],
  },
  {
    id: "marketing",
    label: "Marketing AI",
    icon: "Megaphone",
    description: "Content generation, SEO, campaign strategy, social media insights",
    color: "#f1c24e",
    suggestedQuestions: [
      "Generate 5 Instagram captions for our product launch",
      "Suggest a content calendar for next month",
      "What are the best posting times for LinkedIn?",
      "Generate ad copy for our summer campaign",
      "Suggest SEO keywords for our SaaS platform",
    ],
  },
  {
    id: "platform",
    label: "Platform AI",
    icon: "Settings",
    description: "System help, integrations, settings guidance",
    color: "#f1c24e",
    suggestedQuestions: [
      "How do I connect Stripe?",
      "How do I create an API key?",
      "What integrations are available?",
      "How do I export my data?",
    ],
  },
  {
    id: "actions",
    label: "AI Actions",
    icon: "Zap",
    description: "Generate emails, reports, summaries",
    color: "#f1c24e",
    suggestedQuestions: [
      "Generate a welcome email for a new client",
      "Summarize this policy: <paste text>",
      "Write a project status report",
    ],
  },
];

export const AI_ACTIONS = [
  "generate_email",
  "generate_report",
  "summarize_document",
  "explain_document",
  "translate_text",
  "rewrite_content",
  "grammar_check",
  "create_task",
  "search_knowledge",
];

// ============ SUPPORT ============

export const TICKET_TYPES = [
  { id: "bug", label: "Bug Report" },
  { id: "feature", label: "Feature Request" },
  { id: "technical", label: "Technical Issue" },
  { id: "account", label: "Account Issue" },
  { id: "access", label: "Access Request" },
  { id: "security", label: "Security Report" },
  { id: "feedback", label: "Feedback" },
  { id: "complaint", label: "Complaint" },
  { id: "general", label: "General Query" },
];

export const TICKET_STATUSES = [
  "new",
  "open",
  "assigned",
  "in_progress",
  "waiting",
  "escalated",
  "resolved",
  "closed",
];

export const TICKET_PRIORITIES = ["low", "medium", "high", "urgent"];

// ============ KNOWLEDGE BASE ============

export const KB_CATEGORIES = [
  { id: "sop", label: "SOPs" },
  { id: "policy", label: "Policies" },
  { id: "hr", label: "HR Documents" },
  { id: "technical", label: "Technical Documents" },
  { id: "marketing", label: "Marketing Documents" },
  { id: "sales", label: "Sales Documents" },
  { id: "finance", label: "Finance Documents" },
  { id: "legal", label: "Legal Documents" },
  { id: "training", label: "Training Material" },
  { id: "faq", label: "FAQs" },
];

export const KB_STATUSES = ["draft", "pending_review", "published", "archived"];

// ============ SOCIAL ============

export const SOCIAL_PLATFORMS = [
  "instagram",
  "twitter",
  "linkedin",
  "facebook",
  "youtube",
  "tiktok",
];

export const SOCIAL_PLATFORM_META: Record<
  string,
  { label: string; color: string; icon: string }
> = {
  instagram: { label: "Instagram", color: "#E1306C", icon: "Instagram" },
  twitter: { label: "X / Twitter", color: "#0f1419", icon: "Twitter" },
  linkedin: { label: "LinkedIn", color: "#0A66C2", icon: "Linkedin" },
  facebook: { label: "Facebook", color: "#1877F2", icon: "Facebook" },
  youtube: { label: "YouTube", color: "#FF0000", icon: "Youtube" },
  tiktok: { label: "TikTok", color: "#010101", icon: "Music2" },
};

// ============ SALES ============

export const LEAD_STAGES = [
  "new",
  "contacted",
  "qualified",
  "proposal",
  "negotiation",
  "won",
  "lost",
];

// ============ MARKETING ============

export const CAMPAIGN_CHANNELS = ["email", "social", "ads", "event", "content"];
export const CAMPAIGN_STATUSES = ["planned", "active", "paused", "completed"];

// ============ ANNOUNCEMENTS ============

export const ANNOUNCEMENT_CATEGORIES = [
  { id: "company", label: "Company News" },
  { id: "department", label: "Department" },
  { id: "hr", label: "HR Update" },
  { id: "holiday", label: "Holiday" },
  { id: "event", label: "Event" },
  { id: "maintenance", label: "Maintenance" },
  { id: "emergency", label: "Emergency" },
];

// ============ CALENDAR ============

export const EVENT_TYPES = [
  { id: "meeting", label: "Meeting", color: "#0891b2" },
  { id: "holiday", label: "Holiday", color: "#dc2626" },
  { id: "company_event", label: "Company Event", color: "#7c3aed" },
  { id: "birthday", label: "Birthday", color: "#ea580c" },
  { id: "anniversary", label: "Work Anniversary", color: "#16a34a" },
  { id: "deadline", label: "Deadline", color: "#c79a2e" },
];

export const RECURRENCE_OPTIONS = ["none", "daily", "weekly", "monthly", "yearly"];

// ============ NOTIFICATIONS ============

export const NOTIF_TYPES = [
  { id: "ticket", label: "Support Tickets" },
  { id: "announcement", label: "Announcements" },
  { id: "assignment", label: "Assignments" },
  { id: "approval", label: "Approvals" },
  { id: "mention", label: "Mentions" },
  { id: "ai", label: "AI Notifications" },
  { id: "system", label: "System" },
];

// ============ TASKS ============

export const TASK_STATUSES = [
  { id: "todo", label: "To Do", color: "#52525b" },
  { id: "in_progress", label: "In Progress", color: "#0891b2" },
  { id: "review", label: "Review", color: "#7c3aed" },
  { id: "qa", label: "QA", color: "#c79a2e" },
  { id: "approved", label: "Approved", color: "#16a34a" },
  { id: "completed", label: "Completed", color: "#16a34a" },
  { id: "cancelled", label: "Cancelled", color: "#dc2626" },
  { id: "reopened", label: "Reopened", color: "#ea580c" },
];

export const TASK_PRIORITIES = [
  { id: "low", label: "Low", color: "#52525b" },
  { id: "medium", label: "Medium", color: "#0891b2" },
  { id: "high", label: "High", color: "#ea580c" },
  { id: "urgent", label: "Urgent", color: "#dc2626" },
];

// ============ LEAVE ============

export const LEAVE_TYPES = [
  { id: "casual", label: "Casual Leave", color: "#0891b2" },
  { id: "sick", label: "Sick Leave", color: "#dc2626" },
  { id: "earned", label: "Earned Leave", color: "#16a34a" },
  { id: "wfh", label: "Work From Home", color: "#7c3aed" },
  { id: "comp", label: "Compensatory Leave", color: "#ea580c" },
  { id: "maternity", label: "Maternity Leave", color: "#c026d3" },
  { id: "paternity", label: "Paternity Leave", color: "#2563eb" },
  { id: "unpaid", label: "Unpaid Leave", color: "#52525b" },
];

// ============ PROJECTS ============

export const PROJECT_STATUSES = [
  { id: "planning", label: "Planning", color: "#52525b" },
  { id: "active", label: "Active", color: "#16a34a" },
  { id: "on_hold", label: "On Hold", color: "#ea580c" },
  { id: "completed", label: "Completed", color: "#0891b2" },
  { id: "cancelled", label: "Cancelled", color: "#dc2626" },
];

export const PROJECT_CATEGORIES = [
  { id: "internal", label: "Internal Project" },
  { id: "client", label: "Client Project" },
];

// ============ FORMS ============

export const FORM_CATEGORIES = [
  { id: "leave", label: "Leave Form" },
  { id: "expense", label: "Expense Form" },
  { id: "asset", label: "Asset Request" },
  { id: "access", label: "Access Request" },
  { id: "travel", label: "Travel Request" },
  { id: "purchase", label: "Purchase Request" },
  { id: "custom", label: "Custom Form" },
];

// ============ ASSETS ============

export const ASSET_TYPES = [
  { id: "laptop", label: "Laptop" },
  { id: "monitor", label: "Monitor" },
  { id: "phone", label: "Phone" },
  { id: "keyboard", label: "Keyboard" },
  { id: "chair", label: "Chair" },
  { id: "other", label: "Other" },
];

// ============ GOALS ============

export const GOAL_TYPES = [
  { id: "individual", label: "Individual Goal" },
  { id: "team", label: "Team Goal" },
  { id: "department", label: "Department Goal" },
  { id: "company", label: "Company Goal" },
];
