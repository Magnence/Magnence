import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month"); // YYYY-MM
  let where = {};
  if (month) {
    const start = new Date(`${month}-01T00:00:00`);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);
    where = {
      OR: [
        { startDate: { gte: start, lt: end } },
        { type: "holiday", startDate: { gte: start, lt: end } },
      ],
    };
  }
  const events = await db.calendarEvent.findMany({
    where,
    include: {
      organizer: { select: { id: true, name: true, avatarColor: true } },
      attendees: { include: { user: { select: { id: true, name: true, avatarColor: true } } } },
    },
    orderBy: { startDate: "asc" },
  });
  return NextResponse.json({ events });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { title, description, type, startDate, endDate, allDay, location, audience, recurrence, reminder } = body;
  if (!title || !startDate) {
    return NextResponse.json({ error: "Title and start date required" }, { status: 400 });
  }
  const event = await db.calendarEvent.create({
    data: {
      title,
      description,
      type: type || "meeting",
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      allDay: !!allDay,
      location,
      organizerId: user.id,
      audience: audience || "all",
      recurrence: recurrence || "none",
      reminder: reminder || null,
    },
  });
  return NextResponse.json({ event });
}

export async function DELETE(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await db.calendarEvent.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
