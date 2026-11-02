"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { Label } from "@/components/ui/typography";
import { cn } from "@/lib/cn";

export type ContentsItem = { id: string; title: string };

/**
 * Sticky contents list for desktop. Highlights the section currently being read
 * (scroll-spy) and marks it with aria-current for assistive tech.
 */
export function TableOfContents({ items }: { items: readonly ContentsItem[] }) {
  const [activeId, setActiveId] = useState<string | undefined>(items[0]?.id);
  const listRef = useRef<HTMLOListElement>(null);
  const [markerY, setMarkerY] = useState<number | undefined>(undefined);

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    // A section is "current" once its top crosses the upper third of the viewport.
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [items]);

  // Position the single marker beside the active link. It moves with a CSS
  // transition (compositor-only translate), so there is no layout work.
  useLayoutEffect(() => {
    const link = listRef.current?.querySelector<HTMLElement>(`a[href="#${activeId}"]`);
    if (link) setMarkerY(link.offsetTop + link.offsetHeight / 2);
  }, [activeId]);

  return (
    <nav aria-label="Contents" className="flex flex-col gap-4">
      <Label as="p">Contents</Label>
      <ol ref={listRef} className="relative flex flex-col border-t border-border">
        <span
          aria-hidden="true"
          data-contents-marker
          className={cn(
            "absolute top-0 left-0 size-1.5 bg-accent transition-[translate,opacity] duration-ui ease-standard",
            markerY === undefined && "opacity-0",
          )}
          // Centre the 6px marker on the link: offset by half its own height.
          style={markerY === undefined ? undefined : { translate: `0 calc(${markerY}px - 50%)` }}
        />
        {items.map((item) => {
          const isActive = item.id === activeId;
          return (
            <li key={item.id} className="border-b border-border">
              <a
                href={`#${item.id}`}
                aria-current={isActive ? "location" : undefined}
                className={cn(
                  "flex min-h-10 items-center py-2 pl-4 text-small transition-colors duration-micro ease-standard hover:text-fg",
                  isActive ? "font-medium text-fg" : "text-fg-secondary",
                )}
              >
                {item.title}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/** Collapsible contents list for mobile and tablet. Works without JavaScript. */
export function ContentsDisclosure({ items }: { items: readonly ContentsItem[] }) {
  return (
    <details className="group border-y border-border">
      <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between font-mono text-label text-fg uppercase [&::-webkit-details-marker]:hidden">
        Contents
        <span
          aria-hidden="true"
          className="text-body transition-transform duration-ui group-open:rotate-45"
        >
          +
        </span>
      </summary>
      <nav aria-label="Contents">
        <ol className="flex flex-col pb-4">
          {items.map((item) => (
            <li key={item.id}>
              <a href={`#${item.id}`} className="flex min-h-11 items-center text-body text-fg">
                {item.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </details>
  );
}
