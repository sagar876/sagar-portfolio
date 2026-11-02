import { ArchitectureDiagram } from "@/components/case-study/architecture-diagram";
import { CaseStudyFigure, CaseStudyImage } from "@/components/case-study/case-study-figure";
import { CodeBlock } from "@/components/case-study/code-block";
import { Decision, Tradeoff } from "@/components/case-study/decision";
import { FigureCaption } from "@/components/case-study/figure-caption";
import { FlowDiagram } from "@/components/case-study/flow-diagram";
import { InlineText } from "@/components/case-study/inline-text";
import { Heading, Label, Text } from "@/components/ui/typography";
import { type Block } from "@/types/case-study";

/** Maps one content block to its component. Unknown block types fail type-checking. */
function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "paragraph":
      return (
        <Text size="lg" family="serif" measure>
          <InlineText text={block.text} />
        </Text>
      );

    case "subheading":
      return (
        <Heading level={3} size="h4" className="pt-4">
          {block.text}
        </Heading>
      );

    case "list": {
      const Tag = block.style === "numbered" ? "ol" : "ul";
      return (
        <Tag
          className={`flex max-w-measure flex-col gap-2 pl-6 font-serif text-body-lg text-fg marker:font-sans marker:text-small marker:text-fg-muted ${block.style === "numbered" ? "list-decimal" : "list-disc"}`}
        >
          {block.items.map((item, index) => (
            <li key={`${index}-${item}`} className="pl-1">
              <InlineText text={item} />
            </li>
          ))}
        </Tag>
      );
    }

    case "definitions":
      return (
        <dl className="max-w-measure border-b border-border">
          {block.items.map((item, index) => (
            <div
              key={`${index}-${item.term}`}
              className="grid gap-1 border-t border-border py-4 tablet:grid-cols-[11rem_1fr] tablet:gap-6"
            >
              <dt className="text-body font-medium text-fg">{item.term}</dt>
              <dd className="text-body text-fg-secondary">
                <InlineText text={item.description} />
              </dd>
            </div>
          ))}
        </dl>
      );

    case "figure":
      return <CaseStudyFigure block={block} />;

    case "architecture-diagram":
      return <ArchitectureDiagram block={block} />;

    case "flow-diagram":
      return <FlowDiagram block={block} />;

    case "diagram-image":
      return (
        <figure>
          <CaseStudyImage
            image={block.image}
            sizes="(min-width: 90rem) 61rem, (min-width: 64rem) 70vw, calc(100vw - 2.5rem)"
          />
          <FigureCaption>{block.caption}</FigureCaption>
        </figure>
      );

    case "code":
      return <CodeBlock block={block} />;

    case "decision":
      return <Decision block={block} />;

    case "tradeoff":
      return <Tradeoff block={block} />;

    case "callout":
      return (
        <aside className="flex max-w-measure flex-col gap-3 border-y border-fg py-6">
          {block.title && <Label as="p">{block.title}</Label>}
          <p className="font-serif text-h3 font-normal text-fg">
            <InlineText text={block.text} />
          </p>
        </aside>
      );
  }
}

export function BlockRenderer({ blocks }: { blocks: readonly Block[] }) {
  return (
    <div className="flex flex-col gap-8 desktop:gap-10">
      {blocks.map((block, index) => (
        <BlockView key={index} block={block} />
      ))}
    </div>
  );
}
