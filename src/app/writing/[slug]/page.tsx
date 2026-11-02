import { ArrowLeft } from "lucide-react";
import { type Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ReadingProgress } from "@/components/animations/reading-progress";
import { Reveal } from "@/components/animations/reveal";
import { ArticleRow } from "@/components/content/article-row";
import { Container } from "@/components/layout/container";
import { Grid, GridItem } from "@/components/layout/grid";
import { Section } from "@/components/layout/section";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";
import { Heading, Label, Text } from "@/components/ui/typography";
import { siteConfig } from "@/config/site";
import { formatDate } from "@/lib/format";
import { createPageMetadata } from "@/lib/metadata";
import {
  articleHref,
  getAllArticles,
  getArticle,
  getMoreArticles,
  getReadingTime,
} from "@/lib/writing";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllArticles().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/writing/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};

  const metadata = createPageMetadata({
    title: article.title,
    description: article.summary,
    path: articleHref(article.slug),
    type: "article",
    noIndex: article.status === "draft",
  });

  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      type: "article",
      authors: [siteConfig.name],
      section: article.category,
      ...(article.publishedAt ? { publishedTime: article.publishedAt } : {}),
      ...(article.updatedAt ? { modifiedTime: article.updatedAt } : {}),
    },
  };
}

export default async function ArticlePage({ params }: PageProps<"/writing/[slug]">) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const { default: Body } = (await import(`@/content/writing/${slug}.mdx`)) as {
    default: React.ComponentType;
  };
  const readingMinutes = getReadingTime(slug);
  const moreArticles = getMoreArticles(article).map((more) => ({
    slug: more.slug,
    href: articleHref(more.slug),
    title: more.title,
    summary: more.summary,
    category: more.category,
    status: more.status,
    publishedAt: more.publishedAt,
    readingMinutes: getReadingTime(more.slug),
  }));

  return (
    <>
      <ReadingProgress />
      <article aria-labelledby="article-title">
        <Container>
          <header className="pt-10 pb-12 desktop:pt-16 desktop:pb-16">
            <Grid rowGap="md">
              <GridItem span="full">
                <Link
                  href="/writing"
                  className="group inline-flex min-h-11 items-center gap-2 text-small font-medium text-fg-secondary hover:text-fg"
                >
                  <ArrowLeft
                    aria-hidden="true"
                    strokeWidth={1.75}
                    className="size-4 transition-transform duration-micro ease-standard group-hover:-translate-x-1"
                  />
                  All writing
                </Link>
              </GridItem>

              <GridItem span="rail" className="flex flex-col items-start gap-2">
                <Label as="p" tone="primary">
                  {article.category}
                </Label>
                {article.publishedAt ? (
                  <Label as="time" dateTime={article.publishedAt}>
                    {formatDate(article.publishedAt)}
                  </Label>
                ) : (
                  <Badge status>Draft</Badge>
                )}
                <Label as="p">{readingMinutes} min read</Label>
              </GridItem>

              <GridItem span="main" className="flex flex-col gap-6 desktop:col-end-12">
                <Reveal>
                  <Heading level={1} size="display" id="article-title">
                    {article.title}
                  </Heading>
                </Reveal>
                <Reveal index={1}>
                  <Text size="lg" tone="secondary" measure>
                    {article.summary}
                  </Text>
                </Reveal>
                {article.status === "draft" && (
                  <Text size="sm" tone="muted" measure>
                    This article is a draft outline and has not been published yet.
                  </Text>
                )}
              </GridItem>
            </Grid>
          </header>

          <Grid className="border-t border-border pt-12 pb-section desktop:pt-16">
            <GridItem span="main" className="flex flex-col gap-6 desktop:col-end-12">
              <Body />
            </GridItem>
          </Grid>
        </Container>
      </article>

      {moreArticles.length > 0 && (
        <Section divider labelledBy="more-writing-title">
          <SectionHeading
            id="more-writing-title"
            label="Writing"
            title="More writing"
            action={{ label: "All writing", href: "/writing" }}
          />
          <ul className="border-t border-border">
            {moreArticles.map((more) => (
              <li key={more.slug}>
                <ArticleRow article={more} headingLevel={3} />
              </li>
            ))}
          </ul>
        </Section>
      )}
    </>
  );
}
