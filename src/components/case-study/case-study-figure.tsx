import Image from "next/image";

import { FigureCaption } from "@/components/case-study/figure-caption";
import { cn } from "@/lib/cn";
import { type FigureBlock, type ImageAsset } from "@/types/case-study";

const layouts: Record<FigureBlock["layout"], { grid: string; sizes: string }> = {
  single: { grid: "max-w-measure", sizes: "(min-width: 64rem) 42rem, calc(100vw - 2.5rem)" },
  wide: {
    grid: "",
    sizes: "(min-width: 90rem) 61rem, (min-width: 64rem) 70vw, calc(100vw - 2.5rem)",
  },
  "two-up": {
    grid: "grid gap-gutter tablet:grid-cols-2",
    sizes: "(min-width: 64rem) 30rem, (min-width: 40rem) 50vw, calc(100vw - 2.5rem)",
  },
  "three-up": {
    grid: "grid max-w-measure grid-cols-3 gap-3 tablet:gap-gutter",
    sizes: "(min-width: 40rem) 14rem, 33vw",
  },
};

export function CaseStudyImage({ image, sizes }: { image: ImageAsset; sizes: string }) {
  return (
    <Image
      src={image.src}
      alt={image.alt}
      width={image.width}
      height={image.height}
      sizes={sizes}
      // SVG diagrams and placeholders are already resolution-independent.
      unoptimized={image.src.endsWith(".svg")}
      className="h-auto w-full border border-border bg-surface"
    />
  );
}

/** Screenshots in one of four responsive layouts. */
export function CaseStudyFigure({ block }: { block: FigureBlock }) {
  const layout = layouts[block.layout];
  return (
    <figure>
      <div className={cn(layout.grid)}>
        {block.images.map((image, index) => (
          <CaseStudyImage key={`${index}-${image.src}`} image={image} sizes={layout.sizes} />
        ))}
      </div>
      <FigureCaption>{block.caption}</FigureCaption>
    </figure>
  );
}
