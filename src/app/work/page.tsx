import { type Metadata } from "next";

import { ProjectList } from "@/components/content/project-card";
import { Section } from "@/components/layout/section";
import { PageIntro } from "@/components/sections/page-intro";
import { Text } from "@/components/ui/typography";
import { getAllProjects } from "@/lib/projects";
import { createPageMetadata } from "@/lib/metadata";

const description =
  "Case studies in frontend architecture, real-time and offline-first applications, performance and design systems.";

export const metadata: Metadata = createPageMetadata({
  title: "Work",
  description,
  path: "/work",
});

export default function WorkPage() {
  const projects = getAllProjects();

  return (
    <>
      <PageIntro eyebrow="Work" title="Selected work" lead={description} />
      <Section spacing="none" className="pb-section">
        {projects.length > 0 ? (
          <ProjectList projects={projects} headingLevel={2} />
        ) : (
          <Text tone="muted">Case studies are being prepared.</Text>
        )}
      </Section>
    </>
  );
}
