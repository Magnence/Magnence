"use client";

import * as React from "react";
import Link from "next/link";

interface MagneticButtonProps {
  href?: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
  onClick?: () => void;
}

/**
 * Button with subtle magnetic hover effect — shifts up to 6px toward cursor.
 * Desktop only; on touch devices behaves like a normal button.
 */
export function MagneticButton({
  href,
  children,
  variant = "primary",
  className = "",
  onClick,
}: MagneticButtonProps) {
  const ref = React.useRef<HTMLAnchorElement | HTMLButtonElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const maxShift = 6;
    const tx = Math.max(-maxShift, Math.min(maxShift, x * 0.18));
    const ty = Math.max(-maxShift, Math.min(maxShift, y * 0.18));
    el.style.transform = `translate(${tx}px, ${ty}px)`;
  };

  const handleMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "translate(0, 0)";
  };

  const base = variant === "primary"
    ? "btn-primary"
    : "btn-secondary";

  if (href) {
    // Use regular <a> for tel:/mailto:/external links, next/link for internal routes
    const isExternal = href.startsWith("tel:") || href.startsWith("mailto:") || href.startsWith("http");
    if (isExternal) {
      return (
        <a
          href={href}
          ref={ref as React.RefObject<HTMLAnchorElement>}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={`${base} ${className}`}
          onClick={onClick}
        >
          {children}
        </a>
      );
    }
    return (
      <Link
        href={href}
        ref={ref as React.RefObject<HTMLAnchorElement>}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`${base} ${className}`}
        onClick={onClick}
      >
        {children}
      </Link>
    );
  }
  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`${base} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
