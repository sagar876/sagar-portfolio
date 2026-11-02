import { CircleAlert } from "lucide-react";
import { type ReactNode } from "react";

import { cn } from "@/lib/cn";

/** Shared control styles: 3:1 boundary contrast, 48px tall, error state in the accent colour. */
export const controlStyles = cn(
  "w-full border bg-background px-4 text-body text-fg transition-colors duration-micro ease-standard",
  "placeholder:text-fg-muted hover:border-fg",
  "aria-invalid:border-accent aria-invalid:hover:border-accent",
  "disabled:cursor-not-allowed disabled:bg-surface disabled:text-fg-muted",
  "border-border-strong",
);

type FormFieldProps = {
  id: string;
  label: string;
  error?: string;
  /** Extra guidance below the label, linked to the control with aria-describedby. */
  hint?: ReactNode;
  className?: string;
  children: ReactNode;
};

/**
 * Label, control, hint and error for one field. The control must set
 * aria-describedby={describedBy(id, …)} and aria-invalid itself.
 */
export function FormField({ id, label, error, hint, className, children }: FormFieldProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="text-small font-medium text-fg">
        {label}
      </label>
      {children}
      {hint && (
        <p id={`${id}-hint`} className="text-small text-fg-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="flex items-start gap-2 text-small text-accent">
          <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
          <span>
            <span className="sr-only">Error: </span>
            {error}
          </span>
        </p>
      )}
    </div>
  );
}

/** Builds aria-describedby for a field from the parts that are present. */
export function describedBy(id: string, { hint, error }: { hint?: boolean; error?: boolean }) {
  return [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;
}
