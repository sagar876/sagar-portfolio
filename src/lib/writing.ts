import { readFileSync } from "node:fs";
import path from "node:path";

import { articles } from "@/content/writing";
import { type Article, articleCategories, type ArticleCategory } from "@/types/content";

/*
 * Article queries. Server-only: reading time is computed from the MDX source
 * at build time.
 */

const WORDS_PER_MINUTE = 230;
const CONTENT_DIR = path.join(process.cwd(), "src/content/writing");

function sourcePath(slug: string) {
  return path.join(CONTENT_DIR, `${slug}.mdx`);
}

function validate(list: readonly Article[]) {
  const slugs = new Set<string>();
  for (const article of list) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.slug)) {
      throw new Error(`Article slug "${article.slug}" must be lowercase kebab-case.`);
    }
    if (slugs.has(article.slug)) throw new Error(`Duplicate article slug "${article.slug}".`);
    slugs.add(article.slug);
    try {
      readFileSync(sourcePath(article.slug));
    } catch {
      throw new Error(
        `Article "${article.slug}" has no file at src/content/writing/${article.slug}.mdx.`,
      );
    }
  }
}

validate(articles);

/** Published articles newest first, then drafts in registry order. */
export function getAllArticles(): Article[] {
  const published = articles
    .filter((article) => article.status === "published")
    .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));
  const drafts = articles.filter((article) => article.status === "draft");
  return [...published, ...drafts];
}

export function getArticle(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug);
}

/** Categories that have at least one article, in the configured order. */
export function getUsedCategories(): ArticleCategory[] {
  return articleCategories.filter((category) =>
    articles.some((article) => article.category === category),
  );
}

/** Estimated minutes to read, from prose words (code blocks count at half weight). */
export function getReadingTime(slug: string): number {
  const source = readFileSync(sourcePath(slug), "utf8");
  const code = source.match(/```[\s\S]*?```/g)?.join(" ") ?? "";
  const prose = source.replace(/```[\s\S]*?```/g, " ").replace(/<[^>]+>/g, " ");
  const count = (text: string) => text.split(/\s+/).filter(Boolean).length;
  const words = count(prose) + count(code) / 2;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

export function articleHref(slug: string): `/writing/${string}` {
  return `/writing/${slug}`;
}

/** Other articles, same category first. */
export function getMoreArticles(article: Article, limit = 2): Article[] {
  const others = getAllArticles().filter((a) => a.slug !== article.slug);
  const sameCategory = others.filter((a) => a.category === article.category);
  return [...sameCategory, ...others.filter((a) => a.category !== article.category)].slice(
    0,
    limit,
  );
}
