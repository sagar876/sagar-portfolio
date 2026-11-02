import { type ReactNode } from "react";

import { Reveal } from "@/components/animations/reveal";
import { Grid, GridItem } from "@/components/layout/grid";
import { Section } from "@/components/layout/section";
import { Heading, Label, Text } from "@/components/ui/typography";

type PageIntroProps = {
  /** Short label in the metadata rail, e.g. the section name. */
  eyebrow: string;
  title: string;
  lead?: string;
  /** Extra content under the lead, such as calls to action. */
  children?: ReactNode;
};

/** Opening block for a page: eyebrow in the rail, h1, optional lead paragraph. */
export function PageIntro({ eyebrow, title, lead, children }: PageIntroProps) {
  return (
    <Section spacing="compact" labelledBy="page-title" className="pt-16 desktop:pt-28">
      <Grid rowGap="md">
        <GridItem span="rail">
          <Label as="p">{eyebrow}</Label>
        </GridItem>
        <GridItem span="headline">
          <Reveal>
            <Heading level={1} size="display" id="page-title">
              {title}
            </Heading>
          </Reveal>
        </GridItem>
        {(lead || children) && (
          <GridItem span="prose" className="flex flex-col gap-8">
            {lead && (
              <Text size="lg" tone="muted" measure>
                {lead}
              </Text>
            )}
            {children}
          </GridItem>
        )}
      </Grid>
    </Section>
  );
}
