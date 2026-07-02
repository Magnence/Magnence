"use client";

import * as React from "react";

/**
 * Magnetic dot-grid backdrop for hero section only.
 * Slow upward drift animation via CSS class `dot-grid`.
 */
export function DotGrid({ className = "" }: { className?: string }) {
  return (
    <div
      className={`dot-grid absolute inset-0 pointer-events-none ${className}`}
      aria-hidden
    />
  );
}
