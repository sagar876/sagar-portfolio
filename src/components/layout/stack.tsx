import { type ElementType, type ReactNode } from "react";

import { cn } from "@/lib/cn";

/** Gap steps from the 4px spacing scale. */
export const gaps = {
  xs: "gap-2",
  sm: "gap-4",
  md: "gap-6",
  lg: "gap-8",
  xl: "gap-12",
  "2xl": "gap-16",
} as const;

export type Gap = keyof typeof gaps;

type StackProps = {
  as?: "div" | "ul" | "ol" | "section" | "article" | "header" | "footer";
  gap?: Gap;
  className?: string;
  children: ReactNode;
};

/** Vertical flow with consistent spacing between children. */
export function Stack({ as = "div", gap = "md", className, children }: StackProps) {
  const Tag = as as ElementType;
  return <Tag className={cn("flex flex-col", gaps[gap], className)}>{children}</Tag>;
}

const aligns = {
  start: "items-start",
  center: "items-center",
  baseline: "items-baseline",
} as const;

type ClusterProps = StackProps & {
  align?: keyof typeof aligns;
  justify?: "start" | "between";
};

/** Horizontal group that wraps on narrow screens (button rows, link lists). */
export function Cluster({
  as = "div",
  gap = "md",
  align = "center",
  justify = "start",
  className,
  children,
}: ClusterProps) {
  const Tag = as as ElementType;
  return (
    <Tag
      className={cn(
        "flex flex-wrap",
        gaps[gap],
        aligns[align],
        justify === "between" && "justify-between",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
