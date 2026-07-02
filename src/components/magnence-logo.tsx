"use client";

import { cn } from "@/lib/utils";

export function MagnenceLogo({
  size = 32,
  withWordmark = true,
}: {
  size?: number;
  withWordmark?: boolean;
}) {
  return (
    <div className="flex items-center gap-2.5 select-none">
      <div
        className="flex items-center justify-center font-black text-black shrink-0"
        style={{
          width: size,
          height: size,
          background: "#f1c24e",
          borderRadius: size * 0.22,
          fontSize: size * 0.66,
          lineHeight: 1,
        }}
        aria-label="Magnence"
      >
        M
      </div>
      {withWordmark && (
        <div className="flex flex-col leading-none">
          <span className="text-xl font-bold tracking-tight text-black">
            Magnence
          </span>
          <span className="text-[10px] font-medium text-muted-foreground tracking-wide">
            Imagine. Create. Engineer. Elevate.
          </span>
        </div>
      )}
    </div>
  );
}

export default MagnenceLogo;
