import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { DEFAULT_PERMISSIONS, ROLE_TYPES } from "@/lib/constants";

export const runtime = "nodejs";

interface SeedUser {
  name: string;
  email: string;
  role: string;
  department: string;
  title: string;
  avatarColor: string;
}

const USERS: SeedUser[] = [
  { name: "Anurag Singh", email: "anurag@magnence.com", role: "CEO", department: "Leadership", title: "CEO & Founder", avatarColor: "#f1c24e" },
];

const DEPARTMENTS = [
  { name: "Leadership", description: "Executive leadership team" },
  { name: "Human Resources", description: "People & culture" },
  { name: "Engineering", description: "Product development" },
  { name: "Sales", description: "Revenue & growth" },
  { name: "Marketing", description: "Brand & demand generation" },
  { name: "Support", description: "Customer success & helpdesk" },
  { name: "Finance", description: "Accounting & finance" },
  { name: "Operations", description: "Day-to-day operations" },
  { name: "Design", description: "Brand & product design" },
];

const TEAMS = [
  { name: "Product Engineering", departmentName: "Engineering" },
  { name: "AI & ML", departmentName: "Engineering" },
  { name: "Inside Sales", departmentName: "Sales" },
  { name: "Field Sales", departmentName: "Sales" },
  { name: "Content & Social", departmentName: "Marketing" },
  { name: "L1 Support", departmentName: "Support" },
  { name: "L2 Support", departmentName: "Support" },
  { name: "Brand Design", departmentName: "Design" },
];

const DESIGNATIONS = [
  { name: "Intern", level: 1 },
  { name: "Junior Associate", level: 2 },
  { name: "Associate", level: 3 },
  { name: "Senior Associate", level: 4 },
  { name: "Lead", level: 5 },
  { name: "Manager", level: 6 },
  { name: "Senior Manager", level: 7 },
  { name: "Director", level: 8 },
  { name: "VP", level: 9 },
  { name: "C-Level", level: 10 },
];

const OFFICES = [
  { name: "Bangalore HQ", address: "MG Road, Bangalore", city: "Bangalore", country: "India", timezone: "Asia/Kolkata", workStart: "09:00", workEnd: "18:00", workDays: "mon,tue,wed,thu,fri", remote: false, hybrid: true },
  { name: "Mumbai Office", address: "BKC, Mumbai", city: "Mumbai", country: "India", timezone: "Asia/Kolkata", workStart: "09:30", workEnd: "18:30", workDays: "mon,tue,wed,thu,fri", remote: false, hybrid: true },
  { name: "Remote - Global", address: "Remote", city: "Various", country: "Global", timezone: "UTC", workStart: "flexible", workEnd: "flexible", workDays: "mon,tue,wed,thu,fri", remote: true, hybrid: false },
];

const KB_ARTICLES = [
  { title: "Client Onboarding SOP", category: "sop", department: "Operations", content: "Step-by-step procedure to onboard a new client:\n\n1. Welcome email within 1 business day\n2. Schedule kickoff call within 3 business days\n3. Create project workspace in Magnence > Documents\n4. Assign account manager from Sales\n5. Send brand questionnaire to client\n6. Contract signing via Finance\n7. Internal handover meeting\n8. Set up recurring check-ins (weekly)\n\nTools used: Magnence CRM, Documents, Calendar, Announcements", status: "published", version: 1 },
  { title: "Expense Reimbursement SOP", category: "sop", department: "Finance", content: "How to file expenses:\n1. Collect all receipts (PDF or JPG)\n2. Raise a ticket in Support > New Ticket > Billing\n3. Attach receipts\n4. Submit within 30 days of expense\n5. Finance approves within 5 business days\n6. Reimbursement in next payroll cycle\n\nLimit: $500/day without pre-approval", status: "published", version: 2 },
  { title: "Remote Work Policy", category: "policy", department: "CHRO", content: "Remote work policy:\n- Employees may work remotely up to 3 days/week with manager approval\n- Freelancers and contractors are fully remote\n- Core hours: 10am to 4pm local time\n- Must be available on Magnence chat during core hours\n- Manager may require in-office days for team events\n- Remote work allowance: $50/month for internet\n\nFor full policy, contact HR.", status: "published", version: 1 },
  { title: "Leave & Time Off Policy", category: "policy", department: "CHRO", content: "Leave entitlements:\n- Sick leave: 12 days/year\n- Vacation: 20 days/year (employees), 5 days (interns)\n- Casual leave: 5 days/year\n- Parental leave: 12 weeks (paid)\n- Bereavement: 3 days\n\nApply via Support > New Ticket > HR. Manager approval required for >2 consecutive days.", status: "published", version: 3 },
  { title: "Data Privacy Policy", category: "policy", department: "Legal", content: "All customer data is stored encrypted at rest and in transit.\n- Access is role-based via Magnence permissions\n- Report any data incident within 24h to security@magnence.com\n- GDPR & DPDP 2023 compliant\n- Annual security audit by third party\n- Customer data retention: 7 years after contract end", status: "published", version: 1 },
  { title: "Social Media Posting Guide", category: "marketing", department: "Marketing", content: "Brand voice: warm, professional, helpful.\nHashtags: #Magnence #OneApp #UnifiedWorkspace\nPosting cadence: 1 post/day per platform\n- Instagram: visual content, behind-the-scenes\n- LinkedIn: thought leadership, company news\n- Twitter: tips, customer love, product updates\n- TikTok: trend-aware, behind-the-scenes\n\nAll posts must be approved by Marketing Manager before publishing.", status: "published", version: 1 },
  { title: "Code of Conduct", category: "policy", department: "CHRO", content: "All Magnence team members must:\n- Treat colleagues, clients, and partners with respect\n- Maintain confidentiality of company and client information\n- Avoid conflicts of interest\n- Report violations to HR confidentially\n- Zero tolerance for harassment, discrimination, or bullying\n\nViolations may result in disciplinary action up to termination.", status: "published", version: 2 },
  { title: "How to use Magnence AI Assistants", category: "training", department: "Operations", content: "Open AI Assistant from the left menu. Pick an agent:\n- Company Assistant: general questions\n- SOP Assistant: standard operating procedures\n- Policy Assistant: company policies\n- Feature Support: how to use Magnence\n- Screen Helper: explain what's on screen\n- HR Assistant: leave, payroll, benefits\n- AI Actions: generate emails, reports, summaries\n\nType your question. The agent answers in plain English.", status: "published", version: 1 },
  { title: "Brand Guidelines", category: "marketing", department: "Marketing", content: "Magnence brand:\n- Primary color: #f1c24e (Magnence Gold)\n- Background: white (#FFFFFF)\n- Text: black (#0A0A0A)\n- Logo: Magnence wordmark with gold M\n- Tone: confident, warm, clear\n- Typography: Geist Sans (Latin) + system fallback\n\nAlways use brand assets from the Documents > Brand folder.", status: "published", version: 1 },
  { title: "Salary Disbursement Process", category: "finance", department: "Finance", content: "Payroll cycle:\n- Payday: last working day of each month\n- Timesheets due: 25th of each month\n- Manager approval: 27th\n- Finance processing: 28-30\n- Direct deposit to bank account on file\n\nFor payroll issues, raise a ticket in Support > Finance.", status: "published", version: 1 },
  { title: "Employee Handbook FAQ", category: "faq", department: "CHRO", content: "Frequently asked questions:\n\nQ: How do I reset my password?\nA: Click 'Forgot password' on the login page.\n\nQ: How do I update my profile?\nA: Settings > Profile.\n\nQ: How do I apply for leave?\nA: Support > New Ticket > HR > Leave.\n\nQ: Where are company policies?\nA: Knowledge Base > Policies.\n\nQ: How do I contact IT support?\nA: Support > New Ticket > Technical.", status: "published", version: 1 },
  { title: "Security Best Practices", category: "technical", department: "Engineering", content: "All employees must:\n- Use a strong, unique password\n- Enable MFA when available\n- Lock screen when away\n- Report phishing emails to security@magnence.com\n- Never share login credentials\n- Use company VPN for remote admin access\n- Keep software updated\n\nSecurity training is mandatory annually.", status: "published", version: 2 },
];

const CAMPAIGNS = [
  { name: "Summer Launch 2025", channel: "social", status: "active", budget: 15000, spent: 8200, leads: 320, conversions: 48, revenue: 96000 },
  { name: "Q3 Webinar Series", channel: "content", status: "active", budget: 8000, spent: 3100, leads: 180, conversions: 22, revenue: 44000 },
  { name: "Black Friday Email Blast", channel: "email", status: "planned", budget: 5000, spent: 0, leads: 0, conversions: 0, revenue: 0 },
  { name: "LinkedIn Ads — B2B", channel: "ads", status: "active", budget: 12000, spent: 9800, leads: 240, conversions: 31, revenue: 72000 },
  { name: "Community Meetup Bangalore", channel: "event", status: "completed", budget: 6000, spent: 5800, leads: 95, conversions: 18, revenue: 36000 },
];

const LEADS = [
  { name: "Acme Corp", email: "ops@acme.example", company: "Acme Corp", source: "website", stage: "new", value: 12000 },
  { name: "Globex Ltd", email: "hello@globex.example", company: "Globex", source: "referral", stage: "contacted", value: 28000 },
  { name: "Initech", email: "ceo@initech.example", company: "Initech", source: "ads", stage: "qualified", value: 45000 },
  { name: "Umbrella Inc", email: "biz@umbrella.example", company: "Umbrella", source: "event", stage: "proposal", value: 62000 },
  { name: "Hooli", email: "cto@hooli.example", company: "Hooli", source: "cold_outreach", stage: "negotiation", value: 95000 },
  { name: "Pied Piper", email: "team@piedpiper.example", company: "Pied Piper", source: "referral", stage: "won", value: 38000 },
  { name: "Stark Industries", email: "pepper@stark.example", company: "Stark Industries", source: "ads", stage: "qualified", value: 88000 },
  { name: "Wayne Enterprises", email: "lucius@wayne.example", company: "Wayne Enterprises", source: "event", stage: "contacted", value: 52000 },
  { name: "Soylent", email: "sales@soylent.example", company: "Soylent", source: "website", stage: "lost", value: 15000 },
  { name: "Cyberdyne", email: "ops@cyberdyne.example", company: "Cyberdyne", source: "cold_outreach", stage: "new", value: 22000 },
];

const SOCIAL_ACCOUNTS = [
  { platform: "instagram", handle: "@magnence", followers: 28400, following: 432, posts: 482, engagement: 4.8 },
  { platform: "twitter", handle: "@magnenceapp", followers: 18900, following: 312, posts: 1240, engagement: 3.2 },
  { platform: "linkedin", handle: "Magnence Inc.", followers: 42100, following: 89, posts: 186, engagement: 6.1 },
  { platform: "facebook", handle: "Magnence", followers: 15600, following: 12, posts: 320, engagement: 2.8 },
  { platform: "youtube", handle: "Magnence TV", followers: 9800, following: 0, posts: 64, engagement: 7.4 },
  { platform: "tiktok", handle: "@magnence", followers: 33200, following: 28, posts: 178, engagement: 9.6 },
];

const SOCIAL_POSTS = [
  { platform: "instagram", content: "Behind the scenes at Magnence HQ — building the future of unified work.", status: "published", publishedAt: new Date(Date.now() - 86400000 * 2), likes: 1240, comments: 86, shares: 142, reach: 18400, impressions: 24800 },
  { platform: "linkedin", content: "Announcing our Q3 product roadmap. Three big things coming for support teams.", status: "published", publishedAt: new Date(Date.now() - 86400000 * 1), likes: 820, comments: 124, shares: 312, reach: 42100, impressions: 64000 },
  { platform: "twitter", content: "Tip: Use AI Assistants in Magnence to answer any policy question in seconds.", status: "published", publishedAt: new Date(Date.now() - 3600000 * 6), likes: 312, comments: 28, shares: 86, reach: 9800, impressions: 14200 },
  { platform: "tiktok", content: "POV: your whole company finally on ONE app.", status: "scheduled", scheduledAt: new Date(Date.now() + 86400000 * 1), likes: 0, comments: 0, shares: 0, reach: 0, impressions: 0 },
  { platform: "instagram", content: "Customer love from Acme Corp — thanks for being a Magnence partner.", status: "scheduled", scheduledAt: new Date(Date.now() + 86400000 * 2), likes: 0, comments: 0, shares: 0, reach: 0, impressions: 0 },
  { platform: "facebook", content: "Join our community meetup this Saturday in Bangalore.", status: "draft", likes: 0, comments: 0, shares: 0, reach: 0, impressions: 0 },
];

const TICKETS = [
  { title: "Cannot login to my account", description: "After entering my email and password, the page just refreshes. Tried Chrome and Firefox.", category: "account", priority: "high", status: "open" },
  { title: "Invoice shows wrong amount", description: "My latest invoice shows $12,000 but contract says $11,500. Please fix.", category: "billing", priority: "medium", status: "in_progress" },
  { title: "Feature request: dark mode", description: "Would love a dark theme across Magnence modules.", category: "feature", priority: "low", status: "open" },
  { title: "VPN keeps disconnecting", description: "Company VPN drops every 10 minutes on Mac. Tried restarting.", category: "technical", priority: "urgent", status: "in_progress" },
  { title: "Question about leave policy", description: "Can I carry forward unused sick days to next year?", category: "general", priority: "low", status: "resolved" },
  { title: "Export to Excel broken", description: "Export button in Sales does nothing — no file downloads.", category: "bug", priority: "medium", status: "open" },
  { title: "Request access to Marketing module", description: "I'm a new intern in marketing, but I can only view the module, not edit.", category: "access", priority: "medium", status: "assigned" },
  { title: "Suspicious email received", description: "Got an email pretending to be from Magnence HR asking for credentials.", category: "security", priority: "urgent", status: "escalated" },
];

const ANNOUNCEMENTS = [
  { title: "Welcome to Magnence OS Phase 1!", body: "We're thrilled to announce the launch of Magnence OS — one unified platform for the entire company. From support tickets to AI assistants, document management to social media — everything is now in one place. Explore the sidebar to see all modules.", category: "company", pinned: true, authorEmail: "anurag@magnence.com" },
  { title: "Public Holiday — Independence Day", body: "Office will be closed on August 15th for Independence Day. Enjoy the long weekend!", category: "holiday", pinned: false, authorEmail: "anurag@magnence.com" },
  { title: "Q3 All-Hands Meeting", body: "Join us July 15th at 4pm IST for the Q3 all-hands. We'll cover product roadmap, OKRs, and team wins. Calendar invite sent.", category: "event", pinned: false, authorEmail: "anurag@magnence.com" },
  { title: "New Expense Policy Effective July 1", body: "Starting July 1st, all expenses over $200 require pre-approval from your manager. Submit via Support > Billing at least 3 days in advance.", category: "hr", pinned: false, authorEmail: "anurag@magnence.com" },
  { title: "Scheduled Maintenance — Saturday 2-4 AM", body: "Magnence will undergo scheduled maintenance this Saturday from 2-4 AM IST. Expect brief downtime. AI assistants will remain available.", category: "maintenance", pinned: false, authorEmail: "anurag@magnence.com" },
  { title: "Welcome our new interns!", body: "Please welcome Ananya Iyer (Marketing) and Lena Fischer (Sales) who joined us this week. Say hi in chat!", category: "company", pinned: false, authorEmail: "anurag@magnence.com" },
];

