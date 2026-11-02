import { type ComponentProps, type ElementType, type ReactNode } from "react";

import { cn } from "@/lib/cn";

/* -------------------------------------------------------------------------- */
/* Heading — semantic level and visual size are independent                   */
/* -------------------------------------------------------------------------- */

const headingSizes = {
  "display-xl": "text-display-xl",
  display: "text-display",
  h1: "text-h1",
  h2: "text-h2",
  h3: "text-h3",
  h4: "text-h4",
  h5: "text-h5",
  h6: "text-h6",
} as const;

export type HeadingSize = keyof typeof headingSizes;
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

type HeadingProps = ComponentProps<"h2"> & {
  /** Document outline level. Choose by structure, not by looks. */
  level: HeadingLevel;
  /** Visual size. Defaults to the size matching `level`. */
  size?: HeadingSize;
};

export function Heading({ level, size, className, ...props }: HeadingProps) {
  const Tag = `h${level}` as const;
  const resolvedSize = size ?? (`h${level}` as HeadingSize);
  return <Tag className={cn(headingSizes[resolvedSize], "text-fg", className)} {...props} />;
}

/* -------------------------------------------------------------------------- */
/* Text — body copy                                                            */
/* -------------------------------------------------------------------------- */

const textSizes = {
  lg: "text-body-lg",
  base: "text-body",
  sm: "text-small",
} as const;

const textTones = {
  primary: "text-fg",
  secondary: "text-fg-secondary",
  muted: "text-fg-muted",
} as const;

export type TextTone = keyof typeof textTones;

type TextProps = {
  as?: "p" | "span" | "div" | "li" | "dd" | "figcaption";
  size?: keyof typeof textSizes;
  tone?: TextTone;
  /** Serif is for long-form prose only (case studies, About). */
  family?: "sans" | "serif";
  /** Limit line length to the reading measure (~68 characters). */
  measure?: boolean;
  id?: string;
  className?: string;
  children: ReactNode;
};

export function Text({
  as = "p",
  size = "base",
  tone = "primary",
  family = "sans",
  measure = false,
  className,
  ...props
}: TextProps) {
  const Tag = as as ElementType;
  return (
    <Tag
      className={cn(
        textSizes[size],
        textTones[tone],
        family === "serif" ? "font-serif" : "font-sans",
        measure && "max-w-measure",
        className,
      )}
      {...props}
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Label — mono uppercase: eyebrows, years, stacks, figure numbers             */
/* -------------------------------------------------------------------------- */

type LabelProps = {
  as?: "span" | "p" | "div" | "dt" | "time" | "label" | "h2" | "h3" | "h4";
  tone?: "muted" | "primary";
  id?: string;
  /** For `as="time"`. */
  dateTime?: string;
  /** For `as="label"`. */
  htmlFor?: string;
  className?: string;
  children: ReactNode;
};

export function Label({ as = "span", tone = "muted", className, ...props }: LabelProps) {
  const Tag = as as ElementType;
  return (
    <Tag
      className={cn(
        "font-mono text-label uppercase",
        tone === "muted" ? "text-fg-muted" : "text-fg",
        className,
      )}
      {...props}
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Mono — inline code and technical values in running text                     */
/* -------------------------------------------------------------------------- */

type MonoProps = {
  as?: "code" | "span" | "kbd" | "samp";
  className?: string;
  children: ReactNode;
};

export function Mono({ as = "code", className, children }: MonoProps) {
  const Tag = as as ElementType;
  return <Tag className={cn("font-mono text-mono", className)}>{children}</Tag>;
}
