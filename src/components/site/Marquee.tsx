"use client";

import * as React from "react";

interface MarqueeProps {
  items: string[];
  className?: string;
}

export function Marquee({ items, className }: MarqueeProps) {
  // Duplicate items to create seamless loop
  const doubled = [...items, ...items];
  return (
    <div className={`marquee ${className ?? ""}`}>
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="text-text-secondary/70 hover:text-text-primary transition-colors duration-200 text-xl font-display font-semibold tracking-wide"
            style={{ opacity: 0.55 }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
