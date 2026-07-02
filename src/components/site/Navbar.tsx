"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LogIn, ArrowRight } from "lucide-react";
import { NAV_LINKS } from "@/lib/site-data/site-data";
import { MagneticButton } from "./MagneticButton";
import { SiteButton } from "./SiteButton";

export function Navbar() {
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    const lock = mobileOpen;
    document.body.style.overflow = lock ? "hidden" : "";
    document.documentElement.style.overflow = lock ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [mobileOpen]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 glass-nav transition-all duration-300 ${
          scrolled ? "border-b" : "border-b border-transparent"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0" aria-label="Magnence home">
            <span className="font-display font-bold text-xl sm:text-2xl tracking-tight text-text-primary whitespace-nowrap">
              <span className="text-2xl sm:text-3xl">M</span>agnence
            </span>
          </Link>

          {/* Desktop nav — simple links (no dropdowns) */}
          <div className="hidden lg:flex items-center gap-7">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "text-text-primary active"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA + Sign In — DESKTOP ONLY (hidden on phone/tablet) */}
          <div className="hidden lg:flex items-center gap-3">
            <SiteButton href="/app" variant="ghost" size="sm">
              <LogIn size={16} /> Sign In
            </SiteButton>
            <MagneticButton href="/contact" variant="primary">
              Talk to Us
            </MagneticButton>
          </div>

          {/* Mobile toggle — PHONE ONLY */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden text-text-primary p-2 -mr-2 flex-shrink-0"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        </nav>
      </header>

      {/* Mobile overlay menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] bg-white/95 backdrop-blur-xl lg:hidden flex flex-col mobile-menu-overlay">
          <div className="h-16 sm:h-20 px-4 sm:px-6 flex items-center justify-between border-b border-border-subtle">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="font-display font-bold text-xl sm:text-2xl text-text-primary"
            >
              <span className="text-2xl sm:text-3xl">M</span>agnence
            </Link>
            <button
              onClick={() => setMobileOpen(false)}
              className="text-text-primary p-2"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>
          <nav className="flex-1 flex flex-col items-center justify-center gap-8 px-6 pt-12 pb-8 overflow-y-auto">
            {NAV_LINKS.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="mobile-menu-enter font-display text-xl sm:text-2xl font-bold text-text-primary hover:text-cyan-signal transition-colors"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col items-center gap-3 mt-6 w-full max-w-xs">
              <SiteButton
                href="/app"
                variant="secondary"
                size="md"
                className="w-full justify-center"
                onClick={() => setMobileOpen(false)}
              >
                <LogIn size={16} /> Sign In to Panel
              </SiteButton>
              <MagneticButton
                href="/contact"
                variant="primary"
                className="w-full justify-center"
                onClick={() => setMobileOpen(false)}
              >
                Talk to Us <ArrowRight size={16} />
              </MagneticButton>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
