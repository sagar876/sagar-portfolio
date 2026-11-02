import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Heading, type HeadingLevel, Label, Text } from "@/components/ui/typography";
import { formatDate } from "@/lib/format";
import { type ArticleCategory } from "@/types/content";

/** Serializable article summary, so the list can render in client components too. */
export type ArticleSummary = {
  slug: string;
  href: string;
  title: string;
  summary: string;
  category: ArticleCategory;
  status: "draft" | "published";
  publishedAt?: string;
  readingMinutes: number;
};

/** One article in the writing index: date, title and summary, category and reading time. */
export function ArticleRow({
  article,
  headingLevel = 2,
}: {
  article: ArticleSummary;
  headingLevel?: HeadingLevel;
}) {
  return (
    <Link
      href={article.href}
      className="group grid-page gap-y-2 border-b border-border py-6 transition-colors duration-ui ease-standard hover:bg-surface active:bg-surface-hover desktop:py-8"
    >
      <div className="col-span-full flex items-center gap-3 desktop:col-start-1 desktop:col-end-4 desktop:flex-col desktop:items-start desktop:gap-2 desktop:pl-2">
        {article.publishedAt ? (
          <Label as="time" dateTime={article.publishedAt}>
            {formatDate(article.publishedAt)}
          </Label>
        ) : (
          <Badge variant="subtle">Draft</Badge>
        )}
      </div>
      <div className="col-span-full flex min-w-0 flex-col gap-2 desktop:col-start-4 desktop:col-end-11">
        <Heading level={headingLevel} size="h3">
          {article.title}
        </Heading>
        <Text tone="secondary" measure>
          {article.summary}
        </Text>
        <Label as="p" className="pt-1">
          {article.category} · {article.readingMinutes} min read
        </Label>
      </div>
      <ArrowRight
        aria-hidden="true"
        strokeWidth={1.75}
        className="hidden size-5 self-center justify-self-end text-fg transition-transform duration-micro ease-standard group-hover:translate-x-1 desktop:col-start-12 desktop:col-end-13 desktop:mr-2 desktop:block"
      />
    </Link>
  );
}
