import { ArrowDown, ArrowRight } from "lucide-react";

import { DiagramNodeBox } from "@/components/case-study/diagram-node";
import { FigureCaption } from "@/components/case-study/figure-caption";
import { Label } from "@/components/ui/typography";
import { type FlowDiagramBlock } from "@/types/case-study";

/** Ordered flow: vertical on mobile, horizontal from tablet up. */
export function FlowDiagram({ block }: { block: FlowDiagramBlock }) {
  return (
    <figure>
      <div className="flex flex-col gap-4 bg-surface p-4 tablet:p-8">
        <Label as="p" tone="primary">
          {block.title}
        </Label>
        <ol className="flex flex-col items-stretch tablet:flex-row">
          {block.steps.map((step, index) => (
            <li
              key={`${index}-${step.label}`}
              className="flex flex-col items-stretch tablet:flex-1 tablet:flex-row tablet:items-center"
            >
              {index > 0 && (
                <span
                  aria-hidden="true"
                  className="flex justify-center py-1 text-fg-muted tablet:px-2 tablet:py-0"
                >
                  <ArrowDown className="size-4 tablet:hidden" strokeWidth={1.75} />
                  <ArrowRight className="hidden size-4 tablet:block" strokeWidth={1.75} />
                </span>
              )}
              <DiagramNodeBox node={step} className="tablet:h-full tablet:flex-1" />
            </li>
          ))}
        </ol>
      </div>
      <FigureCaption>{block.caption}</FigureCaption>
    </figure>
  );
}
