import { BlockRenderer } from "@/components/case-study/block-renderer";
import { Label } from "@/components/ui/typography";
import { type VerifiedResults } from "@/types/case-study";

/** Verified results only. The source is always shown with the numbers. */
export function Results({ results }: { results: VerifiedResults }) {
  return (
    <div className="flex flex-col gap-8">
      {results.metrics && results.metrics.length > 0 && (
        <dl className="grid gap-x-gutter gap-y-8 border-t border-fg pt-6 tablet:grid-cols-3">
          {results.metrics.map((metric, index) => (
            <div key={`${index}-${metric.label}`} className="flex flex-col-reverse gap-2">
              <dt className="text-small text-fg-secondary">{metric.label}</dt>
              <dd className="text-display text-fg tabular-nums">{metric.value}</dd>
            </div>
          ))}
        </dl>
      )}
      <Label as="p">Source: {results.source}</Label>
      {results.blocks && <BlockRenderer blocks={results.blocks} />}
    </div>
  );
}
