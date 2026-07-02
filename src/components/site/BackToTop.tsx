"use client";

import * as React from "react";
import { ChevronUp } from "lucide-react";

export function BackToTop() {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-24 right-4 sm:bottom-6 sm:right-24 z-30 w-12 h-12 rounded-full bg-indigo-core text-text-primary flex items-center justify-center shadow-[0_8px_24px_rgba(251,198,7,0.5)] hover:bg-indigo-light transition-all"
      aria-label="Back to top"
    >
      <ChevronUp size={22} />
    </button>
  );
}
