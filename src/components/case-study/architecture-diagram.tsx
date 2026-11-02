import { DiagramNodeBox } from "@/components/case-study/diagram-node";
import { FigureCaption } from "@/components/case-study/figure-caption";
import { Label } from "@/components/ui/typography";
import { type ArchitectureDiagramBlock } from "@/types/case-study";

/**
 * Layered architecture diagram built from HTML lists, so it reflows on small
 * screens, follows the theme, and reads as structured text to screen readers.
 */
export function ArchitectureDiagram({ block }: { block: ArchitectureDiagramBlock }) {
  return (
    <figure>
      <div className="flex flex-col gap-4 bg-surface p-4 tablet:p-8">
        <Label as="p" tone="primary">
          {block.title}
        </Label>
        <ol className="flex flex-col">
          {block.layers.map((layer, index) => (
            <li key={`${index}-${layer.label}`} className="flex flex-col">
              {index > 0 && (
                <span aria-hidden="true" className="ml-6 h-5 w-px bg-border-strong tablet:ml-34" />
              )}
              <div className="flex flex-col gap-2 tablet:flex-row tablet:items-stretch tablet:gap-6">
                <Label className="tablet:w-28 tablet:shrink-0 tablet:pt-3">{layer.label}</Label>
                <ul className="grid flex-1 grid-cols-1 gap-2 min-[30rem]:grid-cols-2 tablet:grid-cols-3">
                  {layer.nodes.map((node, nodeIndex) => (
                    <li key={`${nodeIndex}-${node.label}`} className="flex">
                      <DiagramNodeBox node={node} className="flex-1" />
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <FigureCaption>{block.caption}</FigureCaption>
    </figure>
  );
}