const CALENDAR_EVENTS = [
  { title: "Q3 All-Hands Meeting", type: "meeting", startDate: new Date(Date.now() + 7 * 86400000), endDate: new Date(Date.now() + 7 * 86400000 + 3600000), location: "Main Hall", organizerEmail: "anurag@magnence.com", audience: "all" },
  { title: "Independence Day", type: "holiday", startDate: new Date(Date.now() + 14 * 86400000), allDay: true, audience: "all" },
  { title: "Marketing Team Sync", type: "meeting", startDate: new Date(Date.now() + 1 * 86400000), endDate: new Date(Date.now() + 1 * 86400000 + 1800000), location: "Zoom", organizerEmail: "anurag@magnence.com", audience: "department:Marketing" },
  { title: "Sprint Review", type: "meeting", startDate: new Date(Date.now() + 3 * 86400000), endDate: new Date(Date.now() + 3 * 86400000 + 3600000), location: "Engineering Room", organizerEmail: "karthik@magnence.com", audience: "department:Engineering" },
  { title: "Aarav Sharma Birthday", type: "birthday", startDate: new Date(Date.now() + 5 * 86400000), allDay: true, audience: "all" },
  { title: "Product Launch Deadline", type: "deadline", startDate: new Date(Date.now() + 21 * 86400000), allDay: true, audience: "all" },
  { title: "Sales Pipeline Review", type: "meeting", startDate: new Date(Date.now() + 2 * 86400000), endDate: new Date(Date.now() + 2 * 86400000 + 1800000), location: "Conference Room A", organizerEmail: "anurag@magnence.com", audience: "department:Sales" },
];

const FOLDERS = [
  { name: "Brand Assets", type: "folder", isShared: true },
  { name: "HR Documents", type: "folder", isShared: true },
  { name: "Engineering", type: "folder", isShared: true },
  { name: "Sales Collateral", type: "folder", isShared: true },
  { name: "Personal", type: "folder", isShared: false },
];

