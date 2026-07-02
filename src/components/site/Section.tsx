import * as React from "react";
import { cn } from "@/lib/utils";

interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionLabel({ children, className }: SectionLabelProps) {
  return (
    <span className={cn("section-label", className)}>
      {children}
    </span>
  );
}

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  variant?: "brand" | "fade";
}

export function GradientText({ children, className, variant = "brand" }: GradientTextProps) {
  return (
    <span
      className={cn(
        variant === "brand" ? "text-gradient-brand" : "text-gradient-fade",
        className
      )}
    >
      {children}
    </span>
  );
}

interface SectionHeadingProps {
  label?: string;
  title: React.ReactNode;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  label,
  title,
  subtitle,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      {label && <SectionLabel>{label}</SectionLabel>}
      <h2 className="font-display font-bold text-4xl md:text-5xl text-text-primary leading-tight max-w-3xl">
        {title}
      </h2>
      {subtitle && (
        <p className="text-text-secondary text-lg max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
