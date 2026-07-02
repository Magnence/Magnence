"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "link";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  variant?: Variant;
  size?: Size;
  href?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

const variantClasses: Record<Variant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  ghost: "btn-ghost",
  link: "bg-transparent text-[#b8881a] border-none p-0 hover:text-[#f59e0b] underline-offset-4 hover:underline",
};

const sizeClasses: Record<Size, string> = {
  sm: "!px-4 !py-2 !text-sm",
  md: "!px-6 !py-3 !text-sm",
  lg: "!px-8 !py-4 !text-base",
};

export function SiteButton({
  variant = "primary",
  size = "md",
  href,
  children,
  className,
  onClick,
  ...props
}: ButtonProps) {
  const cls = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 cursor-pointer",
    variantClasses[variant],
    sizeClasses[size],
    className
  );
  if (href) {
    const isExternal = href.startsWith("tel:") || href.startsWith("mailto:") || href.startsWith("http");
    if (isExternal) {
      return (
        <a href={href} className={cls} onClick={onClick}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={cls} onClick={onClick}>
        {children}
      </Link>
    );
  }
  return (
    <button className={cls} onClick={onClick} {...props}>
      {children}
    </button>
  );
}
