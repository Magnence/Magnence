"use client";

import * as React from "react";
import Link from "next/link";
import { Cookie, X, Check, Shield } from "lucide-react";

const CONSENT_KEY = "magnence-cookie-consent";
const SESSION_KEY = "magnence-analytics-session";

export function CookieBanner() {
  const [visible, setVisible] = React.useState(false);
  const [decision, setDecision] = React.useState<"accepted" | "declined" | null>(null);

  const startAnalytics = React.useCallback(() => {
    try {
      // Generate or retrieve session ID
      let sessionId = sessionStorage.getItem(SESSION_KEY);
      if (!sessionId) {
        sessionId = `anon_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
        sessionStorage.setItem(SESSION_KEY, sessionId);
      }

      // Detect device info
      const ua = navigator.userAgent;
      const deviceType = /Mobile|Android|iPhone/i.test(ua)
        ? "mobile"
        : /iPad|Tablet/i.test(ua)
        ? "tablet"
        : "desktop";
      const browser = /Chrome/i.test(ua)
        ? "Chrome"
        : /Firefox/i.test(ua)
        ? "Firefox"
        : /Safari/i.test(ua)
        ? "Safari"
        : /Edge/i.test(ua)
        ? "Edge"
        : "Other";
      const os = /Windows/i.test(ua)
        ? "Windows"
        : /Mac/i.test(ua)
        ? "macOS"
        : /Linux/i.test(ua)
        ? "Linux"
        : /Android/i.test(ua)
        ? "Android"
        : /iOS|iPhone|iPad/i.test(ua)
        ? "iOS"
        : "Other";

      // Send analytics data
      const sendData = (event: string, extra?: Record<string, any>) => {
        fetch("/api/site/analytics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            event,
            page: window.location.pathname,
            referrer: document.referrer || null,
            deviceType,
            browser,
            os,
            ...extra,
          }),
          keepalive: true,
        }).catch(() => {});
      };

      sendData("session_start");
      sendData("page_view");

      // Track route changes (client-side navigation)
      let lastPath = window.location.pathname;
      const interval = setInterval(() => {
        if (window.location.pathname !== lastPath) {
          lastPath = window.location.pathname;
          sendData("page_view");
        }
      }, 500);

      // Track session end on page unload
      window.addEventListener("beforeunload", () => {
        sendData("session_end");
      });

      return () => clearInterval(interval);
    } catch {
      // Analytics should never break the site
    }
  }, []);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(CONSENT_KEY);
      if (!stored) {
        // Show banner after 1.5s on ALL devices
        const t = setTimeout(() => setVisible(true), 1500);
        return () => clearTimeout(t);
      }
      setDecision(stored as "accepted" | "declined");
      if (stored === "accepted") {
        startAnalytics();
      }
    } catch {}
  }, [startAnalytics]);

  const decide = (choice: "accepted" | "declined") => {
    try {
      localStorage.setItem(CONSENT_KEY, choice);
    } catch {}
    setDecision(choice);
    setVisible(false);
    if (choice === "accepted") {
      startAnalytics();
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] p-3 sm:p-4 pointer-events-none">
      <div className="max-w-3xl mx-auto pointer-events-auto">
        <div className="bg-white rounded-2xl shadow-2xl border border-border-strong overflow-hidden">
          {/* Gradient top bar */}
          <div className="h-1 bg-gradient-to-r from-indigo-core to-indigo-light" />

          <div className="p-4 sm:p-5">
            <div className="flex items-start gap-3 sm:gap-4">
              {/* Icon */}
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-cream border border-indigo-core/30 flex items-center justify-center flex-shrink-0">
                <Cookie size={22} className="text-cyan-signal" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-bold text-text-primary text-base sm:text-lg mb-1">
                  We value your privacy
                </h3>
                <p className="text-text-secondary text-xs sm:text-sm leading-relaxed mb-3">
                  We use cookies to enhance your browsing experience and analyze site traffic to improve our services.
                  See our{" "}
                  <Link href="/privacy" className="text-cyan-signal hover:underline font-medium">
                    Privacy Policy
                  </Link>
                  .
                </p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => decide("accepted")}
                    className="btn-primary !py-2 !px-4 !text-xs justify-center flex-1 sm:flex-initial"
                  >
                    <Check size={14} /> Accept All
                  </button>
                  <button
                    onClick={() => decide("declined")}
                    className="btn-secondary !py-2 !px-4 !text-xs justify-center flex-1 sm:flex-initial"
                  >
                    <Shield size={14} /> Decline
                  </button>
                </div>
              </div>

              {/* Close X */}
              <button
                onClick={() => setVisible(false)}
                className="text-text-muted hover:text-text-primary transition-colors flex-shrink-0 p-1"
                aria-label="Dismiss"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
