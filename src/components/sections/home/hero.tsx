import { Reveal } from "@/components/animations/reveal";
import { Grid, GridItem } from "@/components/layout/grid";
import { Section } from "@/components/layout/section";
import { Cluster } from "@/components/layout/stack";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Heading, Label, Text } from "@/components/ui/typography";
import { resumeLink } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { heroContent } from "@/content/home";

/**
 * Hero: name at display size, positioning, introduction and the two primary
 * actions. Lines rise in on load with a 60ms stagger (CSS only, server-rendered,
 * skipped for reduced motion). The availability badge renders only when
 * siteConfig.availability is set.
 */
export function Hero() {
  const { availability, contact } = siteConfig;
  const facts = [
    ...heroContent.facts,
    ...(contact.location ? [{ term: "Based in", value: contact.location }] : []),
  ];

  return (
    <Section
      spacing="none"
      labelledBy="hero-title"
      className="pt-16 pb-section tablet:pt-24 desktop:pt-32"
    >
      <Grid rowGap="lg">
        <GridItem span="full" className="flex flex-col items-start gap-6">
          {availability && (
            <Reveal>
              <Badge status>{availability}</Badge>
            </Reveal>
          )}
          <Reveal index={1}>
            <Heading level={1} size="display-xl" id="hero-title">
              {siteConfig.name}
            </Heading>
          </Reveal>
        </GridItem>

        <GridItem span="rail" className="order-last desktop:order-none">
          <Reveal index={4}>
            <dl className="flex flex-col border-t border-border">
              {facts.map((fact) => (
                <div
                  key={fact.term}
                  className="grid grid-cols-[7rem_1fr] gap-4 border-b border-border py-3 desktop:grid-cols-1 desktop:gap-1"
                >
                  <Label as="dt">{fact.term}</Label>
                  <dd className="text-small text-fg">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </GridItem>

        <GridItem span="main" className="flex flex-col gap-8 desktop:col-end-12">
          <Reveal index={2} className="flex flex-col gap-6">
            <p className="text-h2 text-fg">{heroContent.positioning}</p>
            <Text size="lg" tone="secondary" measure>
              {heroContent.intro}
            </Text>
          </Reveal>
          <Reveal index={3}>
            <Cluster gap="lg">
              <ButtonLink href={heroContent.primaryCta.href} icon="arrow">
                {heroContent.primaryCta.label}
              </ButtonLink>
              <ButtonLink href={resumeLink.href} variant="secondary" download>
                Download resume
              </ButtonLink>
            </Cluster>
          </Reveal>
        </GridItem>
      </Grid>
    </Section>
  );
}
