import { type ElementType, type ReactNode } from "react";

import { cn } from "@/lib/cn";

/*
 * Page grid: 4 columns (mobile), 8 (tablet), 12 (desktop) with responsive
 * gutters. Use named spans instead of raw column numbers so the Swiss
 * alignments from the spec (§A5) stay consistent across pages.
 */

const rowGaps = {
  none: "",
  sm: "gap-y-4",
  md: "gap-y-8",
  lg: "gap-y-12",
} as const;

type GridProps = {
  as?: "div" | "ul" | "ol" | "dl" | "section" | "article" | "header" | "li";
  rowGap?: keyof typeof rowGaps;
  className?: string;
  children: ReactNode;
};

export function Grid({ as = "div", rowGap = "md", className, children }: GridProps) {
  const Tag = as as ElementType;
  return <Tag className={cn("grid-page", rowGaps[rowGap], className)}>{children}</Tag>;
}

export const gridSpans = {
  /** All columns. */
  full: "col-span-full",
  /** Display headlines: columns 1–10. */
  headline: "col-span-full desktop:col-start-1 desktop:col-end-11",
  /** Metadata rail: columns 1–3. */
  rail: "col-span-full desktop:col-start-1 desktop:col-end-4",
  /** Right of the rail: columns 4–12. */
  main: "col-span-full desktop:col-start-4 desktop:col-end-13",
  /** Running text: columns 5–11 (~66 characters). */
  prose: "col-span-full desktop:col-start-5 desktop:col-end-12",
  /** Inset figures: columns 5–12. */
  wide: "col-span-full desktop:col-start-5 desktop:col-end-13",
  /** Two-column rows inside `main`: columns 4–7 … */
  "split-start": "col-span-full desktop:col-start-4 desktop:col-end-8",
  /** … and columns 8–12. */
  "split-end": "col-span-full desktop:col-start-8 desktop:col-end-13",
} as const;

export type GridSpan = keyof typeof gridSpans;

type GridItemProps = {
  as?: "div" | "li" | "header" | "aside" | "figure" | "article" | "section" | "dt" | "dd";
  span?: GridSpan;
  className?: string;
  children: ReactNode;
};

export function GridItem({ as = "div", span = "full", className, children }: GridItemProps) {
  const Tag = as as ElementType;
  return <Tag className={cn("min-w-0", gridSpans[span], className)}>{children}</Tag>;
}
