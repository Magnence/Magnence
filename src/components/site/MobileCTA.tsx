"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogIn, MessageSquare } from "lucide-react";

/**
 * Sticky bottom CTA bar — only visible on mobile (under 768px).
 * Shows "Sign In" + "Talk to Us" buttons.
 * Hidden on /contact (already has form) and /app (Magnence OS has its own UI).
 */
export function MobileCTA() {
  const pathname = usePathname();

  // Don't show on contact page (form is right there) or in the OS
  if (pathname === "/contact" || pathname.startsWith("/app")) {
    return null;
  }

  return (
    <div className="mobile-cta-bar lg:hidden">
      <Link
        href="/app"
        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-full border border-border-subtle text-text-primary text-sm font-semibold hover:border-indigo-core transition-colors"
      >
        <LogIn size={16} /> Sign In
      </Link>
      <Link
        href="/contact"
        className="flex-1 btn-primary !py-2.5 !text-sm justify-center"
      >
        <MessageSquare size={16} /> Talk to Us
      </Link>
    </div>
  );
}
