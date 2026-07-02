"use client";

import * as React from "react";

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

/**
 * Lightweight scroll-reveal wrapper using IntersectionObserver.
 * Adds .reveal class then toggles .is-visible when in view.
 */
export function Reveal({ children, delay = 0, className = "", as = "div" }: RevealProps) {
  const ref = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.transitionDelay = `${delay}ms`;
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: "100px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);

  const Tag = as as any;
  return (
    <Tag ref={ref as any} className={`reveal ${className}`}>
      {children}
    </Tag>
  );
}
