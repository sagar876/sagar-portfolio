import { cn } from "@/lib/cn";

/** The 6px accent square that marks the current location (nav, table of contents, status). */
export function SignalMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("inline-block size-1.5 shrink-0 bg-accent", className)}
    />
  );
}
