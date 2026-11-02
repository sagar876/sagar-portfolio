import { ProjectList } from "@/components/content/project-card";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { type Project } from "@/types/content";

export function RelatedProjects({ projects }: { projects: readonly Project[] }) {
  if (projects.length === 0) return null;

  return (
    <Section labelledBy="related-title" divider>
      <SectionHeading
        id="related-title"
        label="More work"
        title="Related projects"
        action={{ label: "All work", href: "/work" }}
      />
      <ProjectList projects={projects} />
    </Section>
  );
}
