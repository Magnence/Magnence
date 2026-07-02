import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  company: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  service: z.string().min(1, "Service is required"),
  budget: z.string().min(1, "Budget is required"),
  timeline: z.string().min(1, "Timeline is required"),
  callTiming: z.string().min(1, "Preferred call timing is required"),
  message: z.string().min(20, "Message must be at least 20 characters").max(1000),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      return NextResponse.json(
        { ok: false, error: firstError?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Get IP and user agent for spam tracking
    const ipAddress =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      null;
    const userAgent = req.headers.get("user-agent") ?? null;

    // Save to database
    const lead = await db.websiteLead.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        company: data.company ?? null,
        phone: data.phone ?? null,
        service: data.service,
        budget: data.budget,
        timeline: data.timeline,
        callTiming: data.callTiming,
        message: data.message,
        status: "new",
        source: "website",
        ipAddress,
        userAgent,
      },
    });

    // Create notification in Magnence OS for sales/admin users
    try {
      const salesUsers = await db.user.findMany({
        where: {
          OR: [
            { role: { contains: "admin" } },
            { role: { contains: "sales" } },
            { role: { contains: "super" } },
          ],
        },
        select: { id: true },
      });

      if (salesUsers.length > 0) {
        await db.notification.createMany({
          data: salesUsers.map((u) => ({
            userId: u.id,
            type: "system",
            title: `New website lead: ${data.fullName}`,
            body: `Service: ${data.service} · Budget: ${data.budget} · Timeline: ${data.timeline} · Call: ${data.callTiming}. Email: ${data.email}${data.phone ? ` · Phone: ${data.phone}` : ""}`,
            link: null,
            read: false,
            createdAt: new Date(),
          })),
        });
      }
      // Always log to audit for backup
      await db.auditLog.create({
        data: {
          userId: null,
          action: "WEBSITE_LEAD",
          category: "system",
          target: `lead:${lead.id}`,
          meta: JSON.stringify({ name: data.fullName, email: data.email, service: data.service }),
          ipAddress,
          createdAt: new Date(),
        },
      });
    } catch (notifErr) {
      console.error("[/api/contact] Notification failed:", notifErr);
    }

    return NextResponse.json({
      ok: true,
      id: lead.id,
      message: "Thanks! We'll be in touch within 24 hours.",
    });
  } catch (err) {
    console.error("[/api/contact] Error:", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  // Admin-only: list recent leads
  // TODO: Add auth check in production
  try {
    const leads = await db.websiteLead.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return NextResponse.json({ ok: true, leads, count: leads.length });
  } catch (err) {
    console.error("[/api/contact GET] Error:", err);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}
