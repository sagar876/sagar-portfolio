import { ArrowRight, ArrowUpRight, Download } from "lucide-react";
import Link from "next/link";
import { type ComponentPropsWithoutRef, type ReactNode } from "react";

import { textLinkStyles } from "@/components/ui/text-link";
import { cn } from "@/lib/cn";
import { isExternalHref } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary";
type ButtonIcon = "arrow" | "external" | "download" | "none";

const base =
  "group inline-flex items-center gap-2.5 whitespace-nowrap text-body font-medium transition-[color,background-color,text-decoration-color,translate] duration-ui ease-standard";

const variants: Record<ButtonVariant, string> = {
  primary: cn(
    "h-12 bg-action px-5 text-on-action",
    "hover:bg-action-hover active:translate-y-px",
    "disabled:pointer-events-none disabled:bg-surface-hover disabled:text-fg-muted",
    "aria-disabled:pointer-events-none aria-disabled:bg-surface-hover aria-disabled:text-fg-muted",
  ),
  secondary: cn(
    "min-h-11 text-fg",
    textLinkStyles,
    "disabled:pointer-events-none disabled:text-fg-muted disabled:no-underline",
  ),
};

function ButtonIconGlyph({ icon }: { icon: ButtonIcon }) {
  if (icon === "none") return null;
  const Icon = { arrow: ArrowRight, external: ArrowUpRight, download: Download }[icon];
  const motion = icon === "download" ? "group-hover:translate-y-0.5" : "group-hover:translate-x-1";
  return (
    <Icon
      aria-hidden="true"
      strokeWidth={1.75}
      className={cn("size-4 transition-transform duration-micro ease-standard", motion)}
    />
  );
}

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: ButtonVariant;
  icon?: ButtonIcon;
};

/** A <button> for actions (submit, retry, copy). Use ButtonLink to navigate. */
export function Button({
  variant = "primary",
  icon = "none",
  type = "button",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button type={type} className={cn(base, variants[variant], className)} {...props}>
      {children}
      <ButtonIconGlyph icon={icon} />
    </button>
  );
}

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  /** Defaults to "download", "external" or "arrow" depending on the link. */
  icon?: ButtonIcon;
  external?: boolean;
  /** Download the file (resume PDF) instead of navigating. */
  download?: boolean;
  className?: string;
};

/** A link styled as a button. External links open in a new tab. */
export function ButtonLink({
  href,
  children,
  variant = "primary",
  icon,
  external,
  download = false,
  className,
}: ButtonLinkProps) {
  const isExternal = !download && (external ?? isExternalHref(href));
  const classes = cn(base, variants[variant], className);
  const defaultIcon: ButtonIcon = download ? "download" : isExternal ? "external" : "arrow";
  const content = (
    <>
      {children}
      <ButtonIconGlyph icon={icon ?? defaultIcon} />
      {download && <span className="sr-only"> (PDF download)</span>}
      {isExternal && <span className="sr-only"> (opens in a new tab)</span>}
    </>
  );

  if (download) {
    return (
      <a href={href} download className={classes}>
        {content}
      </a>
    );
  }

  return isExternal ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
      {content}
    </a>
  ) : (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}
