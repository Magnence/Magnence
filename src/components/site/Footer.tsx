"use client";

import * as React from "react";
import Link from "next/link";
import { Linkedin, Twitter, Instagram, Facebook, Youtube, ArrowRight, MapPin } from "lucide-react";
import { FOOTER_LINKS, SOCIAL_LINKS, COMPANY_INFO } from "@/lib/site-data/site-data";

export function Footer() {
  const [email, setEmail] = React.useState("");
  const [subscribed, setSubscribed] = React.useState(false);
  const [subscribing, setSubscribing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const onSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }
    setSubscribing(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "footer" }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json.error ?? "Subscription failed");
      }
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 5000);
    } catch (err: any) {
      setError(err.message ?? "Something went wrong. Please try again.");
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <footer className="relative bg-surface text-text-secondary border-t border-border-subtle">
      {/* Gradient top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-indigo-core to-cyan-signal" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        {/* Top */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pb-12 border-b border-border-subtle">
          <div className="flex flex-col gap-6 max-w-md">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-display font-bold text-2xl text-text-primary">
                <span className="text-3xl">M</span>agnence
              </span>
            </Link>
            <p className="font-display text-2xl font-semibold text-text-primary leading-tight">
              {COMPANY_INFO.tagline}
            </p>
            <div className="flex flex-col gap-1.5 text-sm text-text-muted">
              <span className="flex items-center gap-2">
                <MapPin size={14} className="text-cyan-signal" />
                <span><strong className="text-text-primary">Headquarters:</strong> Bangalore, Karnataka, India</span>
              </span>
              <span className="flex items-center gap-2">
                <MapPin size={14} className="text-cyan-signal" />
                <span><strong className="text-text-primary">Second Office:</strong> Gurugram, Haryana, India</span>
              </span>
              <span className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-signal">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span>1-to-1 confidential · NDA executed by default · Full IP ownership transfers to you</span>
              </span>
            </div>
            <div className="flex items-center gap-4">
              {[
                { Icon: Linkedin, href: SOCIAL_LINKS.linkedin, label: "LinkedIn" },
                { Icon: Twitter, href: SOCIAL_LINKS.twitter, label: "Twitter" },
                { Icon: Instagram, href: SOCIAL_LINKS.instagram, label: "Instagram" },
                { Icon: Facebook, href: SOCIAL_LINKS.facebook, label: "Facebook" },
                { Icon: Youtube, href: SOCIAL_LINKS.youtube, label: "YouTube" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-full border border-border-subtle flex items-center justify-center text-text-secondary hover:text-cyan-signal hover:border-indigo-core/60 transition-all duration-200"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h4 className="font-display font-bold text-text-primary text-sm uppercase tracking-wider mb-4">
                Quick Links
              </h4>
              <ul className="flex flex-col gap-3">
                {FOOTER_LINKS.quick.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-text-secondary hover:text-text-primary text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-display font-bold text-text-primary text-sm uppercase tracking-wider mb-4">
                Services
              </h4>
              <ul className="flex flex-col gap-3">
                {FOOTER_LINKS.services.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-text-secondary hover:text-text-primary text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-display font-bold text-text-primary text-sm uppercase tracking-wider mb-4">
                Company
              </h4>
              <ul className="flex flex-col gap-3">
                {FOOTER_LINKS.company.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-text-secondary hover:text-text-primary text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-12 border-b border-border-subtle">
          <div>
            <h4 className="font-display font-bold text-text-primary text-xl mb-2">
              Subscribe to our newsletter
            </h4>
            <p className="text-text-secondary text-sm">
              Insights on AI, engineering, design, and building digital products — once a month, no spam.
            </p>
          </div>
          <form onSubmit={onSubscribe} className="flex flex-col gap-3 w-full">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                disabled={subscribing}
                className="flex-1 bg-white border border-border-subtle rounded-full px-5 py-3 text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-indigo-core focus:ring-2 focus:ring-indigo-core/15 transition-all disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={subscribing}
                className="btn-primary justify-center whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {subscribing ? "Subscribing…" : subscribed ? "Subscribed!" : "Subscribe"}
                {!subscribed && !subscribing && <ArrowRight size={16} />}
              </button>
            </div>
            {error && (
              <p className="text-red-600 text-xs px-4">{error}</p>
            )}
            {subscribed && (
              <p className="text-cyan-signal text-xs px-4">
                You're on the list! Check your inbox to confirm.
              </p>
            )}
          </form>
        </div>

        {/* Bottom bar — redesigned with card style */}
        <div className="mt-8 rounded-2xl bg-surface border border-border-subtle p-5 sm:p-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-5">
            {/* Left: copyright + contact */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-center sm:text-left">
              <p className="text-text-primary font-semibold text-sm">
                © {new Date().getFullYear()} Magnence
              </p>
              <div className="hidden sm:block w-px h-4 bg-border-subtle" />
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                <a
                  href={COMPANY_INFO.phoneHref}
                  className="inline-flex items-center gap-1.5 text-text-secondary hover:text-text-primary hover:bg-cream px-3 py-1.5 rounded-full transition-all text-sm font-medium"
                >
                  📞 {COMPANY_INFO.phone}
                </a>
                <a
                  href={`mailto:${COMPANY_INFO.email}`}
                  className="inline-flex items-center gap-1.5 text-text-secondary hover:text-text-primary hover:bg-cream px-3 py-1.5 rounded-full transition-all text-sm font-medium"
                >
                  ✉️ {COMPANY_INFO.email}
                </a>
              </div>
            </div>

            {/* Right: legal links */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {[
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms of Service", href: "/terms" },
                { label: "Sitemap", href: "/site-map" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-1.5 rounded-full text-text-secondary hover:text-text-primary hover:bg-cream transition-all text-sm font-medium border border-transparent hover:border-indigo-core/30"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
