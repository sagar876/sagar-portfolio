import { ProjectCard } from "@/components/content/project-card";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { workContent } from "@/content/home";
import { getFeaturedProjects } from "@/lib/projects";

export function SelectedWork() {
  const featuredProjects = getFeaturedProjects();
  if (featuredProjects.length === 0) return null;

  return (
    <Section id="selected-work" labelledBy="selected-work-title" divider>
      <SectionHeading
        id="selected-work-title"
        label="Work"
        title={workContent.title}
        description={workContent.description}
        action={{ label: workContent.allWorkLabel, href: "/work" }}
      />
      <ul className="flex flex-col gap-24 desktop:gap-40">
        {featuredProjects.map((project) => (
          <li key={project.slug}>
            <ProjectCard project={project} variant="featured" />
          </li>
        ))}
      </ul>
    </Section>
  );
}
