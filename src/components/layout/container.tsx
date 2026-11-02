import { type ElementType, type ReactNode } from "react";

import { cn } from "@/lib/cn";

const sizes = {
  /** 1440px — default for every page. */
  page: "max-w-page",
  /** 960px — text-only pages and forms. */
  narrow: "max-w-narrow",
} as const;

type ContainerProps = {
  as?: "div" | "header" | "footer" | "nav" | "section" | "article";
  size?: keyof typeof sizes;
  className?: string;
  children: ReactNode;
};

/** Centers content with the responsive page margin (20 / 32 / 48 / 64px). */
export function Container({ as = "div", size = "page", className, children }: ContainerProps) {
  const Tag = as as ElementType;
  return (
    <Tag className={cn("mx-auto w-full px-page-margin", sizes[size], className)}>{children}</Tag>
  );
}
