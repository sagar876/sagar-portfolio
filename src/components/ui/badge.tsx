import { type ReactNode } from "react";

import { SignalMark } from "@/components/ui/signal-mark";
import { cn } from "@/lib/cn";

const variants = {
  /** Default. Bordered, for standalone status ("Featured", "Open to roles"). */
  outline: "border border-border-strong text-fg",
  /** Filled, for quieter metadata inside dense layouts. */
  subtle: "bg-surface text-fg-secondary",
} as const;

type BadgeProps = {
  variant?: keyof typeof variants;
  /** Prefix with the accent square, for live status. */
  status?: boolean;
  className?: string;
  children: ReactNode;
};

/** Small mono uppercase tag. Not interactive. Lists of stacks use plain Label text instead. */
export function Badge({ variant = "outline", status = false, className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 px-2.5 py-1 font-mono text-label uppercase",
        variants[variant],
        className,
      )}
    >
      {status && <SignalMark />}
      {children}
    </span>
  );
}
