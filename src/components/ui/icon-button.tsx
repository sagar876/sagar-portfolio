import { type LucideIcon } from "lucide-react";
import { type ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/cn";

const variants = {
  ghost: "hover:bg-surface active:bg-surface-hover",
  outline: "border border-border-strong hover:border-fg active:bg-surface-hover",
} as const;

type IconButtonProps = Omit<ComponentPropsWithoutRef<"button">, "children" | "aria-label"> & {
  icon: LucideIcon;
  /** Accessible name. Required, because the button has no visible text. */
  label: string;
  variant?: keyof typeof variants;
};

/** Square 44px icon-only button (menu, close, copy). Meets the 44px touch target. */
export function IconButton({
  icon: Icon,
  label,
  variant = "ghost",
  type = "button",
  className,
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      className={cn(
        "inline-flex size-11 shrink-0 items-center justify-center text-fg transition-[color,background-color,border-color,scale] duration-ui ease-standard active:scale-95",
        variants[variant],
        "disabled:pointer-events-none disabled:border-border disabled:text-fg-muted",
        className,
      )}
      {...props}
    >
      <Icon aria-hidden="true" className="size-5" strokeWidth={1.75} />
    </button>
  );
}
