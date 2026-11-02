import { ArrowUpRight, Download } from "lucide-react";
import Link from "next/link";
import { type ReactNode } from "react";

import { cn } from "@/lib/cn";
import { isExternalHref } from "@/lib/utils";

/** Shared underline treatment. Also used by Button's secondary variant. */
export const textLinkStyles =
  "underline decoration-current decoration-1 underline-offset-4 transition-colors duration-micro ease-standard hover:decoration-accent active:text-fg-secondary";

type TextLinkProps = {
  href: string;
  children: ReactNode;
  /** Defaults to automatic detection from `href` (absolute http URLs). */
  external?: boolean;
  /** Download the file (resume PDF) instead of navigating. */
  download?: boolean;
  className?: string;
};

/** Inline link. External links open in a new tab; downloads say so to screen readers. */
export function TextLink({ href, children, external, download, className }: TextLinkProps) {
  const iconClass = "size-[0.85em] self-center";

  if (download) {
    return (
      <a
        href={href}
        download
        className={cn("inline-flex items-baseline gap-1", textLinkStyles, className)}
      >
        {children}
        <Download aria-hidden="true" className={iconClass} strokeWidth={1.75} />
        <span className="sr-only"> (PDF download)</span>
      </a>
    );
  }

  if (external ?? isExternalHref(href)) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn("inline-flex items-baseline gap-1", textLinkStyles, className)}
      >
        {children}
        <ArrowUpRight aria-hidden="true" className={iconClass} strokeWidth={1.75} />
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }

  return (
    <Link href={href} className={cn(textLinkStyles, className)}>
      {children}
    </Link>
  );
}
