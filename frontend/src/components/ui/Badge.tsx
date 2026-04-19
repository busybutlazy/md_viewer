import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  tone?: "default" | "accent" | "outline";
}

const BADGE_TONES: Record<NonNullable<BadgeProps["tone"]>, string> = {
  default: "bg-[var(--surface-strong)] text-[var(--foreground)]",
  accent: "bg-[var(--accent-soft)] text-[var(--accent-strong)]",
  outline: "border border-[var(--border-strong)] text-[var(--muted-foreground)]",
};

export function Badge({
  children,
  className,
  tone = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em]",
        BADGE_TONES[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
