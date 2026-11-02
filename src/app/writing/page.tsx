import { type Metadata } from "next";

import { type ArticleSummary } from "@/components/content/article-row";
import { WritingIndex } from "@/components/content/writing-index";
import { Section } from "@/components/layout/section";
import { PageIntro } from "@/components/sections/page-intro";
import { Text } from "@/components/ui/typography";
import { createPageMetadata } from "@/lib/metadata";
import { articleHref, getAllArticles, getReadingTime, getUsedCategories } from "@/lib/writing";

const lead =
  "Notes on frontend architecture, real-time and offline-first applications, design systems, performance and accessibility.";

export const metadata: Metadata = createPageMetadata({
  title: "Writing",
  description: lead,
  path: "/writing",
});

export default function WritingPage() {
  const articles: ArticleSummary[] = getAllArticles().map((article) => ({
    slug: article.slug,
    href: articleHref(article.slug),
    title: article.title,
    summary: article.summary,
    category: article.category,
    status: article.status,
    publishedAt: article.publishedAt,
    readingMinutes: getReadingTime(article.slug),
  }));

  return (
    <>
      <PageIntro eyebrow="Writing" title="Writing" lead={lead} />
      <Section spacing="none" className="pb-section" labelledBy="articles-title">
        <h2 id="articles-title" className="sr-only">
          Articles
        </h2>
        {articles.length > 0 ? (
          <WritingIndex articles={articles} categories={getUsedCategories()} />
        ) : (
          <Text tone="muted">No articles published yet.</Text>
        )}
      </Section>
    </>
  );
}
