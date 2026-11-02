"use client";

import { AnimatePresence, domMax, LazyMotion, m, MotionConfig } from "motion/react";
import { useState } from "react";

import { type ArticleSummary, ArticleRow } from "@/components/content/article-row";
import { cn } from "@/lib/cn";
import { type ArticleCategory } from "@/types/content";

type WritingIndexProps = {
  articles: readonly ArticleSummary[];
  categories: readonly ArticleCategory[];
};

const ALL = "All";

/**
 * Article list with category filter. Buttons expose their state with
 * aria-pressed, and a live region announces how many articles are shown.
 *
 * Filtering animates with Motion: remaining rows spring to their new position
 * and removed rows fade, so it is clear what changed. The server-rendered list
 * is static (`initial={false}`), so nothing is hidden before JavaScript runs.
 * Reduced motion keeps the fades and drops the movement.
 */
export function WritingIndex({ articles, categories }: WritingIndexProps) {
  const [active, setActive] = useState<ArticleCategory | typeof ALL>(ALL);
  const visible = active === ALL ? articles : articles.filter((a) => a.category === active);
  const options = [ALL, ...categories] as const;

  return (
    <div className="flex flex-col gap-8">
      <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isActive = option === active;
          return (
            <button
              key={option}
              type="button"
              aria-pressed={isActive}
              onClick={() => setActive(option)}
              className={cn(
                "inline-flex min-h-11 items-center border px-4 text-small font-medium transition-[color,background-color,border-color,scale] duration-ui ease-standard active:scale-97",
                isActive
                  ? "border-action bg-action text-on-action"
                  : "border-border-strong text-fg hover:border-fg active:bg-surface-hover",
              )}
            >
              {option}
            </button>
          );
        })}
      </div>

      <p aria-live="polite" className="sr-only">
        {visible.length} {visible.length === 1 ? "article" : "articles"} shown
      </p>

      <LazyMotion features={domMax} strict>
        <MotionConfig reducedMotion="user">
          <ul className="border-t border-border">
            <AnimatePresence initial={false} mode="popLayout">
              {visible.map((article) => (
                <m.li
                  key={article.slug}
                  layout="position"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    layout: { type: "spring", stiffness: 380, damping: 36 },
                    opacity: { duration: 0.2, ease: [0.2, 0, 0, 1] },
                  }}
                >
                  <ArticleRow article={article} />
                </m.li>
              ))}
            </AnimatePresence>
          </ul>
        </MotionConfig>
      </LazyMotion>
    </div>
  );
}
