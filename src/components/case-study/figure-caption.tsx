import { type ReactNode } from "react";

/**
 * Caption with an automatic figure number ("Fig. 1") from a CSS counter set on
 * the article, so numbering stays correct when content is reordered.
 */
export function FigureCaption({ children }: { children?: ReactNode }) {
  return (
    <figcaption className="mt-4 flex max-w-measure gap-3 text-small text-fg-secondary before:shrink-0 before:font-mono before:text-label before:leading-[inherit] before:text-fg-muted before:uppercase before:content-['Fig._'_counter(figure)] before:[counter-increment:figure]">
      {children && <span>{children}</span>}
    </figcaption>
  );
}
