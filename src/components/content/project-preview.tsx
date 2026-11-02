import Image from "next/image";
import { ViewTransition } from "react";

import { Label } from "@/components/ui/typography";
import { cn } from "@/lib/cn";
import { type ProjectImage } from "@/types/content";

type ProjectPreviewProps = {
  image?: ProjectImage;
  /** Set on the most prominent preview above the fold. */
  priority?: boolean;
  /** Shared view-transition name; the same name on the destination page morphs the image. */
  transitionName?: string;
  className?: string;
};

/**
 * 16:10 project preview. Uses next/image (responsive sizes, lazy loading,
 * modern formats). Without an image it shows a neutral, clearly labelled panel
 * so the layout holds until real screenshots are added.
 */
export function ProjectPreview({
  image,
  priority = false,
  transitionName,
  className,
}: ProjectPreviewProps) {
  const preview = (
    <div className={cn("relative aspect-cover max-w-full overflow-hidden bg-surface", className)}>
      {image ? (
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority={priority}
          sizes="(min-width: 90rem) 82rem, calc(100vw - 2.5rem)"
          className="object-cover transition-transform duration-page ease-standard group-hover/card:scale-102"
        />
      ) : (
        <div aria-hidden="true" className="absolute inset-0 grid place-items-center">
          <Label>[Project preview]</Label>
        </div>
      )}
    </div>
  );

  return transitionName && image ? (
    <ViewTransition name={transitionName} share="morph" default="none">
      {preview}
    </ViewTransition>
  ) : (
    preview
  );
}
