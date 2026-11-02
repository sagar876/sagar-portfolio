import { SignalMark } from "@/components/ui/signal-mark";
import { cn } from "@/lib/cn";
import { type DiagramNode } from "@/types/case-study";

/** One box in an architecture or flow diagram. Highlighted nodes get a heavier frame and the accent mark. */
export function DiagramNodeBox({ node, className }: { node: DiagramNode; className?: string }) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-col gap-1 bg-background px-4 py-3",
        node.highlight ? "border-2 border-fg" : "border border-border-strong",
        className,
      )}
    >
      <span className="flex items-center gap-2 text-small font-medium text-fg">
        {node.highlight && <SignalMark />}
        {node.label}
        {node.highlight && <span className="sr-only"> (highlighted)</span>}
      </span>
      {node.note && <span className="text-small text-fg-secondary">{node.note}</span>}
    </div>
  );
}
