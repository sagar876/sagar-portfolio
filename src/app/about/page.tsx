import { type Metadata } from "next";

import { ExperienceList } from "@/components/content/experience-item";
import { Grid, GridItem } from "@/components/layout/grid";
import { Section } from "@/components/layout/section";
import { PageIntro } from "@/components/sections/page-intro";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { Heading, Label, Text } from "@/components/ui/typography";
import { resumeLink } from "@/config/navigation";
import {
  aboutExpertise,
  aboutInterests,
  aboutIntro,
  aboutJourney,
  aboutPhilosophy,
  aboutResume,
} from "@/content/about";
import { experience } from "@/content/experience";
import { capabilities } from "@/data/capabilities";
import { coreStack } from "@/data/stack";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "About",
  description: aboutIntro.lead,
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageIntro eyebrow="About" title={aboutIntro.title} lead={aboutIntro.lead}>
        {aboutIntro.body.map((paragraph) => (
          <Text key={paragraph} size="lg" family="serif" measure>
            {paragraph}
          </Text>
        ))}
      </PageIntro>

      {/* Engineering philosophy */}
      <Section divider labelledBy="philosophy-title">
        <SectionHeading id="philosophy-title" label="Approach" title={aboutPhilosophy.title} />
        <Grid rowGap="lg">
          <GridItem span="main" className="desktop:col-end-12">
            <p className="font-serif text-h1 font-normal text-fg">{aboutPhilosophy.statement}</p>
          </GridItem>
          <GridItem span="main">
            <ul className="grid gap-x-gutter gap-y-10 tablet:grid-cols-2">
              {aboutPhilosophy.principles.map((principle) => (
                <li key={principle.title} className="flex flex-col gap-3 border-t border-fg pt-5">
                  <Heading level={3} size="h4">
                    {principle.title}
                  </Heading>
                  <Text tone="secondary">{principle.text}</Text>
                </li>
              ))}
            </ul>
          </GridItem>
        </Grid>
      </Section>

      {/* Career journey */}
      <Section divider labelledBy="journey-title">
        <SectionHeading
          id="journey-title"
          label="Journey"
          title={aboutJourney.title}
          action={{ label: aboutJourney.experienceLinkLabel, href: "/experience" }}
        />
        <Grid rowGap="lg">
          <GridItem span="prose" className="flex flex-col gap-6">
            {aboutJourney.body.map((paragraph) => (
              <Text key={paragraph} size="lg" family="serif" measure>
                {paragraph}
              </Text>
            ))}
          </GridItem>
        </Grid>
        {experience.length > 0 && (
          <div className="mt-16">
            <ExperienceList entries={experience} />
          </div>
        )}
      </Section>

      {/* Areas of expertise */}
      <Section divider labelledBy="expertise-title">
        <SectionHeading id="expertise-title" label="Expertise" title={aboutExpertise.title} />
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
        <Grid className="pt-10">
          <GridItem span="main" className="flex flex-col gap-2">
            <Label as="p">Core stack</Label>
            <p className="text-body-lg text-fg">{coreStack.join(" · ")}</p>
          </GridItem>
        </Grid>
      </Section>

      {/* Personal interests — only rendered when provided */}
      {aboutInterests && (
        <Section divider labelledBy="interests-title">
          <SectionHeading id="interests-title" label="Outside work" title={aboutInterests.title} />
          <Grid>
            <GridItem span="prose">
              <ul className="flex flex-col gap-2">
                {aboutInterests.items.map((item) => (
                  <Text as="li" key={item} size="lg">
                    {item}
                  </Text>
                ))}
              </ul>
            </GridItem>
          </Grid>
        </Section>
      )}

      {/* Resume */}
      <Section divider labelledBy="resume-title">
        <Grid rowGap="md">
          <GridItem span="rail">
            <Label as="p">{aboutResume.title}</Label>
          </GridItem>
          <GridItem span="main" className="flex flex-col items-start gap-6">
            <Heading level={2} size="h1" id="resume-title">
              {aboutResume.text}
            </Heading>
            <ButtonLink href={resumeLink.href} download>
              {aboutResume.cta}
            </ButtonLink>
          </GridItem>
        </Grid>
      </Section>
    </>
  );
}
