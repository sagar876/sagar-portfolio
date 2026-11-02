"use client";

import { type ReactNode } from "react";

import { useHideOnScroll } from "@/hooks/use-hide-on-scroll";

/**
 * Sticky site header that slides away while scrolling down and returns on
 * scroll up (spec §A7). It always stays visible while anything inside it has
 * keyboard focus. The bottom rule appears only once the page has scrolled.
 */
export function StickyHeader({ children }: { children: ReactNode }) {
  const { hidden, scrolled } = useHideOnScroll();

  return (
    <header
      data-hidden={hidden}
      data-scrolled={scrolled}
      style={{ viewTransitionName: "site-header" }}
      className="sticky top-0 z-40 border-b border-transparent bg-background transition-[translate,border-color] duration-ui ease-standard data-[hidden=true]:not-focus-within:-translate-y-full data-[scrolled=true]:border-border"
    >
      {children}
    </header>
  );
}
