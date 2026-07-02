"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glowing?: boolean;
  children: React.ReactNode;
}

export function SiteCard({ glowing = false, className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "site-card p-6",
        glowing && "glowing",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
