import { type CSSProperties, type ElementType, type ReactNode } from "react";

import { cn } from "@/lib/cn";
import { STAGGER_MS } from "@/lib/motion";

type RevealProps = {
  as?: "div" | "span" | "li";
  /** Position in a staggered group; each step adds a 60ms delay. */
  index?: number;
  className?: string;
  children: ReactNode;
};

/**
 * Entrance animation: rise 12px and fade in.
 *
 * Pure CSS, so it works in Server Components and needs no JavaScript. Content
 * ends fully visible, and users with reduced motion get no movement.
 */
export function Reveal({ as = "div", index = 0, className, children }: RevealProps) {
  const Tag = as as ElementType;
  const style: CSSProperties | undefined =
    index > 0 ? { animationDelay: `${index * STAGGER_MS}ms` } : undefined;

  return (
    <Tag className={cn("motion-safe:animate-rise", className)} style={style}>
      {children}
    </Tag>
  );
}
