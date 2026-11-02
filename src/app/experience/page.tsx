import { type Metadata } from "next";

import { ExperienceList } from "@/components/content/experience-item";
import { Section } from "@/components/layout/section";
import { PageIntro } from "@/components/sections/page-intro";
import { ButtonLink } from "@/components/ui/button";
import { resumeLink } from "@/config/navigation";
import { experience } from "@/content/experience";
import { createPageMetadata } from "@/lib/metadata";

const lead =
  "Eight years of frontend engineering with React, Next.js and TypeScript, from feature work to frontend architecture.";

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
    </>
  );
}
