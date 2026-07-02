import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  source: z.string().optional().default("footer"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid email" },
        { status: 400 }
      );
    }

    const { email, source } = parsed.data;
    const ipAddress =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      null;

    // Upsert — if already subscribed, just update status back to active
    const subscriber = await db.newsletterSubscriber.upsert({
      where: { email },
      update: {
        status: "active",
        source,
        ipAddress,
        updatedAt: new Date(),
      },
      create: {
        email,
        status: "active",
        source,
        ipAddress,
      },
    });

    // Create notification in Magnence OS for marketing/admin users
    try {
      const marketingUsers = await db.user.findMany({
        where: {
          OR: [
            { role: { contains: "admin" } },
            { role: { contains: "marketing" } },
          ],
        },
        select: { id: true },
      });

      if (marketingUsers.length > 0) {
        await db.notification.createMany({
          data: marketingUsers.map((u) => ({
            userId: u.id,
            type: "system",
            title: `New newsletter subscriber`,
            body: `${email} subscribed via ${source}. Total active subscribers: check Newsletter stats.`,
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
          action: "NEWSLETTER_SUBSCRIBE",
          category: "system",
          target: `email:${email}`,
          meta: JSON.stringify({ source, subscriberId: subscriber.id }),
          ipAddress,
          createdAt: new Date(),
        },
      });
    } catch (notifErr) {
      console.error("[/api/newsletter] Notification failed:", notifErr);
    }

    return NextResponse.json({
      ok: true,
      id: subscriber.id,
      message: "You're subscribed! Watch your inbox for our next issue.",
    });
  } catch (err) {
    console.error("[/api/newsletter] Error:", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  // Admin-only: list subscribers
  try {
    const subscribers = await db.newsletterSubscriber.findMany({
      where: { status: "active" },
      orderBy: { createdAt: "desc" },
      take: 100,
      select: { id: true, email: true, source: true, createdAt: true, status: true },
    });
    return NextResponse.json({
      ok: true,
      subscribers,
      count: subscribers.length,
    });
  } catch (err) {
    console.error("[/api/newsletter GET] Error:", err);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch subscribers" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  // Unsubscribe
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    if (!email) {
      return NextResponse.json(
        { ok: false, error: "Email is required" },
        { status: 400 }
      );
    }
    await db.newsletterSubscriber.updateMany({
      where: { email },
      data: { status: "unsubscribed" },
    });
    return NextResponse.json({ ok: true, message: "Unsubscribed successfully" });
  } catch (err) {
    console.error("[/api/newsletter DELETE] Error:", err);
    return NextResponse.json(
      { ok: false, error: "Failed to unsubscribe" },
      { status: 500 }
    );
  }
}
