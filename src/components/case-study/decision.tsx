import { type ReactNode } from "react";

import { InlineText } from "@/components/case-study/inline-text";
import { Heading, Label } from "@/components/ui/typography";
import { type DecisionBlock, type TradeoffBlock } from "@/types/case-study";

const rowStyles = "grid gap-1 border-t border-border py-4 tablet:grid-cols-[9rem_1fr] tablet:gap-6";
const valueStyles = "text-body text-fg";

function Row({ term, children }: { term: string; children: ReactNode }) {
  return (
    <div className={rowStyles}>
      <Label as="dt" className="tablet:pt-1">
        {term}
      </Label>
      <dd className={valueStyles}>{children}</dd>
    </div>
  );
}

/** An engineering decision: context, choice, reasoning, alternatives. */
export function Decision({ block }: { block: DecisionBlock }) {
  return (
    <section className="flex flex-col gap-4">
      <Heading level={3} size="h3">
        {block.title}
      </Heading>
      <dl className="border-b border-border">
        <Row term="Context">
          <InlineText text={block.context} />
        </Row>
        <Row term="Decision">
          <span className="font-medium">
            <InlineText text={block.decision} />
          </span>
        </Row>
        <Row term="Rationale">
          <InlineText text={block.rationale} />
        </Row>
        {block.alternatives && block.alternatives.length > 0 && (
          <Row term="Alternatives">
            <ul className="flex list-disc flex-col gap-1 pl-5 marker:text-fg-muted">
              {block.alternatives.map((alternative, index) => (
                <li key={`${index}-${alternative}`}>
                  <InlineText text={alternative} />
                </li>
              ))}
            </ul>
          </Row>
        )}
      </dl>
    </section>
  );
}

/** A trade-off or challenge: what was gained, what it cost, how it was contained. */
export function Tradeoff({ block }: { block: TradeoffBlock }) {
  return (
    <section className="flex flex-col gap-4">
      <Heading level={3} size="h3">
        {block.title}
      </Heading>
      <dl className="border-b border-border">
        <Row term="Gained">
          <InlineText text={block.gain} />
        </Row>
        <Row term="Cost">
          <InlineText text={block.cost} />
        </Row>
        {block.mitigation && (
          <Row term="Mitigation">
            <InlineText text={block.mitigation} />
          </Row>
        )}
      </dl>
    </section>
  );
}
