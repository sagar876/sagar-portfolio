import { type Metadata } from "next";

import { ExperienceList } from "@/components/content/experience-item";
import { Grid, GridItem } from "@/components/layout/grid";
import { Section } from "@/components/layout/section";
import { PageIntro } from "@/components/sections/page-intro";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { Label, Text } from "@/components/ui/typography";
import { resumeLink } from "@/config/navigation";
import { education, experience } from "@/content/experience";
import { createPageMetadata } from "@/lib/metadata";

const lead =
  "9+ years of frontend engineering across travel, FinTech, ecommerce and SaaS, from shipping responsive websites to owning frontend architecture for global airline platforms.";

export const metadata: Metadata = createPageMetadata({
  title: "Experience",
  description: lead,
  path: "/experience",
});

export default function ExperiencePage() {
  return (
    <>
      <PageIntro eyebrow="Experience" title="Experience" lead={lead}>
        <div>
          <ButtonLink href={resumeLink.href} variant="secondary" download>
            Download resume
          </ButtonLink>
        </div>
      </PageIntro>
      <Section spacing="none" className="pb-section" labelledBy="timeline-title">
        <h2 id="timeline-title" className="sr-only">
          Roles, newest first
        </h2>
        <ExperienceList entries={experience} variant="detailed" />
      </Section>

      <Section divider labelledBy="education-title">
        <SectionHeading id="education-title" label="Education" title="Education and recognition" />
        <Grid rowGap="none">
          <GridItem span="main" className="desktop:col-end-12">
            <dl className="border-b border-border">
              {[
                { term: "Degree", items: [`${education.degree}, ${education.year}`] },
                { term: "Certification", items: education.certifications },
                { term: "Awards", items: education.awards },
              ].map(({ term, items }) => (
                <div
                  key={term}
                  className="grid gap-1 border-t border-border py-5 tablet:grid-cols-[10rem_1fr] tablet:gap-6"
                >
                  <Label as="dt" className="tablet:pt-1">
                    {term}
                  </Label>
                  {items.map((item) => (
                    <Text as="dd" key={item}>
                      {item}
                    </Text>
                  ))}
                </div>
              ))}
            </dl>
          </GridItem>
        </Grid>
      </Section>
    </>
  );
}
