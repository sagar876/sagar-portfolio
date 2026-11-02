import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ViewTransition } from "react";

import { CaseStudyImage } from "@/components/case-study/case-study-figure";
import { Reveal } from "@/components/animations/reveal";
import { Grid, GridItem } from "@/components/layout/grid";
import { Badge } from "@/components/ui/badge";
import { TextLink } from "@/components/ui/text-link";
import { Heading, Label, Text } from "@/components/ui/typography";
import { coverTransitionName } from "@/lib/projects";
import { type Project } from "@/types/content";

/** Title block, summary, project facts (colophon) and cover image. */
export function CaseStudyHeader({ project }: { project: Project }) {
  const facts = [
    { term: "Role", value: project.role },
    { term: "Company", value: project.company },
    { term: "Timeline", value: project.timeline },
    { term: "Team", value: project.teamSize },
    { term: "Stack", value: project.stack.join(", ") },
  ].filter((fact): fact is { term: string; value: string } => Boolean(fact.value));

  return (
    <header className="flex flex-col gap-12 pt-10 desktop:gap-16 desktop:pt-16">
      <Grid rowGap="md">
        <GridItem span="full">
          <Link
            href="/work"
            className="group inline-flex min-h-11 items-center gap-2 text-small font-medium text-fg-secondary hover:text-fg"
          >
            <ArrowLeft
              aria-hidden="true"
              strokeWidth={1.75}
              className="size-4 transition-transform duration-micro ease-standard group-hover:-translate-x-1"
            />
            All work
          </Link>
        </GridItem>

        <GridItem span="rail" className="flex flex-col items-start gap-3">
          <Label as="p" tone="primary">
            {project.category}
          </Label>
          {project.status === "example" && <Badge status>Example content</Badge>}
        </GridItem>

        <GridItem span="main" className="flex flex-col gap-6 desktop:col-end-12">
          <Reveal>
            <Heading level={1} size="display">
              {project.title}
            </Heading>
          </Reveal>
          <Reveal index={1}>
            <Text size="lg" tone="secondary" measure>
              {project.summary}
            </Text>
          </Reveal>
          {project.status === "example" && (
            <Text size="sm" tone="muted" measure>
              This page uses placeholder content to show the case-study layout. It does not describe
              a real project.
            </Text>
          )}
        </GridItem>

        <GridItem span="main" className="desktop:col-end-13">
          <dl className="grid grid-cols-2 border-t border-fg tablet:grid-cols-3 wide:grid-cols-5">
            {facts.map((fact) => (
              <div key={fact.term} className="flex flex-col gap-1 border-b border-border py-4 pr-4">
                <Label as="dt">{fact.term}</Label>
                <dd className="text-small text-fg">{fact.value}</dd>
              </div>
            ))}
          </dl>
          {project.links && project.links.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
              {project.links.map((link) => (
                <li key={link.href}>
                  <TextLink href={link.href} className="text-small font-medium">
                    {link.label}
                  </TextLink>
                </li>
              ))}
            </ul>
          )}
        </GridItem>
      </Grid>

      {project.cover && (
        // Same name as the project card's preview, so the image morphs between pages.
        <ViewTransition name={coverTransitionName(project.slug)} share="morph" default="none">
          <div>
            <CaseStudyImage
              image={{ ...project.cover }}
              sizes="(min-width: 90rem) 84rem, calc(100vw - 2.5rem)"
            />
          </div>
        </ViewTransition>
      )}
    </header>
  );
}
