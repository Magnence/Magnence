import * as LucideIcons from "lucide-react";
import type { LucideProps } from "lucide-react";

type LucideIconName = keyof typeof LucideIcons;

interface IconProps extends LucideProps {
  name: string;
  size?: number;
  className?: string;
}

export function Icon({ name, size = 24, className, ...props }: IconProps) {
  const IconComponent = (LucideIcons as unknown as Record<string, LucideIcons.LucideIcon>)[name];
  if (!IconComponent) {
    // Fallback to a generic icon
    return <LucideIcons.Circle size={size} className={className} {...props} />;
  }
  return <IconComponent size={size} className={className} {...props} />;
}
