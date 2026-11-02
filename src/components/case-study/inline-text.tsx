import { Fragment } from "react";

import { Mono } from "@/components/ui/typography";

/** Renders plain text, setting `backtick` spans in mono. Content stays free of markup. */
export function InlineText({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`)/g);
  return (
    <>
      {parts.map((part, index) =>
        part.startsWith("`") && part.endsWith("`") && part.length > 2 ? (
          <Mono key={index} className="bg-surface px-1 text-[0.85em]">
            {part.slice(1, -1)}
          </Mono>
        ) : (
          <Fragment key={index}>{part}</Fragment>
        ),
      )}
    </>
  );
}
