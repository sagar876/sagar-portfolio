import { Label } from "@/components/ui/typography";
import { type CodeBlock as CodeBlockData } from "@/types/case-study";

/**
 * Code excerpt. Long lines scroll inside the block; the block is focusable so
 * keyboard users can scroll it too.
 */
export function CodeBlock({ block }: { block: CodeBlockData }) {
  const label = block.filename ?? `${block.language} code`;
  return (
    <figure>
      <div className="border border-border bg-surface">
        <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-2">
          <Label tone="primary" className="normal-case">
            {block.filename ?? ""}
          </Label>
          <Label>{block.language}</Label>
        </div>
        <pre
          tabIndex={0}
          aria-label={label}
          className="overflow-x-auto p-4 font-mono text-mono text-fg tablet:p-6"
        >
          <code>{block.code}</code>
        </pre>
      </div>
      {block.caption && (
        <figcaption className="mt-4 max-w-measure text-small text-fg-secondary">
          {block.caption}
        </figcaption>
      )}
    </figure>
  );
}
