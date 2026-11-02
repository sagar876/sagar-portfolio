import { type Metadata } from "next";
import { notFound } from "next/navigation";

import { ReadingProgress } from "@/components/animations/reading-progress";
import { BlockRenderer } from "@/components/case-study/block-renderer";
import { CaseStudyHeader } from "@/components/case-study/case-study-header";
import { CaseStudySection } from "@/components/case-study/case-study-section";
import { RelatedProjects } from "@/components/case-study/related-projects";
import { Results } from "@/components/case-study/results";
import {
  type ContentsItem,
  ContentsDisclosure,
  TableOfContents,
} from "@/components/case-study/table-of-contents";
import { Container } from "@/components/layout/container";
import { caseStudySections } from "@/config/case-study";
import { createPageMetadata } from "@/lib/metadata";
import { getAllProjects, getProjectBySlug, getRelatedProjects, projectHref } from "@/lib/projects";

/** Every case study is generated at build time; unknown slugs return 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};

  return createPageMetadata({
    title: project.seo?.title ?? project.title,
    description: project.seo?.description ?? project.summary,
    path: projectHref(project.slug),
    type: "article",
    image: project.cover,
    noIndex: project.status === "example",
  });
}

export default async function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const body = project.caseStudy;
  const sections = caseStudySections.filter(({ key }) => body[key] !== undefined);
  const contents: ContentsItem[] = sections.map(({ key, title }) => ({ id: key, title }));

  return (
    <>
      <ReadingProgress />
      <article className="[counter-reset:figure]">
        <Container>
          <CaseStudyHeader project={project} />

          <div className="grid-page pt-12 pb-section desktop:pt-20">
            <aside className="hidden desktop:col-start-1 desktop:col-end-4 desktop:block">
              <div className="sticky top-24 pr-8">
                <TableOfContents items={contents} />
              </div>
            </aside>

            <div className="col-span-full min-w-0 desktop:col-start-4 desktop:col-end-13">
              <div className="mb-8 desktop:hidden">
                <ContentsDisclosure items={contents} />
              </div>

              {sections.map(({ key, title }) => {
                if (key === "results") {
                  return body.results ? (
                    <CaseStudySection key={key} id={key} title={title}>
                      <Results results={body.results} />
                    </CaseStudySection>
                  ) : null;
                }
                const blocks = body[key];
                return blocks ? (
                  <CaseStudySection key={key} id={key} title={title}>
                    <BlockRenderer blocks={blocks} />
                  </CaseStudySection>
                ) : null;
              })}
            </div>
          </div>
        </Container>
      </article>

      <RelatedProjects projects={getRelatedProjects(project)} />
    </>
  );
}
