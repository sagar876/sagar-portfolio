import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { ProjectPreview } from "@/components/content/project-preview";
import { Grid, GridItem } from "@/components/layout/grid";
import { Badge } from "@/components/ui/badge";
import { Heading, type HeadingLevel, Label, Text } from "@/components/ui/typography";
import { coverTransitionName, projectHref } from "@/lib/projects";
import { type Project } from "@/types/content";

type ProjectCardProps = {
  project: Project;
  /**
   * `row`: one line in the work index (spec §A8). Use inside ProjectList.
   * `featured`: large preview with details, for the homepage (3–4 projects).
   */
  variant?: "row" | "featured";
  headingLevel?: HeadingLevel;
};

export function ProjectCard({ project, variant = "row", headingLevel = 3 }: ProjectCardProps) {
  return variant === "featured" ? (
    <FeaturedCard project={project} headingLevel={headingLevel} />
  ) : (
    <RowCard project={project} headingLevel={headingLevel} />
  );
}

function RowCard({ project, headingLevel }: { project: Project; headingLevel: HeadingLevel }) {
  const meta = [project.role, ...project.stack.slice(0, 2)].join(" · ");

  return (
    <Link
      href={projectHref(project.slug)}
      className="group grid grid-cols-[4.5rem_minmax(0,1fr)_auto] items-baseline gap-x-4 gap-y-1 border-b border-border px-2 py-5 transition-colors duration-ui ease-standard hover:bg-surface active:bg-surface-hover desktop:grid-cols-[6rem_minmax(0,1.3fr)_minmax(0,1fr)_2rem] desktop:py-6"
    >
      <Label>{project.timeline}</Label>
      <Heading
        level={headingLevel}
        size="h3"
        className="flex flex-wrap items-center gap-x-3 gap-y-1"
      >
        <span className="link-grow">{project.title}</span>
        {project.status === "example" && <Badge variant="subtle">Example</Badge>}
      </Heading>
      <Label className="col-start-2 desktop:col-start-3 desktop:row-start-1">{meta}</Label>
      <ArrowRight
        aria-hidden="true"
        strokeWidth={1.75}
        className="col-start-3 row-start-1 size-5 self-center justify-self-end text-fg transition-transform duration-micro ease-standard group-hover:translate-x-1 desktop:col-start-4"
      />
    </Link>
  );
}

function FeaturedCard({ project, headingLevel }: { project: Project; headingLevel: HeadingLevel }) {
  const href = projectHref(project.slug);
  const titleId = `project-${project.slug}`;

  return (
    <article aria-labelledby={titleId} className="group/card flex flex-col gap-6 desktop:gap-10">
      {/* Duplicate of the case-study link for pointer users; hidden from keyboard and screen readers. */}
      <Link href={href} tabIndex={-1} aria-hidden="true" className="block reveal-on-scroll">
        <ProjectPreview image={project.cover} transitionName={coverTransitionName(project.slug)} />
      </Link>
      <Grid rowGap="sm">
        <GridItem span="rail" className="flex flex-col gap-1">
          <Label as="p" tone="primary">
            {project.category}
          </Label>
          {project.timeline && <Label as="p">{project.timeline}</Label>}
          {project.status === "example" && (
            <Badge variant="subtle" className="mt-2 self-start">
              Example
            </Badge>
          )}
        </GridItem>
        <GridItem span="main" className="flex flex-col gap-5 desktop:col-end-12">
          <Heading level={headingLevel} size="h1" id={titleId}>
            {project.title}
          </Heading>
          <Text size="lg" tone="secondary" measure>
            {project.summary}
          </Text>
          <ul aria-label="Technologies" className="flex flex-wrap gap-x-3 gap-y-1">
            {project.stack.map((tech, index) => (
              <li key={`${index}-${tech}`} className="flex items-center gap-3">
                {index > 0 && (
                  <span aria-hidden="true" className="text-fg-muted">
                    /
                  </span>
                )}
                <Label>{tech}</Label>
              </li>
            ))}
          </ul>
          <div>
            <Link
              href={href}
              className="inline-flex min-h-11 items-center gap-2 text-body font-medium underline decoration-current decoration-1 underline-offset-4 transition-colors duration-micro ease-standard group-hover/card:decoration-accent active:text-fg-secondary"
            >
              Read case study<span className="sr-only">: {project.title}</span>
              <ArrowRight
                aria-hidden="true"
                strokeWidth={1.75}
                className="size-4 transition-transform duration-micro ease-standard group-hover/card:translate-x-1"
              />
            </Link>
          </div>
        </GridItem>
      </Grid>
    </article>
  );
}

/** Index of project rows with the closing top rule. */
export function ProjectList({
  projects,
  headingLevel = 3,
}: {
  projects: readonly Project[];
  headingLevel?: HeadingLevel;
}) {
  return (
    <ul className="border-t border-border">
      {projects.map((project) => (
        <li key={project.slug}>
          <ProjectCard project={project} headingLevel={headingLevel} />
        </li>
      ))}
    </ul>
  );
}
