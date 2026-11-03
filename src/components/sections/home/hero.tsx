import Image from "next/image";

import { Reveal } from "@/components/animations/reveal";
import { Grid, GridItem } from "@/components/layout/grid";
import { Section } from "@/components/layout/section";
import { Cluster } from "@/components/layout/stack";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { SignalMark } from "@/components/ui/signal-mark";
import { Heading, Label, Text } from "@/components/ui/typography";
import { resumeLink } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { heroContent } from "@/content/home";

/**
 * Hero: name, positioning, introduction and the two primary actions on the
 * left; portrait on the right (desktop). On phones the text and actions come
 * first so they stay above the fold, then the portrait, then the facts.
 *
 * Lines rise in on load with a 60ms stagger (CSS only, server-rendered,
 * skipped for reduced motion). The portrait is the page's LCP image, so it is
 * loaded with priority. The availability badge renders only when
 * siteConfig.availability is set.
 */
export function Hero() {
  const { availability, contact, portrait } = siteConfig;
  const facts = [
    ...heroContent.facts,
    ...(contact.location ? [{ term: "Based in", value: contact.location }] : []),
  ];

  return (
    <Section
      spacing="none"
      labelledBy="hero-title"
      className="pt-16 pb-section-compact tablet:pt-24 desktop:pt-32"
    >
      <Grid rowGap="lg" className="desktop:items-start">
        {/* Text column */}
        <GridItem
          span="full"
          className="flex flex-col items-start gap-8 desktop:col-start-1 desktop:col-end-8"
        >
          <div className="flex flex-col items-start gap-6">
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
          </div>

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

        {/* Portrait */}
        <GridItem
          as="figure"
          span="full"
          className="tablet:col-start-1 tablet:col-end-5 desktop:col-start-9 desktop:col-end-13 desktop:row-span-2"
        >
          <Reveal index={2}>
            <div className="relative aspect-photo w-4/5 max-w-full overflow-hidden bg-surface tablet:w-full">
              <Image
                src={portrait.src}
                alt={portrait.alt}
                fill
                priority
                sizes="(min-width: 90rem) 21rem, (min-width: 64rem) 30vw, (min-width: 40rem) 45vw, calc(100vw - 2.5rem)"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-3 flex items-center gap-2">
              <SignalMark />
              <Label>
                {siteConfig.name}
                {contact.location ? ` · ${contact.location}` : ""}
              </Label>
            </figcaption>
          </Reveal>
        </GridItem>

        {/* Facts */}
        <GridItem span="full" className="desktop:col-start-1 desktop:col-end-8">
          <Reveal index={4}>
            <dl className="grid grid-cols-2 border-t border-border tablet:grid-cols-4">
              {facts.map((fact) => (
                <div
                  key={fact.term}
                  className="flex flex-col gap-1 border-b border-border py-4 pr-4"
                >
                  <Label as="dt">{fact.term}</Label>
                  <dd className="text-small text-fg">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </GridItem>
      </Grid>
    </Section>
  );
}
