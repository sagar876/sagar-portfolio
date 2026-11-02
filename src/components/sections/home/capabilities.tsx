import { Grid, GridItem } from "@/components/layout/grid";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Heading, Text } from "@/components/ui/typography";
import { capabilitiesContent } from "@/content/home";
import { capabilities } from "@/data/capabilities";

export function Capabilities() {
  return (
    <Section id="capabilities" labelledBy="capabilities-title" divider>
      <SectionHeading
        id="capabilities-title"
        label="Capabilities"
        title={capabilitiesContent.title}
      />
      <ul className="border-b border-border">
        {capabilities.map((capability) => (
          <li key={capability.title} className="border-t border-border py-6 desktop:py-8">
            <Grid rowGap="none" className="gap-y-2">
              <GridItem span="split-start">
                <Heading level={3} size="h3">
                  {capability.title}
                </Heading>
              </GridItem>
              <GridItem span="split-end">
                <Text tone="secondary">{capability.description}</Text>
              </GridItem>
            </Grid>
          </li>
        ))}
      </ul>
    </Section>
  );
}
