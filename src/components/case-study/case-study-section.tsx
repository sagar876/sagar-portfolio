import { type ReactNode } from "react";

import { Heading } from "@/components/ui/typography";

type CaseStudySectionProps = {
  id: string;
  title: string;
  children: ReactNode;
};

/** One titled section of a case study. The id is the anchor used by the contents list. */
export function CaseStudySection({ id, title, children }: CaseStudySectionProps) {
  const headingId = `${id}-title`;
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className="flex scroll-mt-24 flex-col gap-8 border-t border-border py-12 desktop:gap-10 desktop:py-16"
    >
      <Heading level={2} size="h2" id={headingId}>
        {title}
      </Heading>
      {children}
    </section>
  );
}
