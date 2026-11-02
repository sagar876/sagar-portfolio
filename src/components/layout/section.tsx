import { type ReactNode } from "react";

import { Container } from "@/components/layout/container";
import { cn } from "@/lib/cn";

const spacing = {
  /** Between major sections: 96 / 128 / 160px. */
  default: "py-section",
  /** Page intros and closely related blocks: 48 / 56 / 64px. */
  compact: "py-section-compact",
  none: "",
} as const;

type SectionProps = {
  id?: string;
  /** Id of the heading that names this section (see SectionHeading). */
  labelledBy?: string;
  spacing?: keyof typeof spacing;
  /** Hairline rule along the top edge, inside the page margins. */
  divider?: boolean;
  className?: string;
  children: ReactNode;
};

/** Full-width page band with vertical rhythm and a centered Container. */
export function Section({
  id,
  labelledBy,
  spacing: spacingKey = "default",
  divider = false,
  className,
  children,
}: SectionProps) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cn(spacing[spacingKey], className)}>
      <Container className={cn(divider && "border-t border-border pt-8 desktop:pt-12")}>
        {children}
      </Container>
    </section>
  );
}
