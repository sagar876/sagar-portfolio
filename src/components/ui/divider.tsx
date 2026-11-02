import { cn } from "@/lib/cn";

type DividerProps = {
  /** `subtle` hairline between items; `strong` opens a major block. */
  variant?: "subtle" | "strong";
  className?: string;
};

/** Horizontal rule. Renders <hr>, so it is announced as a separator. */
export function Divider({ variant = "subtle", className }: DividerProps) {
  return (
    <hr
      className={cn(
        "border-0 border-t",
        variant === "strong" ? "border-fg" : "border-border",
        className,
      )}
    />
  );
}
