"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Calendar as CalIcon,
  Users as Meeting,
  PartyPopper,
  Cake,
  Flag,
  Video,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { EVENT_TYPES, RECURRENCE_OPTIONS } from "@/lib/constants";

interface CalEvent {
  id: string;
  title: string;
  description: string | null;
  type: string;
  startDate: string;
  endDate: string | null;
  allDay: boolean;
  location: string | null;
  organizer: { id: string; name: string; avatarColor: string } | null;
  audience: string;
  recurrence: string | null;
}

const TYPE_ICONS: Record<string, React.ElementType> = {
  meeting: Meeting,
  holiday: PartyPopper,
  company_event: Flag,
  birthday: Cake,
  anniversary: Cake,
  deadline: Flag,
};

const initials = (n: string) =>
  n.split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase();

export function CalendarModule() {
  const { hasPermission } = useAppStore();
  const [events, setEvents] = React.useState<CalEvent[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  const [showNew, setShowNew] = React.useState(false);
  const [filterType, setFilterType] = React.useState("all");
  const canCreate = hasPermission("calendar", "create");

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const monthStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}`;
      const res = await fetch(`/api/calendar?month=${monthStr}`);
      const data = await res.json();
      setEvents(data.events || []);
    } finally {
      setLoading(false);
    }
  }, [currentMonth]);

  React.useEffect(() => {
    load();
  }, [load]);

  const filtered = filterType === "all" ? events : events.filter((e) => e.type === filterType);

  // Build calendar grid
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startWeekday = firstDay.getDay(); // 0 = Sunday
  const daysInMonth = lastDay.getDate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const cells: (Date | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);

  const eventsForDay = (date: Date) => {
    return filtered.filter((e) => {
      const eDate = new Date(e.startDate);
      eDate.setHours(0, 0, 0, 0);
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      return eDate.getTime() === d.getTime();
    });
  };

  const upcoming = filtered
    .filter((e) => new Date(e.startDate) >= new Date())
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 5);

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));
  const goToday = () => setCurrentMonth(new Date());

  const deleteEvent = async (id: string) => {
    await fetch(`/api/calendar?id=${id}`, { method: "DELETE" });
    load();
    toast.success("Event deleted");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-black">Calendar</h2>
          <p className="text-sm text-zinc-600 mt-1">
            Meetings, holidays, company events, birthdays, anniversaries, deadlines.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={load} className="border-zinc-300">
            <RefreshCw className="h-4 w-4 mr-1.5" />
            Refresh
          </Button>
          {canCreate && (
            <Button
              onClick={() => setShowNew(true)}
              className="bg-[#f1c24e] text-black hover:bg-[#e9b73a] font-semibold"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              New Event
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Calendar grid */}
        <Card className="lg:col-span-3 border-zinc-200">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold capitalize">
                {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </h3>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={prevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={goToday} className="text-xs">Today</Button>
              <Button variant="ghost" size="sm" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div key={d} className="text-center text-xs font-semibold text-zinc-500 py-2">{d}</div>
              ))}
            </div>
            {/* Days */}
            <div className="grid grid-cols-7 gap-1">
              {cells.map((date, i) => {
                if (!date) return <div key={i} className="h-24 rounded-md bg-zinc-50/50" />;
                const dayEvents = eventsForDay(date);
                const isToday = date.getTime() === today.getTime();
                return (
                  <div
                    key={i}
                    className={`h-24 rounded-md border p-1 overflow-hidden ${
                      isToday ? "border-[#f1c24e] bg-[#fef8e7]" : "border-zinc-100 bg-white"
                    }`}
                  >
                    <div className={`text-xs font-medium ${isToday ? "text-[#c79a2e]" : "text-zinc-700"}`}>
                      {date.getDate()}
                    </div>
                    <div className="mt-1 space-y-0.5">
                      {dayEvents.slice(0, 3).map((e) => {
                        const meta = EVENT_TYPES.find((t) => t.id === e.type);
                        return (
                          <div
                            key={e.id}
                            className="text-[10px] px-1 py-0.5 rounded truncate text-white"
                            style={{ background: meta?.color || "#0891b2" }}
                            title={e.title}
                          >
                            {e.title}
                          </div>
                        );
                      })}
                      {dayEvents.length > 3 && (
                        <div className="text-[10px] text-zinc-500 px-1">+{dayEvents.length - 3} more</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Sidebar — upcoming + filter */}
        <div className="space-y-4">
          <Card className="border-zinc-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Upcoming</CardTitle>
              <CardDescription>Next 5 events</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {upcoming.length === 0 ? (
                <p className="text-sm text-zinc-500 text-center py-4">No upcoming events</p>
              ) : (
                upcoming.map((e) => {
                  const meta = EVENT_TYPES.find((t) => t.id === e.type);
                  const Icon = TYPE_ICONS[e.type] || CalIcon;
                  return (
                    <div key={e.id} className="flex items-start gap-2 p-2 rounded-md hover:bg-zinc-50 group">
                      <div
                        className="h-8 w-8 rounded-md flex items-center justify-center shrink-0"
                        style={{ background: `${meta?.color || "#0891b2"}15`, color: meta?.color || "#0891b2" }}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{e.title}</div>
                        <div className="text-xs text-zinc-500">
                          {new Date(e.startDate).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                          {!e.allDay && ` · ${new Date(e.startDate).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`}
                        </div>
                      </div>
                      {canCreate && (
                        <button
                          onClick={() => deleteEvent(e.id)}
                          className="opacity-0 group-hover:opacity-100 text-red-500 hover:bg-red-50 rounded p-1 transition"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>

          <Card className="border-zinc-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Filter</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All event types</SelectItem>
                  {EVENT_TYPES.map((t) => (
                    <SelectItem key={t.id} value={t.id}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card className="border-zinc-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Legend</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5">
              {EVENT_TYPES.map((t) => (
                <div key={t.id} className="flex items-center gap-2 text-xs">
                  <div className="h-3 w-3 rounded" style={{ background: t.color }} />
                  <span>{t.label}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <NewEventDialog
        open={showNew}
        onOpenChange={setShowNew}
        onCreated={() => {
          setShowNew(false);
          load();
          toast.success("Event created");
        }}
      />
    </div>
  );
}

function NewEventDialog({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreated: () => void;
}) {
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [type, setType] = React.useState("meeting");
  const [startDate, setStartDate] = React.useState("");
  const [startTime, setStartTime] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [endTime, setEndTime] = React.useState("");
  const [allDay, setAllDay] = React.useState(false);
  const [location, setLocation] = React.useState("");
  const [recurrence, setRecurrence] = React.useState("none");
  const [submitting, setSubmitting] = React.useState(false);

  const submit = async () => {
    if (!title || !startDate) {
      toast.error("Title and start date required");
      return;
    }
    setSubmitting(true);
    try {
      const startDateTime = allDay
        ? new Date(startDate).toISOString()
        : new Date(`${startDate}T${startTime || "10:00"}`).toISOString();
      const endDateTime = endDate
        ? allDay
          ? new Date(endDate).toISOString()
          : new Date(`${endDate}T${endTime || "11:00"}`).toISOString()
        : null;
      const res = await fetch("/api/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          type,
          startDate: startDateTime,
          endDate: endDateTime,
          allDay,
          location,
          recurrence,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setTitle("");
      setDescription("");
      setStartDate("");
      setStartTime("");
      setEndDate("");
      setEndTime("");
      setLocation("");
      onCreated();
    } catch {
      toast.error("Failed to create event");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>New Calendar Event</DialogTitle>
          <DialogDescription>Schedule a meeting, holiday, deadline, or celebration.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="space-y-2">
            <Label>Title *</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Team Standup" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EVENT_TYPES.map((t) => (
                    <SelectItem key={t.id} value={t.id}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Recurrence</Label>
              <Select value={recurrence} onValueChange={setRecurrence}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RECURRENCE_OPTIONS.map((r) => (
                    <SelectItem key={r} value={r} className="capitalize">{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-zinc-50 rounded-md">
            <input type="checkbox" id="allDay" checked={allDay} onChange={(e) => setAllDay(e.target.checked)} className="rounded" />
            <Label htmlFor="allDay" className="text-sm cursor-pointer">All day event</Label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Start date *</Label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            {!allDay && (
              <div className="space-y-2">
                <Label>Start time</Label>
                <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
              </div>
            )}
          </div>
          {!allDay && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>End date</Label>
                <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>End time</Label>
                <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
              </div>
            </div>
          )}
          <div className="space-y-2">
            <Label>Location</Label>
            <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Conference Room A or Zoom" />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            onClick={submit}
            disabled={submitting}
            className="bg-[#f1c24e] text-black hover:bg-[#e9b73a] font-semibold"
          >
            {submitting ? "Creating..." : "Create Event"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
