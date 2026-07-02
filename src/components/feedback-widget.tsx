"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { MessageSquare, Star, Send } from "lucide-react";

export function FeedbackWidget() {
  const [type, setType] = React.useState("feature");
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [rating, setRating] = React.useState(5);
  const [submitting, setSubmitting] = React.useState(false);

  const submit = async () => {
    if (!title.trim()) { toast.error("Please add a title"); return; }
    setSubmitting(true);
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, title, description, rating }),
      });
      toast.success("Feedback sent — thank you!");
      setTitle("");
      setDescription("");
      setRating(5);
      setType("feature");
    } catch {
      toast.error("Failed to send feedback");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 h-11 w-11 sm:h-12 sm:w-12 rounded-full bg-[#f1c24e] text-black shadow-lg hover:shadow-xl hover:scale-105 transition flex items-center justify-center"
          title="Send Feedback"
          aria-label="Send Feedback"
        >
          <MessageSquare className="h-5 w-5" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[340px] p-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="h-4 w-4 text-[#c79a2e]" />
            <h3 className="font-semibold text-sm">Send Feedback</h3>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="feature">Feature Request</SelectItem>
                <SelectItem value="bug">Bug Report</SelectItem>
                <SelectItem value="ui">UI Feedback</SelectItem>
                <SelectItem value="ai">AI Feedback</SelectItem>
                <SelectItem value="suggestion">Suggestion</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Brief summary" className="h-8 text-xs" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Details</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Tell us more..." className="text-xs" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Rating</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button key={s} onClick={() => setRating(s)} type="button">
                  <Star className={`h-5 w-5 ${s <= rating ? "text-[#f1c24e] fill-[#f1c24e]" : "text-zinc-300"}`} />
                </button>
              ))}
            </div>
          </div>
          <Button onClick={submit} disabled={submitting} className="w-full bg-[#f1c24e] text-black hover:bg-[#e9b73a] font-semibold text-xs h-8">
            <Send className="h-3.5 w-3.5 mr-1.5" />
            {submitting ? "Sending..." : "Send Feedback"}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