const SAMPLE_FILES = [
  { name: "Magnence_Logo_Final.svg", type: "file", mimeType: "image/svg+xml", size: 2400, parentFolder: "Brand Assets" },
  { name: "Brand_Guidelines_2025.pdf", type: "file", mimeType: "application/pdf", size: 1840000, parentFolder: "Brand Assets" },
  { name: "Employee_Handbook_v3.pdf", type: "file", mimeType: "application/pdf", size: 2400000, parentFolder: "HR Documents" },
  { name: "Leave_Policy.pdf", type: "file", mimeType: "application/pdf", size: 320000, parentFolder: "HR Documents" },
  { name: "Architecture_Diagram.png", type: "file", mimeType: "image/png", size: 540000, parentFolder: "Engineering" },
  { name: "API_Documentation.md", type: "file", mimeType: "text/markdown", size: 28000, parentFolder: "Engineering" },
  { name: "Sales_Pitch_Deck.pptx", type: "file", mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation", size: 4200000, parentFolder: "Sales Collateral" },
];

export async function POST() {
  // Wipe all data — use raw deletes in safe order
  try {
    await db.auditLog.deleteMany();
    await db.activityLog.deleteMany();
    await db.notification.deleteMany();
    await db.eventAttendee.deleteMany();
    await db.calendarEvent.deleteMany();
    await db.announcement.deleteMany();
    await db.documentVersion.deleteMany();
    await db.document.deleteMany();
    await db.knowledgeRevision.deleteMany();
    await db.knowledgeBase.deleteMany();
    await db.approval.deleteMany();
    await db.leaveBalance.deleteMany();
    await db.leave.deleteMany();
    await db.employeeProfile.deleteMany();
    await db.teamMember.deleteMany();
    await db.team.deleteMany();
    await db.designation.deleteMany();
    await db.office.deleteMany();
    await db.department.deleteMany();
    await db.socialPost.deleteMany();
    await db.socialAccount.deleteMany();
    await db.lead.deleteMany();
    await db.campaign.deleteMany();
    await db.ticketMessage.deleteMany();
    await db.ticket.deleteMany();
    await db.chatMessage.deleteMany();
    await db.chatSession.deleteMany();
    await db.passwordReset.deleteMany();
    await db.session.deleteMany();
    await db.role.deleteMany();
    await db.user.deleteMany();
    await db.companySettings.deleteMany();
    // Phase 2 tables
    await db.taskComment.deleteMany();
    await db.task.deleteMany();
    await db.milestone.deleteMany();
    await db.project.deleteMany();
    await db.timeEntry.deleteMany();
    await db.attendance.deleteMany();
    await db.meetingAttendee.deleteMany();
    await db.meeting.deleteMany();
    await db.note.deleteMany();
    await db.kpi.deleteMany();
    await db.goal.deleteMany();
    await db.channelMessage.deleteMany();
    await db.channel.deleteMany();
    await db.formSubmission.deleteMany();
    await db.form.deleteMany();
    await db.asset.deleteMany();
    // Phase 3 tables
    await db.activity.deleteMany();
    await db.contact.deleteMany();
    await db.deal.deleteMany();
    await db.company.deleteMany();
    await db.payment.deleteMany();
    await db.invoice.deleteMany();
    await db.expense.deleteMany();
    await db.budget.deleteMany();
    await db.contract.deleteMany();
    await db.purchaseOrder.deleteMany();
    await db.vendor.deleteMany();
    await db.stockMovement.deleteMany();
    await db.inventoryItem.deleteMany();
    await db.warehouse.deleteMany();
    await db.workflowRun.deleteMany();
    await db.workflow.deleteMany();
    await db.automationRule.deleteMany();
    await db.quotation.deleteMany();
    await db.proposal.deleteMany();
    await db.callLog.deleteMany();
    await db.emailLog.deleteMany();
    // Phase 4 tables
    await db.emailCampaign.deleteMany();
    await db.landingPage.deleteMany();
    await db.sEOKeyword.deleteMany();
    await db.adCampaign.deleteMany();
    await db.event.deleteMany();
    await db.contentAsset.deleteMany();
    await db.socialInboxMessage.deleteMany();
    await db.websiteMetric.deleteMany();
    await db.brandMention.deleteMany();
    await db.aIProvider.deleteMany();
    // CI tables
    await db.userFeedback.deleteMany();
    await db.featureRequest.deleteMany();
    await db.productMetric.deleteMany();
    await db.releaseNote.deleteMany();
    await db.testResult.deleteMany();
    await db.featureFlag.deleteMany();
    // Phase 5
    await db.integration.deleteMany();
    await db.apiKey.deleteMany();
    await db.webhook.deleteMany();
    await db.customReport.deleteMany();
    await db.onboardingStep.deleteMany();
    await db.videoTutorial.deleteMany();
    await db.dataExport.deleteMany();
    // Phase 6 cleanup
    await db.aIKnowledge.deleteMany();
    await db.recommendation.deleteMany();
    await db.aIFeedback.deleteMany();
    await db.promptTemplate.deleteMany();
    await db.systemHealth.deleteMany();
    await db.backup.deleteMany();
    await db.prediction.deleteMany();
  } catch (e) {
    console.error("[seed] cleanup error:", e);
  }

  // 1. Users with passwords
  const users: any[] = [];
  for (const u of USERS) {
    const { hashPassword } = await import("@/lib/auth");
    const user = await db.user.create({
      data: { ...u, status: "active", passwordHash: hashPassword(process.env.SEED_PASSWORD || "Magnence@2026!") },
    });
    users.push(user);
  }
  const supportUser = users.find((u) => u.role === "COO")!;
  const aarav = users.find((u) => u.email === "anurag@magnence.com")!;

  // 2. System roles (pre-populate permissions for each built-in)
  for (const r of ROLE_TYPES) {
    await db.role.upsert({
      where: { name: r },
      update: {},
      create: { name: r, isSystem: true, permissions: JSON.stringify(DEFAULT_PERMISSIONS[r] || {}), description: `Built-in ${r} role` },
    });
  }

  // 3. Departments
  const depts: Record<string, Awaited<ReturnType<typeof db.department.create>>> = {};
  for (const d of DEPARTMENTS) {
    const head = users.find((u) => u.department === d.name);
    depts[d.name] = await db.department.create({ data: { name: d.name, description: d.description, headId: head?.id } });
  }

  // 4. Teams
  for (const t of TEAMS) {
    const dept = depts[t.departmentName];
    const lead = users.find((u) => u.department === t.departmentName);
    const team = await db.team.create({ data: { name: t.name, departmentId: dept?.id, leadId: lead?.id } });
    // Add some members
    const members = users.filter((u) => u.department === t.departmentName).slice(0, 3);
    for (const m of members) {
      await db.teamMember.create({ data: { teamId: team.id, userId: m.id, role: m.id === lead?.id ? "lead" : "member" } });
    }
  }

  // 5. Designations
  for (const d of DESIGNATIONS) {
    await db.designation.create({ data: d });
  }

  // 6. Offices
  for (const o of OFFICES) {
    await db.office.create({ data: o });
  }

  // 7. Company settings
  await db.companySettings.create({
    data: { id: "company", name: "Magnence", primaryColor: "#f1c24e", timezone: "Asia/Kolkata", currency: "INR", language: "en", fiscalYearStart: "April", workingHours: "9-18" },
  });

  // 8. Employee profiles
  for (const u of users) {
    const dept = depts[u.department];
    const manager = users.find((x) => x.role === "MANAGER" || x.role === "CTO" || x.role === "CHRO" || x.role === "CEO");
    await db.employeeProfile.create({
      data: {
        userId: u.id,
        joinDate: new Date(Date.now() - 90 * 86400000),
        employmentStatus: "active",
        departmentId: dept?.id,
        managerId: u.id === aarav.id ? null : manager?.id,
        designation: u.title,
        level: u.role === "INTERN" ? 1 : u.role === "CEO" ? 10 : 5,
        skills: "Communication, Teamwork",
      },
    });
    // Leave balance
    const profile = await db.employeeProfile.findFirst({ where: { userId: u.id } });
    if (profile) {
      await db.leaveBalance.create({
        data: { employeeId: profile.id, userId: u.id, year: new Date().getFullYear(), type: "sick", balance: 12, used: 3 },
      });
      await db.leaveBalance.create({
        data: { employeeId: profile.id, userId: u.id, year: new Date().getFullYear(), type: "casual", balance: 5, used: 1 },
      });
      await db.leaveBalance.create({
        data: { employeeId: profile.id, userId: u.id, year: new Date().getFullYear(), type: "earned", balance: 20, used: 5 },
      });
    }
  }

  // 9. Knowledge base
  for (const a of KB_ARTICLES) {
    await db.knowledgeBase.create({
      data: { ...a, authorId: aarav.id, publishedAt: new Date() },
    });
  }

  // 10. Campaigns
  for (const c of CAMPAIGNS) {
    await db.campaign.create({ data: c });
  }

  // 11. Leads
  const salesStaff = users.filter((u) => u.department === "Sales");
  for (let i = 0; i < LEADS.length; i++) {
    const l = LEADS[i];
    await db.lead.create({ data: { ...l, ownerId: salesStaff[i % salesStaff.length].id } });
  }

  // 12. Social accounts + posts
  for (const a of SOCIAL_ACCOUNTS) {
    await db.socialAccount.create({ data: a });
  }
  const socialMgr = users.find((u) => u.role === "CMO")!;
  for (const p of SOCIAL_POSTS) {
    await db.socialPost.create({ data: { ...p, authorId: socialMgr.id } });
  }

  // 13. Tickets
  const openers = users.filter((u) => u.id !== supportUser.id);
  for (let i = 0; i < TICKETS.length; i++) {
    const t = TICKETS[i];
    const opener = openers[i % openers.length];
    await db.ticket.create({
      data: { ...t, openedById: opener.id, assignedToId: supportUser.id, department: "support" },
    });
  }

  // 14. Announcements
  for (const a of ANNOUNCEMENTS) {
    const author = users.find((u) => u.email === a.authorEmail) || aarav;
    await db.announcement.create({
      data: {
        title: a.title,
        body: a.body,
        category: a.category,
        audience: "all",
        authorId: author.id,
        pinned: a.pinned,
        readBy: JSON.stringify([author.id]),
      },
    });
    // Create notifications for everyone
    for (const u of users) {
      await db.notification.create({
        data: { userId: u.id, type: "announcement", title: `New: ${a.title}`, body: a.body.slice(0, 100), link: "announcements" },
      });
    }
  }

  // 15. Calendar events
  for (const e of CALENDAR_EVENTS) {
    const organizer = e.organizerEmail ? users.find((u) => u.email === e.organizerEmail) : null;
    await db.calendarEvent.create({
      data: {
        title: e.title,
        type: e.type,
        startDate: e.startDate,
        endDate: e.endDate || null,
        allDay: (e as { allDay?: boolean }).allDay || false,
        location: (e as { location?: string }).location || null,
        organizerId: organizer?.id || null,
        audience: e.audience,
      },
    });
  }

  // 16. Documents — create folders then files
  const folderMap: Record<string, Awaited<ReturnType<typeof db.document.create>>> = {};
  for (const f of FOLDERS) {
    const doc = await db.document.create({ data: { name: f.name, type: "folder", ownerId: aarav.id, isShared: f.isShared } });
    folderMap[f.name] = doc;
  }
  for (const file of SAMPLE_FILES) {
    const parent = folderMap[file.parentFolder];
    await db.document.create({
      data: {
        name: file.name,
        type: "file",
        mimeType: file.mimeType,
        size: file.size,
        url: `/uploads/${file.name}`,
        parentId: parent?.id,
        ownerId: aarav.id,
        isShared: true,
      },
    });
  }

  // 17. Activity logs
  const actions = [
    { action: "opened ticket", target: "Cannot login to my account", category: "support" },
    { action: "scheduled post", target: "Instagram — Customer love", category: "user" },
    { action: "moved lead", target: "Hooli to negotiation", category: "user" },
    { action: "resolved ticket", target: "Leave policy question", category: "support" },
    { action: "created campaign", target: "Summer Launch 2025", category: "admin" },
    { action: "published post", target: "LinkedIn — Q3 roadmap", category: "user" },
    { action: "closed deal", target: "Pied Piper — $38k", category: "user" },
    { action: "asked AI assistant", target: "SOP Assistant", category: "ai" },
    { action: "uploaded document", target: "Employee_Handbook_v3.pdf", category: "file" },
    { action: "invited employee", target: "Ananya Iyer", category: "admin" },
  ];
  for (let i = 0; i < actions.length; i++) {
    const a = actions[i];
    const u = users[i % users.length];
    await db.activityLog.create({
      data: { userId: u.id, action: a.action, target: a.target, category: a.category, createdAt: new Date(Date.now() - i * 3600000) },
    });
  }

  // 18. Audit logs
  const auditActions = [
    { action: "login", category: "auth", target: "web" },
    { action: "permission_change", category: "permission", target: "Marketing role updated" },
    { action: "config_change", category: "config", target: "Company settings" },
    { action: "data_export", category: "data", target: "Employee directory export" },
    { action: "system_event", category: "system", target: "Scheduled backup completed" },
  ];
  for (let i = 0; i < auditActions.length; i++) {
    const a = auditActions[i];
    const u = users[i % users.length];
    await db.auditLog.create({
      data: { userId: u.id, action: a.action, category: a.category, target: a.target, createdAt: new Date(Date.now() - i * 7200000) },
    });
  }

  // ===== PHASE 2 DATA =====

  // 19. Projects
  const projects: any[] = [];
  const PROJECT_DATA = [
    { name: "Magnence OS Phase 2 Launch", description: "Ship the productivity layer — tasks, projects, time tracking, meetings.", category: "internal", department: "Engineering", status: "active", budget: 50000, spent: 32000, progress: 65, startDate: new Date(Date.now() - 30 * 86400000), endDate: new Date(Date.now() + 30 * 86400000), objectives: "Deliver Phase 2 on time with all 17 modules", deliverables: "Production-ready Phase 2 build" },
    { name: "Q3 Marketing Campaign", description: "Multi-channel campaign for Q3 product launch.", category: "internal", department: "Marketing", status: "active", budget: 25000, spent: 12000, progress: 40, startDate: new Date(Date.now() - 15 * 86400000), endDate: new Date(Date.now() + 45 * 86400000) },
    { name: "Acme Corp Client Portal", description: "Custom client portal for Acme Corp.", category: "client", department: "Engineering", status: "active", budget: 80000, spent: 55000, progress: 75, startDate: new Date(Date.now() - 60 * 86400000), endDate: new Date(Date.now() + 15 * 86400000) },
    { name: "HR Policy Refresh", description: "Update all HR policies for 2025.", category: "internal", department: "Human Resources", status: "planning", budget: 5000, spent: 0, progress: 10, startDate: new Date(Date.now() + 7 * 86400000), endDate: new Date(Date.now() + 90 * 86400000) },
    { name: "Sales Pipeline Optimization", description: "Improve sales conversion with better tooling.", category: "internal", department: "Sales", status: "on_hold", budget: 15000, spent: 8000, progress: 30, startDate: new Date(Date.now() - 45 * 86400000), endDate: new Date(Date.now() + 60 * 86400000) },
  ];
  for (const p of PROJECT_DATA) {
    projects.push(await db.project.create({ data: p }));
  }

  // 20. Tasks (assigned to various users)
  const TASK_DATA = [
    { title: "Design new task board UI", description: "Create wireframes and high-fidelity mockups for the new task board.", status: "in_progress", priority: "high", dueDate: new Date(Date.now() + 3 * 86400000), projectId: projects[0].id, assigneeId: users.find((u) => u.role === "CTO")?.id, estimatedTime: 480 },
    { title: "Implement time tracking API", description: "Build REST endpoints for starting/stopping timers and timesheets.", status: "completed", priority: "high", dueDate: new Date(Date.now() - 2 * 86400000), projectId: projects[0].id, assigneeId: users.find((u) => u.role === "CTO")?.id, actualTime: 360, estimatedTime: 300 },
    { title: "Write Q3 marketing copy", description: "Email, landing page, and social media copy for Q3 launch.", status: "review", priority: "medium", dueDate: new Date(Date.now() + 5 * 86400000), projectId: projects[1].id, assigneeId: users.find((u) => u.role === "CMO")?.id, estimatedTime: 240 },
    { title: "Client kickoff meeting with Acme", description: "Schedule and prepare for kickoff call.", status: "completed", priority: "urgent", dueDate: new Date(Date.now() - 10 * 86400000), projectId: projects[2].id, assigneeId: users.find((u) => u.role === "CTO")?.id, actualTime: 120 },
    { title: "Update employee handbook", description: "Refresh all sections with 2025 policies.", status: "todo", priority: "medium", dueDate: new Date(Date.now() + 14 * 86400000), projectId: projects[3].id, assigneeId: users.find((u) => u.role === "CHRO")?.id, estimatedTime: 600 },
    { title: "Fix login redirect bug", description: "Users are being redirected to wrong page after login.", status: "todo", priority: "urgent", dueDate: new Date(Date.now() + 1 * 86400000), projectId: projects[0].id, assigneeId: users.find((u) => u.role === "CTO")?.id, estimatedTime: 120 },
    { title: "Create Instagram content calendar", description: "Plan 30 days of Instagram posts.", status: "in_progress", priority: "low", dueDate: new Date(Date.now() + 7 * 86400000), assigneeId: users.find((u) => u.role === "CMO")?.id, estimatedTime: 180 },
    { title: "Sales team training on new CRM", description: "Conduct training session for sales team.", status: "qa", priority: "medium", dueDate: new Date(Date.now() + 2 * 86400000), projectId: projects[4].id, assigneeId: users.find((u) => u.role === "CCO")?.id, estimatedTime: 240 },
    { title: "Review and approve Q3 budget", description: "Final budget review for Q3.", status: "approved", priority: "high", dueDate: new Date(Date.now() - 1 * 86400000), assigneeId: users.find((u) => u.role === "CEO")?.id, actualTime: 90 },
    { title: "Set up CI/CD pipeline", description: "Automated testing and deployment.", status: "in_progress", priority: "high", dueDate: new Date(Date.now() + 10 * 86400000), projectId: projects[0].id, assigneeId: users.find((u) => u.role === "CTO")?.id, estimatedTime: 480 },
    { title: "Customer feedback survey", description: "Design and send NPS survey to active customers.", status: "todo", priority: "low", dueDate: new Date(Date.now() + 21 * 86400000), assigneeId: users.find((u) => u.role === "CMO")?.id },
    { title: "Onboard new intern", description: "Help Ananya get set up with all tools and access.", status: "in_progress", priority: "medium", dueDate: new Date(Date.now() + 2 * 86400000), assigneeId: users.find((u) => u.role === "CMO")?.id, estimatedTime: 120 },
  ];
  for (const t of TASK_DATA) {
    const reporter = users.find((u) => u.role === "CTO") || users[0];
    await db.task.create({ data: { ...t, reporterId: reporter.id, completedAt: t.status === "completed" ? new Date() : null } });
  }

  // 21. Meetings
  const MEETING_DATA = [
    { title: "Weekly Engineering Standup", agenda: "Sprint progress, blockers, priorities for the week.", startTime: new Date(Date.now() + 1 * 86400000 + 10 * 3600000), endTime: new Date(Date.now() + 1 * 86400000 + 10.5 * 3600000), location: "Zoom", organizerId: users.find((u) => u.role === "CTO")?.id, status: "scheduled" },
    { title: "Q3 Marketing Strategy Review", agenda: "Review campaign performance and adjust strategy.", startTime: new Date(Date.now() + 2 * 86400000 + 14 * 3600000), endTime: new Date(Date.now() + 2 * 86400000 + 15 * 3600000), location: "Conference Room A", organizerId: users.find((u) => u.role === "CMO")?.id, status: "scheduled" },
    { title: "Product Roadmap Planning", agenda: "Plan Q4 product roadmap with leadership.", startTime: new Date(Date.now() + 5 * 86400000 + 11 * 3600000), endTime: new Date(Date.now() + 5 * 86400000 + 12.5 * 3600000), location: "Main Hall", organizerId: users[0].id, status: "scheduled" },
    { title: "Client Sync — Acme Corp", agenda: "Weekly sync with Acme team on portal progress.", startTime: new Date(Date.now() - 2 * 86400000 + 15 * 3600000), endTime: new Date(Date.now() - 2 * 86400000 + 15.5 * 3600000), location: "Zoom", organizerId: users.find((u) => u.role === "CTO")?.id, status: "completed", notes: "Discussed portal progress. Client happy with timeline. Action: send updated wireframes by Friday.", aiSummary: "Meeting Summary:\n- Discussed portal development progress (75% complete)\n- Client expressed satisfaction with timeline\n- Action item: Send updated wireframes by Friday\n- Next sync scheduled for next Tuesday\n\nDecisions made:\n- Continue current development pace\n- Prioritize mobile responsive design" },
  ];
  for (const m of MEETING_DATA) {
    await db.meeting.create({ data: m });
  }

  // 22. Goals
  const GOAL_DATA = [
    { title: "Ship Phase 2 on time", description: "Deliver all 17 Phase 2 modules by end of quarter.", type: "company", progress: 65, status: "active", endDate: new Date(Date.now() + 30 * 86400000), ownerId: users[0].id },
    { title: "Increase customer NPS to 50", description: "Improve customer satisfaction score from 42 to 50.", type: "company", progress: 40, status: "active", endDate: new Date(Date.now() + 90 * 86400000), ownerId: users[0].id },
    { title: "Close $500k in new deals", description: "Q3 sales target.", type: "department", progress: 55, status: "active", endDate: new Date(Date.now() + 60 * 86400000), ownerId: users.find((u) => u.role === "CCO")?.id || users[0].id },
    { title: "Launch 3 marketing campaigns", description: "Summer launch, webinar series, and Black Friday.", type: "team", progress: 70, status: "active", endDate: new Date(Date.now() + 45 * 86400000), ownerId: users.find((u) => u.role === "CMO")?.id || users[0].id },
    { title: "Complete Magnence OS certification", description: "Get all employees certified on the platform.", type: "individual", progress: 30, status: "active", endDate: new Date(Date.now() + 120 * 86400000), ownerId: users.find((u) => u.role === "INTERN")?.id || users[0].id },
  ];
  for (const g of GOAL_DATA) {
    const goal = await db.goal.create({ data: g });
    // Add a KPI
    await db.kpi.create({ data: { goalId: goal.id, title: "Progress", target: 100, current: g.progress, unit: "%", ownerId: g.ownerId } });
  }

  // 23. Notes
  const NOTE_DATA = [
    { title: "Sprint Planning Notes", content: "Sprint goals:\n1. Complete time tracking module\n2. Fix 5 critical bugs\n3. Start on meetings module\n\nTeam capacity: 120 hours\nRisk: Vikram on leave Thursday", category: "meeting", authorId: users.find((u) => u.role === "CTO")?.id || users[0].id, pinned: true },
    { title: "Ideas for Q4", content: "- Mobile app\n- Real-time collaboration\n- Advanced analytics dashboard\n- API for integrations\n- Workflow automation", category: "personal", authorId: users[0].id },
    { title: "Meeting with Acme — Action Items", content: "1. Send wireframes by Friday\n2. Schedule design review\n3. Update project timeline\n4. Get budget approval for additional features", category: "meeting", authorId: users.find((u) => u.role === "CTO")?.id || users[0].id },
    { title: "Brand Voice Guidelines", content: "Magnence voice:\n- Warm but professional\n- Clear and direct\n- Confident without arrogance\n- Helpful and empowering\n\nAvoid: jargon, hype, corporate speak", category: "shared", authorId: users.find((u) => u.role === "CMO")?.id || users[0].id, pinned: true },
  ];
  for (const n of NOTE_DATA) {
    await db.note.create({ data: n });
  }

  // 24. Chat channels
  const CHANNEL_DATA = [
    { name: "general", type: "team" },
    { name: "engineering", type: "department" },
    { name: "marketing", type: "department" },
    { name: "sales", type: "department" },
    { name: "random", type: "group" },
    { name: "announcements", type: "team" },
  ];
  const channels: any[] = [];
  for (const c of CHANNEL_DATA) {
    channels.push(await db.channel.create({ data: { ...c, members: JSON.stringify(users.map((u) => u.id)) } }));
  }
  // Seed some messages
  const MESSAGES = [
    { channelId: channels[0].id, authorId: users[0].id, authorName: users[0].name, content: "Welcome to Magnence OS Phase 2 everyone! 🎉" },
    { channelId: channels[0].id, authorId: users.find((u) => u.role === "CTO")?.id || users[1].id, authorName: "Vikram Singh", content: "Excited to ship the new task module!" },
    { channelId: channels[1].id, authorId: users.find((u) => u.role === "CTO")?.id || users[2].id, authorName: "Karthik Reddy", content: "Sprint planning at 11am today. Please update your tasks." },
    { channelId: channels[2].id, authorId: users.find((u) => u.role === "CMO")?.id || users[3].id, authorName: "Meera Joshi", content: "Q3 campaign is 40% complete. On track!" },
    { channelId: channels[4].id, authorId: users.find((u) => u.role === "CTO")?.id || users[4].id, authorName: "Daniel Carter", content: "Coffee chat anyone? ☕" },
  ];
  for (const m of MESSAGES) {
    await db.channelMessage.create({ data: m });
  }

  // 25. Time entries
  for (let i = 0; i < 15; i++) {
    const u = users[i % users.length];
    const startTime = new Date(Date.now() - i * 86400000 - 4 * 3600000);
    const endTime = new Date(startTime.getTime() + (Math.floor(Math.random() * 4) + 1) * 3600000);
    await db.timeEntry.create({
      data: { userId: u.id, startTime, endTime, duration: Math.round((endTime.getTime() - startTime.getTime()) / 60000), billable: true, notes: "Working on project tasks", projectId: projects[i % projects.length].id },
    });
  }

  // 26. Attendance — past 7 days for all users
  for (let d = 0; d < 7; d++) {
    const date = new Date();
    date.setDate(date.getDate() - d);
    date.setHours(0, 0, 0, 0);
    for (const u of users.slice(0, 8)) {
      const checkIn = new Date(date);
      checkIn.setHours(9, Math.floor(Math.random() * 30), 0, 0);
      const checkOut = new Date(date);
      checkOut.setHours(18, Math.floor(Math.random() * 30), 0, 0);
      const workMinutes = Math.round((checkOut.getTime() - checkIn.getTime()) / 60000);
      await db.attendance.create({
        data: { userId: u.id, date, checkIn, checkOut, workMinutes, overtimeMinutes: Math.max(0, workMinutes - 540), status: checkIn.getHours() >= 10 ? "late" : "present", shift: "day" },
      });
    }
  }

  // 27. Assets
  const ASSET_DATA = [
    { name: "MacBook Pro 16&quot;", type: "laptop", serial: "MBP16-001", value: 2400, assignedToId: users.find((u) => u.role === "CTO")?.id, status: "assigned" },
    { name: "MacBook Pro 14&quot;", type: "laptop", serial: "MBP14-002", value: 2000, assignedToId: users.find((u) => u.role === "CTO")?.id, status: "assigned" },
    { name: "Dell Monitor 27&quot;", type: "monitor", serial: "DELL27-001", value: 400, assignedToId: users.find((u) => u.role === "CTO")?.id, status: "assigned" },
    { name: "iPhone 15 Pro", type: "phone", serial: "IP15P-001", value: 1100, assignedToId: users[0].id, status: "assigned" },
    { name: "MacBook Air", type: "laptop", serial: "MBA-003", value: 1200, status: "available" },
    { name: "Logitech Keyboard", type: "keyboard", serial: "LOGI-K-001", value: 130, status: "available" },
    { name: "Herman Miller Chair", type: "chair", serial: "HM-C-001", value: 1400, assignedToId: users[0].id, status: "assigned" },
    { name: "MacBook Pro 13&quot;", type: "laptop", serial: "MBP13-004", value: 1500, status: "in_repair" },
  ];
  for (const a of ASSET_DATA) {
    await db.asset.create({ data: { ...a, purchaseDate: new Date(Date.now() - 180 * 86400000) } });
  }

  // 28. Forms
  const FORM_DATA = [
    { title: "Leave Application", description: "Apply for leave", category: "leave", fields: JSON.stringify([{ name: "type", label: "Leave Type", type: "select" }, { name: "startDate", label: "Start Date", type: "date" }, { name: "endDate", label: "End Date", type: "date" }, { name: "reason", label: "Reason", type: "textarea" }]) },
    { title: "Expense Reimbursement", description: "Submit expense for reimbursement", category: "expense", fields: JSON.stringify([{ name: "amount", label: "Amount", type: "number" }, { name: "category", label: "Category", type: "select" }, { name: "description", label: "Description", type: "textarea" }, { name: "receipts", label: "Receipts", type: "file" }]) },
    { title: "Asset Request", description: "Request equipment or assets", category: "asset", fields: JSON.stringify([{ name: "assetType", label: "Asset Type", type: "select" }, { name: "reason", label: "Reason", type: "textarea" }]) },
    { title: "Access Request", description: "Request access to systems or modules", category: "access", fields: JSON.stringify([{ name: "system", label: "System", type: "text" }, { name: "accessLevel", label: "Access Level", type: "select" }, { name: "justification", label: "Justification", type: "textarea" }]) },
    { title: "Travel Request", description: "Request business travel", category: "travel", fields: JSON.stringify([{ name: "destination", label: "Destination", type: "text" }, { name: "dates", label: "Travel Dates", type: "text" }, { name: "purpose", label: "Purpose", type: "textarea" }, { name: "estimatedCost", label: "Estimated Cost", type: "number" }]) },
  ];
  for (const f of FORM_DATA) {
    await db.form.create({ data: f });
  }

  // ===== PHASE 3 DATA =====

  // 29. Companies (leads + clients)
  const COMPANY_DATA = [
    { name: "Acme Corp", industry: "Technology", website: "acme.example", email: "ops@acme.example", phone: "+1-555-0100", city: "San Francisco", country: "USA", size: "medium", revenue: 500000, isClient: true, status: "active_client", source: "website", ownerId: users.find((u) => u.role === "CCO")?.id, notes: "Key enterprise client since 2024" },
    { name: "Globex Ltd", industry: "Manufacturing", website: "globex.example", email: "hello@globex.example", phone: "+44-20-7946-0958", city: "London", country: "UK", size: "large", revenue: 1200000, isClient: true, status: "active_client", source: "referral", ownerId: users.find((u) => u.role === "CCO")?.id },
    { name: "Initech", industry: "Software", email: "ceo@initech.example", phone: "+1-555-0200", city: "Austin", country: "USA", size: "small", revenue: 0, isClient: false, status: "prospect", source: "ads" },
    { name: "Umbrella Inc", industry: "Healthcare", email: "biz@umbrella.example", phone: "+1-555-0300", city: "Boston", country: "USA", size: "medium", revenue: 0, isClient: false, status: "lead", source: "event" },
    { name: "Hooli", industry: "Technology", website: "hooli.example", email: "cto@hooli.example", phone: "+1-555-0400", city: "Palo Alto", country: "USA", size: "enterprise", revenue: 850000, isClient: true, status: "active_client", source: "cold_outreach", ownerId: users.find((u) => u.role === "CCO")?.id },
    { name: "Pied Piper", industry: "Software", email: "team@piedpiper.example", phone: "+1-555-0500", city: "Palo Alto", country: "USA", size: "startup", revenue: 120000, isClient: true, status: "active_client", source: "referral" },
    { name: "Stark Industries", industry: "Defense", email: "pepper@stark.example", phone: "+1-555-0600", city: "Malibu", country: "USA", size: "enterprise", revenue: 2000000, isClient: true, status: "active_client", source: "ads", ownerId: users.find((u) => u.role === "CCO")?.id },
    { name: "Wayne Enterprises", industry: "Conglomerate", email: "lucius@wayne.example", phone: "+1-555-0700", city: "Gotham", country: "USA", size: "enterprise", revenue: 0, isClient: false, status: "prospect", source: "event" },
    { name: "Soylent", industry: "Food Tech", email: "sales@soylent.example", phone: "+1-555-0800", city: "LA", country: "USA", size: "medium", revenue: 0, isClient: false, status: "lead", source: "website" },
    { name: "Cyberdyne", industry: "AI/Robotics", email: "ops@cyberdyne.example", phone: "+1-555-0900", city: "Sunnyvale", country: "USA", size: "medium", revenue: 0, isClient: false, status: "lead", source: "cold_outreach" },
  ];
  const companies: any[] = [];
  for (const c of COMPANY_DATA) {
    companies.push(await db.company.create({ data: c }));
  }

  // 30. Contacts
  const CONTACT_DATA = [
    { firstName: "John", lastName: "Doe", email: "john@acme.example", phone: "+1-555-0101", title: "CTO", department: "Engineering", companyId: companies[0].id, isPrimary: true, isDecisionMaker: true },
    { firstName: "Jane", lastName: "Smith", email: "jane@acme.example", phone: "+1-555-0102", title: "VP Engineering", companyId: companies[0].id },
    { firstName: "Bob", lastName: "Johnson", email: "bob@globex.example", phone: "+44-20-7946-0001", title: "COO", companyId: companies[1].id, isPrimary: true, isDecisionMaker: true },
    { firstName: "Alice", lastName: "Williams", email: "alice@hooli.example", title: "CFO", companyId: companies[4].id, isPrimary: true, isDecisionMaker: true },
    { firstName: "Richard", lastName: "Hendricks", email: "richard@piedpiper.example", title: "CEO", companyId: companies[5].id, isPrimary: true, isDecisionMaker: true },
    { firstName: "Pepper", lastName: "Potts", email: "pepper@stark.example", title: "CEO", companyId: companies[6].id, isPrimary: true, isDecisionMaker: true },
  ];
  for (const c of CONTACT_DATA) {
    await db.contact.create({ data: c });
  }

  // 31. Deals
  const DEAL_DATA = [
    { title: "Annual Enterprise Subscription", companyId: companies[0].id, value: 120000, stage: "negotiation", probability: 70, expectedCloseDate: new Date(Date.now() + 14 * 86400000), source: "website" },
    { title: "Platform Expansion", companyId: companies[1].id, value: 80000, stage: "proposal", probability: 50, expectedCloseDate: new Date(Date.now() + 30 * 86400000), source: "referral" },
    { title: "Pilot Project", companyId: companies[2].id, value: 25000, stage: "qualified", probability: 30, expectedCloseDate: new Date(Date.now() + 45 * 86400000), source: "ads" },
    { title: "Healthcare Solution", companyId: companies[3].id, value: 95000, stage: "new", probability: 15, source: "event" },
    { title: "Multi-year Renewal", companyId: companies[4].id, value: 200000, stage: "won", probability: 100, actualCloseDate: new Date(Date.now() - 5 * 86400000), source: "cold_outreach" },
    { title: "Startup Plan", companyId: companies[5].id, value: 38000, stage: "won", probability: 100, actualCloseDate: new Date(Date.now() - 30 * 86400000), source: "referral" },
    { title: "Enterprise License", companyId: companies[6].id, value: 350000, stage: "negotiation", probability: 65, expectedCloseDate: new Date(Date.now() + 21 * 86400000), source: "ads" },
    { title: "Consulting Services", companyId: companies[7].id, value: 60000, stage: "lost", probability: 0, actualCloseDate: new Date(Date.now() - 10 * 86400000), lossReason: "Went with competitor", source: "event" },
  ];
  for (const d of DEAL_DATA) {
    await db.deal.create({ data: { ...d, ownerId: users.find((u) => u.role === "CCO")?.id } });
  }

  // 32. Invoices
  const INVOICE_DATA = [
    { number: "INV-2025-001", companyId: companies[0].id, type: "sales", status: "paid", issueDate: new Date(Date.now() - 60 * 86400000), dueDate: new Date(Date.now() - 45 * 86400000), subtotal: 10000, tax: 1000, total: 11000, paidAmount: 11000 },
    { number: "INV-2025-002", companyId: companies[1].id, type: "sales", status: "paid", issueDate: new Date(Date.now() - 45 * 86400000), dueDate: new Date(Date.now() - 30 * 86400000), subtotal: 20000, tax: 2000, total: 22000, paidAmount: 22000 },
    { number: "INV-2025-003", companyId: companies[4].id, type: "sales", status: "paid", issueDate: new Date(Date.now() - 30 * 86400000), dueDate: new Date(Date.now() - 15 * 86400000), subtotal: 50000, tax: 5000, total: 55000, paidAmount: 55000 },
    { number: "INV-2025-004", companyId: companies[0].id, type: "sales", status: "sent", issueDate: new Date(Date.now() - 7 * 86400000), dueDate: new Date(Date.now() + 8 * 86400000), subtotal: 15000, tax: 1500, total: 16500, paidAmount: 0 },
    { number: "INV-2025-005", companyId: companies[6].id, type: "sales", status: "overdue", issueDate: new Date(Date.now() - 45 * 86400000), dueDate: new Date(Date.now() - 15 * 86400000), subtotal: 80000, tax: 8000, total: 88000, paidAmount: 0 },
    { number: "INV-2025-006", companyId: companies[1].id, type: "sales", status: "partial", issueDate: new Date(Date.now() - 20 * 86400000), dueDate: new Date(Date.now() + 10 * 86400000), subtotal: 30000, tax: 3000, total: 33000, paidAmount: 15000 },
    { number: "INV-2025-007", companyId: companies[5].id, type: "sales", status: "draft", issueDate: new Date(), subtotal: 9500, tax: 950, total: 10450, paidAmount: 0 },
  ];
  for (const inv of INVOICE_DATA) {
    await db.invoice.create({ data: { ...inv, items: "[]" } });
  }

  // 33. Expenses
  const EXPENSE_DATA = [
    { number: "EXP-001", userId: users[0].id, category: "travel", description: "Client meeting travel - SF", amount: 850, status: "approved", approvedById: users[0].id, approvedAt: new Date() },
    { number: "EXP-002", userId: users.find((u) => u.role === "CCO")?.id || users[0].id, category: "meals", description: "Client lunch - Acme", amount: 180, status: "approved", approvedById: users[0].id, approvedAt: new Date() },
    { number: "EXP-003", userId: users.find((u) => u.role === "CTO")?.id || users[0].id, category: "software", description: "JetBrains license", amount: 240, status: "pending" },
    { number: "EXP-004", userId: users.find((u) => u.role === "CTO")?.id || users[0].id, category: "hardware", description: "Drawing tablet", amount: 320, status: "pending" },
    { number: "EXP-005", userId: users.find((u) => u.role === "CMO")?.id || users[0].id, category: "office", description: "Team offsite supplies", amount: 450, status: "reimbursed" },
    { number: "EXP-006", userId: users.find((u) => u.role === "CTO")?.id || users[0].id, category: "training", description: "AWS certification", amount: 150, status: "rejected" },
  ];
  for (const e of EXPENSE_DATA) {
    await db.expense.create({ data: { ...e, date: new Date(Date.now() - Math.random() * 30 * 86400000) } });
  }

  // 34. Contracts
  const CONTRACT_DATA = [
    { number: "CTR-001", title: "Annual Service Agreement", companyId: companies[0].id, type: "msa", status: "active", value: 120000, startDate: new Date(Date.now() - 100 * 86400000), endDate: new Date(Date.now() + 265 * 86400000), signedDate: new Date(Date.now() - 100 * 86400000), autoRenew: true },
    { number: "CTR-002", title: "NDA", companyId: companies[1].id, type: "nda", status: "active", value: 0, startDate: new Date(Date.now() - 200 * 86400000), endDate: null, signedDate: new Date(Date.now() - 200 * 86400000) },
    { number: "CTR-003", title: "SLA - Premium Support", companyId: companies[4].id, type: "sla", status: "active", value: 50000, startDate: new Date(Date.now() - 60 * 86400000), endDate: new Date(Date.now() + 20 * 86400000), signedDate: new Date(Date.now() - 60 * 86400000), autoRenew: true },
    { number: "CTR-004", title: "Enterprise License", companyId: companies[6].id, type: "subscription", status: "active", value: 350000, startDate: new Date(Date.now() - 30 * 86400000), endDate: new Date(Date.now() + 335 * 86400000), signedDate: new Date(Date.now() - 30 * 86400000) },
    { number: "CTR-005", title: "Pilot Agreement", companyId: companies[2].id, type: "service", status: "draft", value: 25000 },
    { number: "CTR-006", title: "Old Contract - Expired", companyId: companies[5].id, type: "service", status: "expired", value: 15000, startDate: new Date(Date.now() - 400 * 86400000), endDate: new Date(Date.now() - 35 * 86400000) },
  ];
  for (const c of CONTRACT_DATA) {
    await db.contract.create({ data: c });
  }

  // 35. Vendors
  const VENDOR_DATA = [
    { name: "TechSupplies Inc", category: "IT Hardware", email: "sales@techsupplies.example", phone: "+1-555-1000", contactPerson: "Mark Brown", rating: 5, status: "active", paymentTerms: "Net 30" },
    { name: "CloudHost Pro", category: "Cloud Services", email: "billing@cloudhost.example", phone: "+1-555-1100", contactPerson: "Sarah Lee", rating: 4, status: "active", paymentTerms: "Net 15" },
    { name: "Office Depot Business", category: "Office Supplies", email: "business@officedepot.example", phone: "+1-555-1200", contactPerson: "Tom Wilson", rating: 4, status: "active", paymentTerms: "Net 45" },
    { name: "SecureNet Solutions", category: "Security", email: "info@securenet.example", phone: "+1-555-1300", contactPerson: "Lisa Chen", rating: 5, status: "active", paymentTerms: "Net 30" },
    { name: "PrintWorks", category: "Printing", email: "orders@printworks.example", phone: "+1-555-1400", contactPerson: "James Taylor", rating: 3, status: "active", paymentTerms: "Net 30" },
  ];
  const vendors: any[] = [];
  for (const v of VENDOR_DATA) {
    vendors.push(await db.vendor.create({ data: v }));
  }

  // 36. Purchase Orders
  const PO_DATA = [
    { number: "PO-001", vendorId: vendors[0].id, status: "received", subtotal: 12000, tax: 1200, total: 13200, expectedDate: new Date(Date.now() - 10 * 86400000) },
    { number: "PO-002", vendorId: vendors[1].id, status: "received", subtotal: 5000, tax: 500, total: 5500, expectedDate: new Date(Date.now() - 5 * 86400000) },
    { number: "PO-003", vendorId: vendors[2].id, status: "sent", subtotal: 800, tax: 80, total: 880, expectedDate: new Date(Date.now() + 5 * 86400000) },
    { number: "PO-004", vendorId: vendors[3].id, status: "draft", subtotal: 3000, tax: 300, total: 3300 },
    { number: "PO-005", vendorId: vendors[0].id, status: "sent", subtotal: 8000, tax: 800, total: 8800, expectedDate: new Date(Date.now() + 10 * 86400000) },
  ];
  for (const p of PO_DATA) {
    await db.purchaseOrder.create({ data: { ...p, items: "[]" } });
  }

  // 37. Warehouses & Inventory
  const wh1 = await db.warehouse.create({ data: { name: "Main Warehouse", location: "Bangalore", code: "WH-001" } });
  const wh2 = await db.warehouse.create({ data: { name: "Mumbai Storage", location: "Mumbai", code: "WH-002" } });
  const INVENTORY_DATA = [
    { sku: "ITM-001", name: "MacBook Pro 16", category: "Electronics", stockQty: 25, reorderLevel: 10, unitCost: 2400, unitPrice: 2800, warehouseId: wh1.id },
    { sku: "ITM-002", name: "Dell Monitor 27", category: "Electronics", stockQty: 8, reorderLevel: 10, unitCost: 400, unitPrice: 550, warehouseId: wh1.id },
    { sku: "ITM-003", name: "Office Chair Ergonomic", category: "Furniture", stockQty: 45, reorderLevel: 15, unitCost: 350, unitPrice: 500, warehouseId: wh2.id },
    { sku: "ITM-004", name: "Logitech Keyboard", category: "Accessories", stockQty: 60, reorderLevel: 20, unitCost: 80, unitPrice: 120, warehouseId: wh1.id },
    { sku: "ITM-005", name: "Wireless Mouse", category: "Accessories", stockQty: 5, reorderLevel: 15, unitCost: 30, unitPrice: 50, warehouseId: wh1.id },
    { sku: "ITM-006", name: "USB-C Hub", category: "Accessories", stockQty: 30, reorderLevel: 10, unitCost: 45, unitPrice: 75, warehouseId: wh2.id },
    { sku: "ITM-007", name: "Standing Desk", category: "Furniture", stockQty: 12, reorderLevel: 5, unitCost: 600, unitPrice: 850, warehouseId: wh2.id },
  ];
  for (const i of INVENTORY_DATA) {
    await db.inventoryItem.create({ data: i });
  }

  // 38. Workflows
  const WORKFLOW_DATA = [
    { name: "Sales Lead Qualification", type: "sales", description: "Qualify new leads and assign to sales reps", trigger: "on_create", active: true, steps: JSON.stringify([{ step: 1, action: "Auto-assign to sales rep" }, { step: 2, action: "Send welcome email" }, { step: 3, action: "Create follow-up task" }]) },
    { name: "Invoice Approval", type: "invoice", description: "Multi-step invoice approval process", trigger: "on_create", active: true, steps: JSON.stringify([{ step: 1, action: "Manager review" }, { step: 2, action: "Finance approval" }, { step: 3, action: "Send to client" }]) },
    { name: "Purchase Order Workflow", type: "procurement", description: "PO creation to delivery tracking", trigger: "manual", active: true, steps: JSON.stringify([{ step: 1, action: "Create PO" }, { step: 2, action: "Manager approval" }, { step: 3, action: "Send to vendor" }, { step: 4, action: "Track delivery" }]) },
    { name: "Client Onboarding", type: "client_onboarding", description: "Onboard new clients with welcome sequence", trigger: "on_create", active: true, steps: JSON.stringify([{ step: 1, action: "Create client workspace" }, { step: 2, action: "Send welcome email" }, { step: 3, action: "Assign account manager" }, { step: 4, action: "Schedule kickoff call" }]) },
    { name: "Employee Onboarding", type: "employee_onboarding", description: "New employee setup process", trigger: "on_create", active: false, steps: JSON.stringify([{ step: 1, action: "Create email account" }, { step: 2, action: "Assign equipment" }, { step: 3, action: "Schedule orientation" }]) },
  ];
  for (const w of WORKFLOW_DATA) {
    await db.workflow.create({ data: w });
    // Add a run for the first workflow
  }
  // Seed some workflow runs
  const wf1 = await db.workflow.findFirst();
  if (wf1) {
    await db.workflowRun.create({ data: { workflowId: wf1.id, status: "completed", currentStep: 3, completedAt: new Date(Date.now() - 3600000), log: JSON.stringify([{ step: 1, action: "executed" }, { step: 2, action: "executed" }, { step: 3, action: "executed" }]) } });
    await db.workflowRun.create({ data: { workflowId: wf1.id, status: "completed", currentStep: 3, completedAt: new Date(Date.now() - 7200000), log: JSON.stringify([{ step: 1, action: "executed" }]) } });
  }

  // 39. Automation Rules
  const RULE_DATA = [
    { name: "Auto-assign new leads", category: "sales", trigger: "lead_created", action: "assign_owner", active: true, runsCount: 24 },
    { name: "Welcome email to new clients", category: "client", trigger: "deal_won", action: "send_email", active: true, runsCount: 8 },
    { name: "Overdue invoice reminder", category: "finance", trigger: "invoice_overdue", action: "send_email", active: true, runsCount: 12 },
    { name: "Contract renewal alert", category: "client", trigger: "contract_expiring", action: "notify", active: true, runsCount: 3 },
    { name: "Low stock alert", category: "procurement", trigger: "low_stock", action: "notify", active: false, runsCount: 5 },
    { name: "Auto follow-up after demo", category: "sales", trigger: "deal_won", action: "create_task", active: true, runsCount: 15 },
  ];
  for (const r of RULE_DATA) {
    await db.automationRule.create({ data: r });
  }

  // 40. Quotations & Proposals
  const QUOTATION_DATA = [
    { number: "QUO-001", companyId: companies[0].id, subject: "Annual Enterprise Subscription", status: "accepted", total: 120000, subtotal: 120000 },
    { number: "QUO-002", companyId: companies[1].id, subject: "Platform Expansion Quote", status: "sent", total: 80000, subtotal: 80000 },
    { number: "QUO-003", companyId: companies[2].id, subject: "Pilot Project Quote", status: "draft", total: 25000, subtotal: 25000 },
    { number: "QUO-004", companyId: companies[6].id, subject: "Enterprise License Quote", status: "sent", total: 350000, subtotal: 350000 },
  ];
  for (const q of QUOTATION_DATA) {
    await db.quotation.create({ data: { ...q, items: "[]" } });
  }

  const PROPOSAL_DATA = [
    { number: "PRP-001", companyId: companies[0].id, title: "Enterprise Platform Proposal", content: "## Executive Summary\n\nThis proposal outlines the implementation of Magnence OS for Acme Corp...\n\n## Scope of Work\n\n- Platform setup and configuration\n- User training (50 users)\n- Premium support (24/7)\n- Custom integrations\n\n## Timeline\n\n8 weeks implementation\n\n## Pricing\n\n$120,000 annually", status: "sent" },
    { number: "PRP-002", companyId: companies[1].id, title: "Platform Expansion Proposal", content: "## Executive Summary\n\nExpand Magnence OS usage to Globex's manufacturing division...", status: "draft" },
  ];
  for (const p of PROPOSAL_DATA) {
    await db.proposal.create({ data: p });
  }

  // 41. Budgets
  const BUDGET_DATA = [
    { name: "Engineering Q3 2025", type: "department", category: "Engineering", allocated: 200000, spent: 145000, fiscalYear: 2025 },
    { name: "Marketing Q3 2025", type: "department", category: "Marketing", allocated: 80000, spent: 52000, fiscalYear: 2025 },
    { name: "Sales Q3 2025", type: "department", category: "Sales", allocated: 120000, spent: 88000, fiscalYear: 2025 },
    { name: "Magnence OS Phase 3", type: "project", allocated: 50000, spent: 32000, fiscalYear: 2025 },
    { name: "Company Total 2025", type: "company", allocated: 1000000, spent: 685000, fiscalYear: 2025 },
  ];
  for (const b of BUDGET_DATA) {
    await db.budget.create({ data: b });
  }

  // ===== PHASE 4 DATA =====

  // 42. Email Campaigns
  const EMAIL_DATA = [
    { name: "Q3 Product Launch Newsletter", subject: "Introducing Magnence OS Phase 4", content: "We're thrilled to announce...", status: "sent", sentAt: new Date(Date.now() - 5 * 86400000), recipients: 5200, delivered: 5100, opened: 2346, clicked: 892, bounced: 100, unsubscribed: 15 },
    { name: "Welcome Series - Day 1", subject: "Welcome to Magnence!", content: "Getting started guide...", status: "sent", sentAt: new Date(Date.now() - 10 * 86400000), recipients: 890, delivered: 880, opened: 534, clicked: 234, bounced: 10, unsubscribed: 3 },
    { name: "Monthly Tips & Best Practices", subject: "10 Ways to Boost Productivity", content: "This month's top tips...", status: "scheduled", scheduledAt: new Date(Date.now() + 3 * 86400000), recipients: 0 },
    { name: "Black Friday Early Access", subject: "Exclusive Black Friday Deals", content: "Early access for valued customers...", status: "draft" },
    { name: "Customer Success Story - Acme", subject: "How Acme Corp scaled with Magnence", content: "Read the full case study...", status: "sent", sentAt: new Date(Date.now() - 20 * 86400000), recipients: 3400, delivered: 3350, opened: 1672, clicked: 580, bounced: 50, unsubscribed: 8 },
  ];
  for (const e of EMAIL_DATA) {
    await db.emailCampaign.create({ data: e });
  }

  // 43. Landing Pages
  const LANDING_DATA = [
    { title: "Magnence OS Platform Tour", slug: "platform-tour", headline: "See Magnence OS in Action", subheadline: "Take a 5-minute tour of the unified workspace", ctaText: "Watch Demo", status: "published", views: 12400, conversions: 842 },
    { title: "Free Trial Signup", slug: "free-trial", headline: "Start Your 14-Day Free Trial", subheadline: "No credit card required", ctaText: "Start Free Trial", status: "published", views: 8900, conversions: 1240 },
    { title: "Enterprise Demo Request", slug: "enterprise-demo", headline: "Schedule Your Enterprise Demo", subheadline: "Custom walkthrough for your team", ctaText: "Book Demo", status: "published", views: 3200, conversions: 186 },
    { title: "Q4 Webinar Registration", slug: "q4-webinar", headline: "Join Our Q4 Product Roadmap Webinar", subheadline: "Live on July 20th", ctaText: "Register Now", status: "published", views: 5600, conversions: 423 },
    { title: "AI in Business Ebook", slug: "ai-ebook", headline: "Free Ebook: AI-Powered Business Transformation", subheadline: "Download our 50-page guide", ctaText: "Download", status: "draft", views: 0, conversions: 0 },
  ];
  for (const l of LANDING_DATA) {
    await db.landingPage.create({ data: l });
  }

  // 44. SEO Keywords
  const SEO_DATA = [
    { keyword: "unified workspace platform", url: "/platform", position: 3, previousPosition: 5, searchVolume: 4400, difficulty: 45, status: "improving" },
    { keyword: "AI business assistant", url: "/ai-assistant", position: 7, previousPosition: 9, searchVolume: 8100, difficulty: 62, status: "improving" },
    { keyword: "company management software", url: "/", position: 12, previousPosition: 10, searchVolume: 6600, difficulty: 55, status: "declining" },
    { keyword: "CRM and project management", url: "/crm", position: 5, previousPosition: 5, searchVolume: 3300, difficulty: 48, status: "tracking" },
    { keyword: "team collaboration tool", url: "/", position: 8, previousPosition: 6, searchVolume: 12100, difficulty: 68, status: "declining" },
    { keyword: "marketing automation platform", url: "/marketing", position: 4, previousPosition: 7, searchVolume: 9900, difficulty: 65, status: "improving" },
    { keyword: "employee management system", url: "/employees", position: 2, previousPosition: 2, searchVolume: 5400, difficulty: 40, status: "tracking" },
    { keyword: "business intelligence dashboard", url: "/reports", position: 15, previousPosition: 18, searchVolume: 7200, difficulty: 58, status: "improving" },
    { keyword: "social media management tool", url: "/social", position: 6, previousPosition: 6, searchVolume: 14800, difficulty: 70, status: "tracking" },
    { keyword: "workflow automation software", url: "/workflows", position: 9, previousPosition: 11, searchVolume: 3600, difficulty: 50, status: "improving" },
  ];
  for (const s of SEO_DATA) {
    await db.sEOKeyword.create({ data: s });
  }

  // 45. Ad Campaigns
  const AD_DATA = [
    { name: "Google Search - SaaS Keywords", platform: "google", status: "active", budget: 15000, spent: 9200, impressions: 245000, clicks: 4200, conversions: 186, startDate: new Date(Date.now() - 30 * 86400000) },
    { name: "Meta Ads - Brand Awareness", platform: "meta", status: "active", budget: 8000, spent: 5400, impressions: 420000, clicks: 3800, conversions: 95, startDate: new Date(Date.now() - 20 * 86400000) },
    { name: "LinkedIn Ads - B2B Targeting", platform: "linkedin", status: "active", budget: 12000, spent: 10800, impressions: 180000, clicks: 2100, conversions: 142, startDate: new Date(Date.now() - 45 * 86400000) },
    { name: "X Ads - Product Launch", platform: "x", status: "paused", budget: 5000, spent: 3200, impressions: 95000, clicks: 1200, conversions: 38, startDate: new Date(Date.now() - 15 * 86400000) },
    { name: "Google Display - Retargeting", platform: "google", status: "active", budget: 6000, spent: 4100, impressions: 580000, clicks: 2800, conversions: 72, startDate: new Date(Date.now() - 25 * 86400000) },
    { name: "Meta Ads - Summer Campaign", platform: "meta", status: "draft", budget: 10000, spent: 0, impressions: 0, clicks: 0, conversions: 0 },
  ];
  for (const a of AD_DATA) {
    await db.adCampaign.create({ data: a });
  }

  // 46. Events
  const EVENT_DATA = [
    { title: "Q4 Product Roadmap Webinar", description: "Join us for a live walkthrough of our Q4 product roadmap.", type: "webinar", startDate: new Date(Date.now() + 7 * 86400000 + 14 * 3600000), endDate: new Date(Date.now() + 7 * 86400000 + 15 * 3600000), location: "Zoom", capacity: 500, registered: 342, attended: 0, status: "upcoming" },
    { title: "AI in Business Workshop", description: "Hands-on workshop on implementing AI in your business.", type: "workshop", startDate: new Date(Date.now() + 14 * 86400000 + 10 * 3600000), endDate: new Date(Date.now() + 14 * 86400000 + 12 * 3600000), location: "Bangalore HQ", capacity: 50, registered: 38, attended: 0, status: "upcoming" },
    { title: "Magnence OS Phase 4 Launch", description: "Virtual launch event for Phase 4 marketing modules.", type: "product_launch", startDate: new Date(Date.now() + 21 * 86400000 + 16 * 3600000), endDate: new Date(Date.now() + 21 * 86400000 + 17 * 3600000), location: "YouTube Live", capacity: 2000, registered: 890, attended: 0, status: "upcoming" },
    { title: "Q3 All-Hands Meeting", description: "Company-wide quarterly review.", type: "company_event", startDate: new Date(Date.now() + 5 * 86400000 + 11 * 3600000), endDate: new Date(Date.now() + 5 * 86400000 + 12 * 3600000), location: "Main Hall", capacity: 200, registered: 150, attended: 0, status: "upcoming" },
    { title: "Customer Success Webinar", description: "How Acme Corp scaled with Magnence OS.", type: "webinar", startDate: new Date(Date.now() - 7 * 86400000 + 14 * 3600000), endDate: new Date(Date.now() - 7 * 86400000 + 15 * 3600000), location: "Zoom", capacity: 500, registered: 423, attended: 312, status: "completed" },
  ];
  for (const e of EVENT_DATA) {
    await db.event.create({ data: e });
  }

  // 47. Content Assets
  const CONTENT_DATA = [
    { name: "Magnence Logo Pack", type: "logo", category: "brand", url: "/uploads/logo-pack.zip", size: 2400000, status: "approved", tags: "logo,brand,svg" },
    { name: "Brand Guidelines 2025", type: "document", category: "brand", url: "/uploads/brand-guidelines.pdf", size: 3400000, status: "approved", tags: "guidelines,brand" },
    { name: "Product Launch Video", type: "video", category: "marketing", url: "/uploads/launch-video.mp4", size: 45000000, status: "approved", tags: "video,launch" },
    { name: "Summer Campaign Banner", type: "image", category: "ad", url: "/uploads/summer-banner.png", size: 540000, status: "published", tags: "banner,summer,ad" },
    { name: "LinkedIn Post Template", type: "template", category: "social", url: "/uploads/linkedin-template.psd", size: 8900000, status: "approved", tags: "template,linkedin" },
    { name: "Instagram Story Template", type: "template", category: "social", url: "/uploads/story-template.psd", size: 6700000, status: "draft", tags: "template,instagram" },
    { name: "Email Newsletter Template", type: "template", category: "marketing", url: "/uploads/email-template.html", size: 45000, status: "approved", tags: "template,email" },
    { name: "Product Demo Screenshots", type: "image", category: "marketing", url: "/uploads/screenshots.zip", size: 12000000, status: "approved", tags: "screenshots,product" },
    { name: "Brand Color Palette", type: "graphic", category: "brand", url: "/uploads/palette.png", size: 120000, status: "approved", tags: "colors,brand" },
    { name: "Conference Presentation Deck", type: "document", category: "marketing", url: "/uploads/deck.pdf", size: 8900000, status: "review", tags: "presentation,deck" },
  ];
  for (const c of CONTENT_DATA) {
    await db.contentAsset.create({ data: { ...c, authorId: users.find((u) => u.role === "CMO")?.id || users[0].id } });
  }

  // 48. Social Inbox Messages
  const INBOX_DATA = [
    { platform: "linkedin", type: "message", authorName: "Sarah Mitchell", authorHandle: "@sarahm", content: "Love what Magnence is doing! Can we schedule a demo for our team?", status: "unread", sentiment: "positive" },
    { platform: "twitter", type: "mention", authorName: "Tech Reviewer", authorHandle: "@techrev", content: "Just tried @magnenceapp and it's incredible. The AI assistant alone is worth it.", status: "read", sentiment: "positive" },
    { platform: "instagram", type: "comment", authorName: "John Davis", authorHandle: "@johnd", content: "How does the pricing work for startups?", status: "unread", sentiment: "neutral" },
    { platform: "linkedin", type: "comment", authorName: "Emily Chen", authorHandle: "@emilyc", content: "This looks promising! Looking forward to trying it out.", status: "read", sentiment: "positive" },
    { platform: "twitter", type: "mention", authorName: "Competitor Watch", authorHandle: "@compwatch", content: "Magnence vs CompetitorX — who wins? Our latest comparison.", status: "assigned", sentiment: "neutral" },
    { platform: "facebook", type: "review", authorName: "Michael Brown", authorHandle: null, content: "Great platform but would love dark mode support.", status: "unread", sentiment: "neutral" },
    { platform: "instagram", type: "comment", authorName: "Lisa Wang", authorHandle: "@lisaw", content: "The new marketing dashboard is a game changer!", status: "replied", sentiment: "positive" },
    { platform: "twitter", type: "mention", authorName: "Frustrated User", authorHandle: "@frustuser", content: "Having issues with the login page. Anyone else?", status: "unread", sentiment: "negative" },
  ];
  for (const i of INBOX_DATA) {
    await db.socialInboxMessage.create({ data: { ...i, createdAt: new Date(Date.now() - Math.random() * 48 * 3600000) } });
  }

  // 49. Website Metrics (last 30 days)
  const TRAFFIC_SOURCES = ["organic", "direct", "social", "referral", "email", "paid"];
  for (let d = 29; d >= 0; d--) {
    const date = new Date();
    date.setDate(date.getDate() - d);
    date.setHours(0, 0, 0, 0);
    for (const src of TRAFFIC_SOURCES) {
      const baseVisitors = src === "organic" ? 450 : src === "direct" ? 280 : src === "social" ? 180 : src === "paid" ? 150 : 80;
      const visitors = baseVisitors + Math.floor(Math.random() * 100);
      await db.websiteMetric.create({
        data: {
          date,
          visitors,
          sessions: Math.round(visitors * 1.3),
          pageViews: Math.round(visitors * 3.2),
          bounceRate: 35 + Math.random() * 25,
          avgSessionDuration: 120 + Math.floor(Math.random() * 300),
          trafficSource: src,
        },
      });
    }
  }

  // 50. Brand Mentions
  const MENTION_DATA = [
    { source: "twitter", authorName: "SaaS Reviews", content: "Magnence OS just keeps getting better. Phase 4 is a beast.", url: "twitter.com/saasreviews", sentiment: "positive", isCompetitor: false },
    { source: "reddit", authorName: "u/entrepreneur123", content: "Has anyone tried Magnence? Looking for a unified workspace for my team of 20.", url: "reddit.com/r/entrepreneur", sentiment: "neutral", isCompetitor: false },
    { source: "news", authorName: "TechCrunch", content: "Magnence raises Series B to expand AI-powered business platform.", url: "techcrunch.com/magnence-series-b", sentiment: "positive", isCompetitor: false },
    { source: "blog", authorName: "Product Hunt Blog", content: "Magnence OS named Product of the Month.", url: "producthunt.com/blog/magnence", sentiment: "positive", isCompetitor: false },
    { source: "twitter", authorName: "CompetitorX", content: "Why CompetitorX is the best alternative to Magnence.", url: "twitter.com/competitorx", sentiment: "neutral", isCompetitor: true, competitorName: "CompetitorX" },
    { source: "reddit", authorName: "u/decision_maker", content: "Comparing Magnence vs CompetitorX for our enterprise. Any thoughts?", url: "reddit.com/r/business", sentiment: "neutral", isCompetitor: true, competitorName: "CompetitorX" },
    { source: "review", authorName: "G2 User", content: "Great platform but customer support could be faster.", url: "g2.com/magnence", sentiment: "neutral", isCompetitor: false },
    { source: "twitter", authorName: "Happy Customer", content: "Switched from CompetitorY to Magnence. Best decision ever!", url: "twitter.com/happycust", sentiment: "positive", isCompetitor: true, competitorName: "CompetitorY" },
  ];
  for (const m of MENTION_DATA) {
    await db.brandMention.create({ data: { ...m, createdAt: new Date(Date.now() - Math.random() * 7 * 86400000) } });
  }

  // ==================== PHASE 5 SEED DATA ====================

  // 51. Integrations
  const INTEGRATIONS = [
    { name: "stripe", displayName: "Stripe", category: "payment", description: "Accept payments, subscriptions, and invoices online.", connected: true },
    { name: "paypal", displayName: "PayPal", category: "payment", description: "Send and receive payments globally via PayPal.", connected: false },
    { name: "slack", displayName: "Slack", category: "communication", description: "Bring team chat and notifications into your workspace.", connected: true },
    { name: "microsoft-teams", displayName: "Microsoft Teams", category: "communication", description: "Chat, meet, and collaborate inside Microsoft Teams.", connected: false },
    { name: "zoom", displayName: "Zoom", category: "communication", description: "Schedule and launch video meetings instantly.", connected: true },
    { name: "google-workspace", displayName: "Google Workspace", category: "productivity", description: "Gmail, Drive, Calendar, and Docs integration.", connected: true },
    { name: "microsoft-365", displayName: "Microsoft 365", category: "productivity", description: "Outlook, OneDrive, Word, Excel, and PowerPoint.", connected: false },
    { name: "google-analytics", displayName: "Google Analytics", category: "analytics", description: "Track website traffic, conversions, and audience.", connected: false },
    { name: "mixpanel", displayName: "Mixpanel", category: "analytics", description: "Product analytics with event-based funnels and retention.", connected: false },
    { name: "hubspot", displayName: "HubSpot", category: "crm", description: "Sync contacts, deals, and marketing automation.", connected: false },
    { name: "salesforce", displayName: "Salesforce", category: "crm", description: "Enterprise CRM syncing for accounts and opportunities.", connected: false },
    { name: "zapier", displayName: "Zapier", category: "automation", description: "Connect 5,000+ apps with no-code automated workflows.", connected: false },
    { name: "make", displayName: "Make", category: "automation", description: "Visual automation builder for complex multi-app scenarios.", connected: false },
  ];
  for (const i of INTEGRATIONS) {
    await db.integration.create({
      data: {
        ...i,
        connectedAt: i.connected ? new Date(Date.now() - Math.random() * 30 * 86400000) : null,
      },
    });
  }

  // 52. API Keys
  const API_KEYS = [
    { name: "Production API", permissions: ["tasks:view", "tasks:create", "deals:view", "invoices:view"], active: true, key: `mag_${Date.now()}_prod${Math.random().toString(36).slice(2, 8)}` },
    { name: "Development API", permissions: ["tasks:view", "projects:view"], active: true, key: `mag_${Date.now() - 86400000}_dev${Math.random().toString(36).slice(2, 8)}` },
    { name: "Mobile App API", permissions: ["tasks:view", "calendar:view", "notifications:view"], active: false, key: `mag_${Date.now() - 2 * 86400000}_mob${Math.random().toString(36).slice(2, 8)}` },
  ];
  for (const k of API_KEYS) {
    await db.apiKey.create({
      data: {
        name: k.name,
        key: k.key,
        permissions: JSON.stringify(k.permissions),
        active: k.active,
        lastUsedAt: k.active ? new Date(Date.now() - Math.random() * 7 * 86400000) : null,
        createdBy: users[0]?.id,
      },
    });
  }

  // 53. Webhooks
  const WEBHOOKS = [
    { name: "Slack Notifications", url: "https://example.com/webhook/slack", events: ["task.created", "task.completed", "ticket.created"], secret: "", active: true, deliveryCount: 1247 },
    { name: "Zapier Sync", url: "https://example.com/webhook/zapier", events: ["deal.created", "deal.won", "invoice.paid"], secret: "", active: true, deliveryCount: 532 },
    { name: "Custom Endpoint", url: "https://example.com/webhook/custom", events: ["announcement.posted", "user.invited"], secret: "", active: false, deliveryCount: 18 },
  ];
  for (const w of WEBHOOKS) {
    await db.webhook.create({
      data: {
        name: w.name,
        url: w.url,
        events: JSON.stringify(w.events),
        secret: w.secret,
        active: w.active,
        deliveryCount: w.deliveryCount,
        lastTriggeredAt: w.active ? new Date(Date.now() - Math.random() * 24 * 3600000) : null,
      },
    });
  }

  // 54. Custom Reports
  const CUSTOM_REPORTS = [
    { name: "Tasks by Status", description: "Count of tasks grouped by their workflow status.", type: "bar", dataSource: "tasks", groupBy: "status", metric: "count", valueField: null },
    { name: "Revenue by Month", description: "Total invoice value trend over time.", type: "line", dataSource: "invoices", groupBy: "status", metric: "sum", valueField: "total" },
    { name: "Deals by Stage", description: "Distribution of deals across pipeline stages.", type: "pie", dataSource: "deals", groupBy: "stage", metric: "count", valueField: null },
    { name: "Expenses by Category", description: "Sum of expenses grouped by category.", type: "bar", dataSource: "expenses", groupBy: "category", metric: "sum", valueField: "amount" },
  ];
  for (const r of CUSTOM_REPORTS) {
    await db.customReport.create({
      data: { ...r, createdBy: users[0]?.id },
    });
  }

  // 55. Onboarding Steps
  const ONBOARDING_STEPS = [
    { title: "Complete your profile", description: "Add your photo, role, and contact details so teammates can find you.", category: "getting_started", link: "settings", order: 1, completed: true },
    { title: "Create your first task", description: "Get hands-on with the Tasks module and assign yourself something to do.", category: "getting_started", link: "tasks", order: 2, completed: true },
    { title: "Connect a social account", description: "Link Instagram, LinkedIn, or X to start publishing from Magnence.", category: "setup", link: "social", order: 3, completed: false },
    { title: "Invite team members", description: "Bring your team on board so you can collaborate in real time.", category: "setup", link: "admin", order: 4, completed: false },
    { title: "Explore AI Assistant", description: "Try the specialized AI agents for sales, marketing, finance, and more.", category: "advanced", link: "assistant", order: 5, completed: false },
    { title: "Set up your first project", description: "Create a project, add milestones, and assign tasks to your team.", category: "advanced", link: "projects", order: 6, completed: false },
  ];
  for (const s of ONBOARDING_STEPS) {
    await db.onboardingStep.create({ data: s });
  }

  // 56. Video Tutorials
  const TUTORIALS = [
    { title: "Getting Started with Magnence OS", description: "A 5-minute tour of the dashboard, sidebar, and core modules.", category: "getting_started", duration: 300, views: 12834 },
    { title: "Task Management Deep Dive", description: "Master tasks, subtasks, priorities, and checklists in 8 minutes.", category: "tasks", duration: 480, views: 8721 },
    { title: "CRM Basics", description: "Learn how to manage leads, contacts, and deals through the pipeline.", category: "crm", duration: 600, views: 6543 },
    { title: "Finance Overview", description: "Invoices, expenses, budgets, and payments — everything in 12 minutes.", category: "finance", duration: 720, views: 4982 },
    { title: "Marketing Automation", description: "Build automated campaigns across email, social, and ads.", category: "marketing", duration: 900, views: 7210 },
    { title: "AI Assistants Explained", description: "Meet the 13 specialized AI agents and learn when to use each one.", category: "ai", duration: 420, views: 15392 },
  ];
  for (const t of TUTORIALS) {
    await db.videoTutorial.create({
      data: {
        title: t.title,
        description: t.description,
        category: t.category,
        videoUrl: `https://learn.magnence.com/videos/${t.title.toLowerCase().replace(/\s+/g, "-")}`,
        thumbnailUrl: `https://learn.magnence.com/thumbnails/${t.title.toLowerCase().replace(/\s+/g, "-")}.jpg`,
        duration: t.duration,
        views: t.views,
      },
    });
  }

  // 57. Data Exports
  const DATA_EXPORTS = [
    { name: "Full Backup", type: "full", modules: [], format: "csv", status: "completed", rowCount: 4823, fileSize: 4823 * 200 },
    { name: "Q3 Reports", type: "partial", modules: ["invoices", "expenses", "deals"], format: "xlsx", status: "completed", rowCount: 1278, fileSize: 1278 * 200 },
    { name: "Contacts Export", type: "partial", modules: ["contacts", "companies"], format: "csv", status: "completed", rowCount: 654, fileSize: 654 * 200 },
  ];
  for (const ex of DATA_EXPORTS) {
    await db.dataExport.create({
      data: {
        name: ex.name,
        type: ex.type,
        modules: JSON.stringify(ex.modules),
        format: ex.format,
        status: ex.status,
        fileUrl: `/exports/${encodeURIComponent(ex.name)}.${ex.format}`,
        rowCount: ex.rowCount,
        fileSize: ex.fileSize,
        createdBy: users[0]?.id,
      },
    });
  }

  // ============ PHASE 6: AI INTELLIGENCE ============

  // 58. AI Knowledge Brain
  const AI_KNOWLEDGE = [
    {
      title: "Onboarding New Employees SOP",
      content:
        "1. Send welcome email with first-day instructions and login credentials.\n2. Assign buddy from same team.\n3. Schedule Week-1 orientation: HR induction, IT setup, team lunch.\n4. Provide access to Magnence OS modules based on role.\n5. Schedule 30-day check-in with manager and HR.\n6. Review probation progress at 60 and 90 days.",
      category: "sop",
      department: "Human Resources",
      tags: "onboarding,hiring,hr",
      source: "HR Handbook v3.2",
      confidence: 0.97,
    },
    {
      title: "Remote Work Policy",
      content:
        "Employees may work remotely up to 3 days per week with manager approval. Core hours 10am-4pm IST apply. Equipment stipend of ₹25,000/year available for home office setup. Quarterly in-office meetups are mandatory. Remote employees must maintain a stable internet connection (>= 20 Mbps) and be reachable during core hours.",
      category: "policy",
      department: "Human Resources",
      tags: "remote,work-from-home,policy",
      source: "Company Policy Document",
      confidence: 0.95,
    },
    {
      title: "Employee Handbook — Code of Conduct",
      content:
        "All employees must adhere to the company Code of Conduct: respect for colleagues, customers, and partners; confidentiality of company data; compliance with all applicable laws; prompt reporting of conflicts of interest. Violations may result in disciplinary action up to and including termination.",
      category: "handbook",
      department: "Leadership",
      tags: "conduct,ethics,handbook",
      source: "Employee Handbook 2024",
      confidence: 1.0,
    },
    {
      title: "Sales Discovery Call Training",
      content:
        "Goal: uncover BANT (Budget, Authority, Need, Timeline) within the first 20 minutes. Open with a 2-min company overview, then ask discovery questions: 'What initiatives are you prioritizing this quarter?', 'Who else is involved in this decision?', 'What budget has been allocated?', 'When do you need this live by?'. Take detailed notes in CRM after the call.",
      category: "training",
      department: "Sales",
      tags: "sales,discovery,training",
      source: "Sales Enablement Library",
      confidence: 0.92,
    },
    {
      title: "Expense Reimbursement Process",
      content:
        "1. Submit expense within 30 days of incurring.\n2. Attach itemized receipt (PDF/JPG).\n3. Select correct expense category and project code.\n4. Manager approves within 5 business days.\n5. Finance processes reimbursement in next payroll cycle (1st of month).\n6. Reimbursements > ₹50,000 require additional Director approval.",
      category: "process",
      department: "Finance",
      tags: "expense,reimbursement,finance",
      source: "Finance SOPs",
      confidence: 0.94,
    },
    {
      title: "Magnence OS API Authentication",
      content:
        "All API requests require a Bearer token in the Authorization header. Tokens are generated in Advanced Settings → API Keys and follow the format mag_<timestamp>_<random>. Tokens can be scoped per-module and revoked at any time. Rate limit: 1000 requests/min per token. Webhooks sign payloads with HMAC-SHA256 using your webhook secret.",
      category: "technical",
      department: "Engineering",
      tags: "api,auth,security,technical",
      source: "Developer Documentation",
      confidence: 0.99,
    },
    {
      title: "How do I reset my password?",
      content:
        "Click 'Forgot password' on the login page, enter your work email, and a reset link will be sent within 1 minute. The link expires in 60 minutes. If you don't receive an email, check spam or contact IT at it@magnence.com. For security reasons, support cannot reset passwords over chat.",
      category: "faq",
      department: "Engineering",
      tags: "password,reset,login,faq",
      source: "Help Center FAQ",
      confidence: 0.96,
    },
    {
      title: "Leave Policy & Accrual",
      content:
        "Full-time employees accrue 1.66 paid leave days per month (20/year). Sick leave: 12 days/year. Casual leave: 6 days/year. Unused paid leave carries forward up to 30 days. Maternity: 26 weeks paid. Paternity: 2 weeks paid. All leave requests require manager approval via the Leave module at least 3 days in advance (except emergencies).",
      category: "policy",
      department: "Human Resources",
      tags: "leave,policy,holiday,hr",
      source: "HR Policy Document",
      confidence: 0.98,
    },
  ];
  for (const k of AI_KNOWLEDGE) {
    await db.aIKnowledge.create({ data: k });
  }

  // 59. Smart Recommendations
  const RECOMMENDATIONS = [
    {
      type: "employee",
      category: "task",
      title: "You have 3 overdue tasks this week",
      description: "Three of your tasks are past due date. Reassigning or rescheduling them will unblock your team's velocity.",
      priority: "high",
      action: "Review and reschedule overdue tasks in the Tasks module",
      link: "tasks",
    },
    {
      type: "employee",
      category: "workload",
      title: "Your workload is 18% above team average",
      description: "You have 12 active tasks vs the team average of 10. Consider delegating 2 tasks or asking your manager for support.",
      priority: "medium",
      action: "Open Tasks and filter by assignee = me",
      link: "tasks",
    },
    {
      type: "manager",
      category: "performance",
      title: "2 team members underutilized this sprint",
      description: "Ananya and Lena have < 6 active tasks while the team average is 10. Reassign work or assign stretch goals.",
      priority: "medium",
      action: "Review team workload in Reports",
      link: "reporting",
    },
    {
      type: "manager",
      category: "risk",
      title: "Project 'Website Redesign' is 14 days behind schedule",
      description: "Based on milestone completion rate, this project is at risk of missing the Q4 deadline. 3 milestones are overdue.",
      priority: "critical",
      action: "Open the project and reschedule overdue milestones",
      link: "projects",
    },
    {
      type: "executive",
      category: "growth",
      title: "Q4 revenue is tracking 12% above forecast",
      description: "At current close rate, Q4 revenue will exceed target by $48K. Consider accelerating 2 stalled deals to capitalize on momentum.",
      priority: "high",
      action: "Review the Sales pipeline dashboard",
      link: "business-intelligence",
    },
    {
      type: "executive",
      category: "cost",
      title: "Cloud spend up 22% month-over-month",
      description: "Infrastructure expenses grew from $14K to $17K. AI service usage is the primary driver. Review auto-scaling rules.",
      priority: "medium",
      action: "Review expenses in Finance module",
      link: "finance",
    },
  ];
  for (const r of RECOMMENDATIONS) {
    await db.recommendation.create({ data: r });
  }

  // 60. AI Feedback
  const AI_FEEDBACK = [
    {
      agentType: "productivity",
      message: "What should I work on today?",
      response: "Based on your tasks and priorities, focus on: 1) Finalize Q4 budget review (due today), 2) Review 3 PRs blocked on your approval, 3) Prep for 2pm client call with Acme Corp.",
      rating: 5,
      feedback: "Exactly what I needed — saved me 15 minutes of triage.",
      userId: users[0]?.id,
    },
    {
      agentType: "sales",
      message: "Forecast Q3 revenue",
      response: "Based on pipeline probability, Q3 forecast is $312K (best case $380K, worst case $245K). Three deals in negotiation account for 64% of upside.",
      rating: 4,
      feedback: "Good forecast but would like more detail on downside risk.",
      userId: users[2]?.id,
    },
    {
      agentType: "marketing",
      message: "Generate 5 Instagram captions for our product launch",
      response: "1) Big things are here. Meet the all-new Magnence OS ✨ 2) Less tools, more done. Try Magnence today. 3) Your team's new favorite workspace 💛 4) Launch day is here! 🚀 5) Imagine. Create. Engineer. Elevate — that's Magnence.",
      rating: 5,
      feedback: "Loved options 1 and 4 — posting immediately!",
      userId: users[7]?.id,
    },
    {
      agentType: "finance",
      message: "Analyze our expenses this quarter",
      response: "Q3 expenses totaled $187K, up 8% QoQ. Top 3 categories: Salaries (62%), Cloud Infrastructure (14%), Marketing (11%). Anomaly detected: Travel up 47% due to client on-site visits.",
      rating: 4,
      feedback: "Helpful breakdown. Could you suggest optimizations next time?",
      userId: users[0]?.id,
    },
  ];
  for (const f of AI_FEEDBACK) {
    await db.aIFeedback.create({ data: f });
  }

  // 61. Prompt Templates
  const PROMPT_TEMPLATES = [
    {
      name: "Weekly Status Report",
      agentType: "actions",
      content: "Generate a weekly status report for the {{team}} team covering: tasks completed, in-progress, blocked, and key wins. Format as a Slack-friendly summary with bullet points.",
      category: "reporting",
    },
    {
      name: "Discovery Call Prep",
      agentType: "sales",
      content: "Prepare me for a discovery call with {{company}} in the {{industry}} industry. Suggest 5 discovery questions, 3 relevant case studies, and 2 objection-handling talking points.",
      category: "coaching",
    },
    {
      name: "Content Calendar Generator",
      agentType: "marketing",
      content: "Create a 4-week content calendar for {{channel}} focused on {{topic}}. Include post ideas, captions, hashtags, and best posting times per day of week.",
      category: "planning",
    },
    {
      name: "Expense Anomaly Detector",
      agentType: "finance",
      content: "Analyze expenses from the last {{period}}. Flag any category that deviates more than 20% from its 3-month average. Provide root-cause hypotheses for each anomaly.",
      category: "analysis",
    },
  ];
  for (const t of PROMPT_TEMPLATES) {
    await db.promptTemplate.create({
      data: { ...t, usage: Math.floor(Math.random() * 50) + 5 },
    });
  }

  // 62. System Health
  const SYSTEM_HEALTH = [
    { component: "server", status: "healthy", uptime: 99.95, responseTime: 42, details: "CPU 23%, Memory 47%, 8/8 nodes online" },
    { component: "database", status: "healthy", uptime: 99.99, responseTime: 18, details: "Primary + 2 replicas, 0 slow queries" },
    { component: "storage", status: "degraded", uptime: 99.5, responseTime: 120, details: "Disk usage 87% — auto-cleanup scheduled" },
    { component: "ai_service", status: "healthy", uptime: 99.9, responseTime: 320, details: "All 8 agents operational, avg latency 320ms" },
    { component: "queue", status: "healthy", uptime: 100.0, responseTime: 8, details: "0 jobs pending, 142 processed today" },
  ];
  for (const h of SYSTEM_HEALTH) {
    await db.systemHealth.create({ data: h });
  }

  // 63. Backups
  const BACKUPS = [
    { name: "Daily Auto Backup", type: "automatic", size: 247_000_000, modules: JSON.stringify([]) },
    { name: "Pre-Launch Snapshot", type: "manual", size: 312_000_000, modules: JSON.stringify(["tasks", "projects", "users", "companies"]) },
    { name: "Weekly Auto Backup", type: "automatic", size: 389_000_000, modules: JSON.stringify([]) },
    { name: "Finance Module Snapshot", type: "manual", size: 78_000_000, modules: JSON.stringify(["invoices", "expenses", "budgets"]) },
  ];
  for (const b of BACKUPS) {
    await db.backup.create({
      data: {
        name: b.name,
        type: b.type,
        size: b.size,
        status: "completed",
        modules: b.modules,
      },
    });
  }

  // 64. Predictions
  const PREDICTIONS = [
    {
      type: "project_delay",
      title: "Website Redesign at risk of 14-day delay",
      description: "Based on milestone completion velocity, this project will miss its Q4 deadline by 14 days unless 2 stalled milestones are unblocked this week.",
      probability: 0.78,
      impact: "high",
      timeframe: "14 days",
      status: "active",
    },
    {
      type: "sales_forecast",
      title: "Q4 sales will exceed target by 12%",
      description: "Pipeline coverage (3.4x) and current close rate (28%) indicate Q4 revenue will land at $412K vs the $365K target. Upside scenario: $460K if 2 stalled deals close.",
      probability: 0.84,
      impact: "high",
      timeframe: "Q4",
      status: "active",
    },
    {
      type: "revenue",
      title: "Annual revenue tracking $1.6M (vs $1.4M plan)",
      description: "Year-to-date revenue is $1.18M with 4 months remaining. At current run-rate, full-year revenue will reach $1.6M, exceeding plan by 14%.",
      probability: 0.91,
      impact: "high",
      timeframe: "FY2024",
      status: "active",
    },
    {
      type: "workload",
      title: "Engineering team will be over-capacity in 2 weeks",
      description: "Based on sprint commitments and PTO scheduled, engineering will be 124% allocated in weeks 47-48. Recommend deferring 2 features or hiring 1 contractor.",
      probability: 0.67,
      impact: "medium",
      timeframe: "2 weeks",
      status: "active",
    },
    {
      type: "ticket_volume",
      title: "Support ticket volume to spike 35% after launch",
      description: "Based on prior product launches, expect a 35% ticket surge in the 2 weeks following the v3.0 launch. Recommend pre-emptive staffing of 2 additional agents.",
      probability: 0.72,
      impact: "medium",
      timeframe: "Post-launch",
      status: "active",
    },
  ];
  for (const p of PREDICTIONS) {
    await db.prediction.create({ data: p });
  }


  // ===== CONTINUOUS IMPROVEMENT DATA =====

  // User Feedback
  const FEEDBACK_DATA = [
    { type: "feature", module: "tasks", rating: 5, title: "Love the kanban board!", description: "The drag-and-drop between columns is super smooth.", status: "open" },
    { type: "bug", module: "calendar", rating: 3, title: "Calendar doesn't show events on mobile", description: "Events are cut off on small screens.", status: "acknowledged" },
    { type: "ui", module: "dashboard", rating: 4, title: "Dashboard looks great but could use dark mode", description: "Would love a dark theme option.", status: "open" },
    { type: "ai", module: "assistant", rating: 5, title: "AI assistant is incredibly helpful", description: "The CRM AI gave me perfect lead scoring recommendations.", status: "resolved" },
    { type: "suggestion", module: "reports", rating: 4, title: "Add export to PDF for reports", description: "Would be great to export custom reports as PDF.", status: "open" },
    { type: "feature", module: "chat", rating: 5, title: "Slack-style chat is perfect", description: "Finally a unified chat that works across the company.", status: "open" },
  ];
  for (const f of FEEDBACK_DATA) { await db.userFeedback.create({ data: { ...f, userId: users[Math.floor(Math.random() * users.length)].id } }); }

  // Feature Requests
  const REQUEST_DATA = [
    { title: "Dark mode support", description: "Add a dark theme for the entire platform.", category: "feature", priority: "high", status: "planned", upvotes: 42 },
    { title: "Mobile app", description: "Native iOS and Android apps for Magnence OS.", category: "feature", priority: "critical", status: "in_progress", upvotes: 68 },
    { title: "Slack integration", description: "Two-way sync with Slack channels.", category: "integration", priority: "medium", status: "under_review", upvotes: 25 },
    { title: "Custom workflow builder", description: "Visual drag-and-drop workflow designer.", category: "feature", priority: "medium", status: "submitted", upvotes: 18 },
    { title: "API for external access", description: "Public API with rate limiting for integrations.", category: "feature", priority: "high", status: "planned", upvotes: 33 },
    { title: "Multi-language support", description: "Support Hindi, Spanish, French, and German.", category: "improvement", priority: "low", status: "submitted", upvotes: 12 },
  ];
  for (const r of REQUEST_DATA) { await db.featureRequest.create({ data: { ...r, userId: users[0].id } }); }

  // Product Metrics (30 days)
  for (let d = 29; d >= 0; d--) {
    const date = new Date(); date.setDate(date.getDate() - d); date.setHours(0, 0, 0, 0);
    const baseUsers = 8 + Math.floor(Math.random() * 7);
    await db.productMetric.create({ data: { date, activeUsers: baseUsers, newSignups: Math.floor(Math.random() * 3), sessions: baseUsers * 3 + Math.floor(Math.random() * 10), avgSessionDuration: 600 + Math.floor(Math.random() * 600), aiQueries: 5 + Math.floor(Math.random() * 20), tasksCompleted: 3 + Math.floor(Math.random() * 12), ticketsResolved: Math.floor(Math.random() * 5) } });
  }

  // Release Notes
  const RELEASE_DATA = [
    { version: "2.6.0", type: "stable", title: "Phase 6: AI Intelligence & Enterprise Management", summary: "AI Brain, Smart Recommendations, Business Intelligence, Predictive AI, AI Reports, System Monitoring, Security Center, and Backup & Recovery.", features: ["AI Brain knowledge hub", "Smart Recommendations", "Business Intelligence dashboard", "Predictive Intelligence", "AI Reports with insights", "System Monitoring", "Security Center", "Backup & Recovery"], bugFixes: ["Fixed 401 on productivity API", "Fixed toast import in ai-reporting"] },
    { version: "2.5.0", type: "stable", title: "Phase 5: Platform Intelligence & Integrations", summary: "Integration Hub, Advanced Settings, Custom Report Builder, Notification Center, Help & Onboarding, Data Exports.", features: ["13 integration connectors", "API Keys management", "Webhooks", "Custom Report Builder", "Help Center with onboarding", "Data Exports"], bugFixes: [] },
    { version: "2.4.0", type: "stable", title: "Phase 4: Marketing & Sales Operations", summary: "Complete marketing ecosystem with social media, content, email, SEO, ads, events, and brand monitoring.", features: ["Marketing Dashboard", "Content Studio", "Social Inbox", "Content Calendar", "Email Marketing", "Lead Generation", "Website Analytics", "SEO Management", "Ad Management", "Events", "Brand Monitoring", "Marketing Reports", "Sales Operations"], bugFixes: [] },
    { version: "2.3.0", type: "stable", title: "Phase 3: Business Operations Platform", summary: "CRM, Clients, Sales, Contracts, Finance, Procurement, Inventory, Workflows, Automation, and Business Reports.", features: ["CRM with leads/contacts/deals", "Client Management", "Sales quotations & proposals", "Contract lifecycle", "Finance with invoices/expenses/budgets", "Procurement & Vendors", "Inventory & Warehouses", "Workflow Automation", "Business Reports"], bugFixes: [] },
    { version: "2.2.1", type: "patch", title: "Bug fixes and performance improvements", summary: "Fixed sidebar navigation, improved AI response times, and resolved login redirect issues.", features: [], bugFixes: ["Fixed sidebar collapse on mobile", "Resolved AI timeout on large queries", "Fixed login redirect loop", "Improved dashboard loading speed"] },
    { version: "2.6.1-beta", type: "beta", title: "Continuous Improvement Beta", summary: "Feedback system, product analytics, testing dashboard, and success metrics.", features: ["User Feedback system", "Feature Requests with upvoting", "Product Analytics dashboard", "Testing Dashboard", "Success Metrics", "Release Management with feature flags", "Floating feedback widget"], bugFixes: [] },
  ];
  for (const r of RELEASE_DATA) { await db.releaseNote.create({ data: { ...r, changes: "[]", features: JSON.stringify(r.features), bugFixes: JSON.stringify(r.bugFixes), publishedAt: new Date(Date.now() - Math.random() * 60 * 86400000) } }); }

  // Test Results
  const TEST_DATA = [
    { suite: "unit", name: "auth.test.ts — password hashing", status: "passed", duration: 45 },
    { suite: "unit", name: "auth.test.ts — session creation", status: "passed", duration: 38 },
    { suite: "unit", name: "permissions.test.ts — role check", status: "passed", duration: 22 },
    { suite: "integration", name: "api/tasks — CRUD operations", status: "passed", duration: 340 },
    { suite: "integration", name: "api/crm — company creation", status: "passed", duration: 280 },
    { suite: "integration", name: "api/finance — invoice calculation", status: "failed", duration: 180, error: "Expected 11000 but got 11050 — tax calculation rounding error" },
    { suite: "e2e", name: "Login → Dashboard → Create Task", status: "passed", duration: 2400 },
    { suite: "e2e", name: "Create Deal → Convert to Client", status: "passed", duration: 3100 },
    { suite: "e2e", name: "AI Assistant → Get Response", status: "passed", duration: 8500 },
    { suite: "performance", name: "Dashboard load time < 2s", status: "passed", duration: 1200 },
    { suite: "performance", name: "API response < 200ms", status: "passed", duration: 145 },
    { suite: "performance", name: "AI response < 10s", status: "passed", duration: 8500 },
    { suite: "security", name: "SQL injection prevention", status: "passed", duration: 120 },
    { suite: "security", name: "XSS prevention", status: "passed", duration: 95 },
    { suite: "security", name: "CSRF token validation", status: "passed", duration: 67 },
    { suite: "ai", name: "SOP Agent — onboarding question", status: "passed", duration: 4200 },
    { suite: "ai", name: "CRM AI — lead scoring", status: "passed", duration: 5800 },
    { suite: "ai", name: "Marketing AI — caption generation", status: "passed", duration: 6200 },
    { suite: "ai", name: "AI hallucination check", status: "skipped", duration: 0 },
  ];
  for (const t of TEST_DATA) { await db.testResult.create({ data: { ...t, runAt: new Date(Date.now() - Math.random() * 6 * 3600000) } }); }

  // Feature Flags
  const FLAG_DATA = [
    { name: "dark_mode", description: "Dark theme support", enabled: false, rollout: 0 },
    { name: "mobile_app", description: "Mobile app companion", enabled: false, rollout: 10 },
    { name: "voice_assistant", description: "Voice commands for AI", enabled: false, rollout: 0 },
    { name: "advanced_search", description: "AI semantic search v2", enabled: true, rollout: 100 },
    { name: "real_time_collaboration", description: "Real-time document editing", enabled: false, rollout: 25 },
    { name: "api_marketplace", description: "Public API with rate limiting", enabled: true, rollout: 100 },
  ];
  for (const f of FLAG_DATA) { await db.featureFlag.create({ data: f }); }


  // ===== AI PROVIDERS =====
  const AI_PROVIDERS = [
    { name: "openai", displayName: "OpenAI", models: JSON.stringify(["gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "gpt-3.5-turbo"]), active: false, isDefault: false },
    { name: "anthropic", displayName: "Anthropic (Claude)", models: JSON.stringify(["claude-3-5-sonnet-20241022", "claude-3-5-haiku-20241022", "claude-3-opus-20240229"]), active: false, isDefault: false },
    { name: "gemini", displayName: "Google Gemini", models: JSON.stringify(["gemini-2.0-flash", "gemini-1.5-pro", "gemini-1.5-flash"]), active: false, isDefault: false },
    { name: "grok", displayName: "Grok (xAI)", models: JSON.stringify(["grok-2", "grok-2-mini", "grok-beta"]), active: false, isDefault: false },
    { name: "ollama", displayName: "Ollama (Local)", models: JSON.stringify(["llama3.1", "llama3", "mistral", "phi3", "qwen2.5"]), baseUrl: "http://localhost:11434", active: false, isDefault: false },
  ];
  for (const p of AI_PROVIDERS) { await db.aIProvider.create({ data: p }); }

  return NextResponse.json({
    ok: true,
    counts: {
      users: users.length,
      departments: DEPARTMENTS.length,
      teams: TEAMS.length,
      designations: DESIGNATIONS.length,
      offices: OFFICES.length,
      knowledgeBase: KB_ARTICLES.length,
      campaigns: CAMPAIGNS.length,
      leads: LEADS.length,
      socialAccounts: SOCIAL_ACCOUNTS.length,
      socialPosts: SOCIAL_POSTS.length,
      tickets: TICKETS.length,
      announcements: ANNOUNCEMENTS.length,
      calendarEvents: CALENDAR_EVENTS.length,
      documents: FOLDERS.length + SAMPLE_FILES.length,
      activity: actions.length,
      audit: auditActions.length,
      // Phase 2
      projects: PROJECT_DATA.length,
      tasks: TASK_DATA.length,
      meetings: MEETING_DATA.length,
      goals: GOAL_DATA.length,
      notes: NOTE_DATA.length,
      channels: CHANNEL_DATA.length,
      assets: ASSET_DATA.length,
      forms: FORM_DATA.length,
      // Phase 3
      companies: COMPANY_DATA.length,
      contacts: CONTACT_DATA.length,
      deals: DEAL_DATA.length,
      invoices: INVOICE_DATA.length,
      expenses: EXPENSE_DATA.length,
      contracts: CONTRACT_DATA.length,
      vendors: VENDOR_DATA.length,
      purchaseOrders: PO_DATA.length,
      inventoryItems: INVENTORY_DATA.length,
      workflows: WORKFLOW_DATA.length,
      automationRules: RULE_DATA.length,
      quotations: QUOTATION_DATA.length,
      proposals: PROPOSAL_DATA.length,
      budgets: BUDGET_DATA.length,
      // Phase 4
      emailCampaigns: EMAIL_DATA.length,
      landingPages: LANDING_DATA.length,
      seoKeywords: SEO_DATA.length,
      adCampaigns: AD_DATA.length,
      events: EVENT_DATA.length,
      contentAssets: CONTENT_DATA.length,
      socialInboxMessages: INBOX_DATA.length,
      brandMentions: MENTION_DATA.length,
      aiProviders: AI_PROVIDERS.length,
      feedback: FEEDBACK_DATA.length,
      featureRequests: REQUEST_DATA.length,
      releaseNotes: RELEASE_DATA.length,
      testResults: TEST_DATA.length,
      featureFlags: FLAG_DATA.length,
      // Phase 5
      integrations: INTEGRATIONS.length,
      apiKeys: API_KEYS.length,
      webhooks: WEBHOOKS.length,
      customReports: CUSTOM_REPORTS.length,
      onboardingSteps: ONBOARDING_STEPS.length,
      videoTutorials: TUTORIALS.length,
      dataExports: DATA_EXPORTS.length,
      // Phase 6
      aiKnowledge: AI_KNOWLEDGE.length,
      recommendations: RECOMMENDATIONS.length,
      aiFeedback: AI_FEEDBACK.length,
      promptTemplates: PROMPT_TEMPLATES.length,
      systemHealth: SYSTEM_HEALTH.length,
      backups: BACKUPS.length,
      predictions: PREDICTIONS.length,
    },
  });
}
