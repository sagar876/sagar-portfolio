/**
 * Content models. Content lives in src/content and is rendered by components;
 * components never hard-code portfolio copy.
 *
 * Only real, verifiable details belong in content files. Leave a field
 * undefined rather than guessing at dates, metrics or company names.
 */

import { type CaseStudyBody, type ImageAsset } from "@/types/case-study";

export type ProjectLink = {
  label: string;
  href: string;
};

/** Kept for card previews; a 16:10 crop of the cover is used. */
export type ProjectImage = Pick<ImageAsset, "src" | "alt" | "illustration">;

export type Project = {
  slug: string;
  /**
   * `example`: placeholder content that demonstrates the layout. Shown with an
   * "Example" label and excluded from search engines.
   * `published`: real, verified project.
   */
  status: "example" | "published";
  title: string;
  /** One or two sentences: the problem, your role and the approach. */
  summary: string;
  /** Kind of work, e.g. "Design system" or "Real-time platform". */
  category: string;
  role: string;
  company?: string;
  /** Display string, e.g. "2023–2024". */
  timeline?: string;
  /** e.g. "6 engineers, 1 designer". Only when known. */
  teamSize?: string;
  stack: string[];
  /** Shown on the homepage. Keep to 3–4 projects. */
  featured?: boolean;
  /**
   * Set false to keep a page reachable by URL but out of every listing,
   * related links and the sitemap (used for the case-study template).
   */
  listed?: boolean;
  /** Preview image (cards, case-study hero, social sharing). Without it, a neutral placeholder panel is shown. */
  cover?: ImageAsset;
  /** Public links only: live product, repository, talk. */
  links?: ProjectLink[];
  /** Slugs of related projects. Falls back to the next projects in the list. */
  related?: string[];
  /** Overrides for search and social previews. */
  seo?: { title?: string; description?: string };
  caseStudy: CaseStudyBody;
};

export type ExperienceEntry = {
  company: string;
  role: string;
  /** ISO month, e.g. "2021-04". Non-ISO text (a placeholder) is shown as written. */
  start: string;
  /** ISO month, or undefined for a current role. */
  end?: string;
  location?: string;
  /** e.g. "Full-time", "Contract". */
  employmentType?: string;
  /** One or two sentences about the company and the team's remit. */
  summary?: string;
  /** What you were responsible for. */
  responsibilities: string[];
  /**
   * Verified accomplishments only: outcomes you could show evidence for in an
   * interview. No estimated or rounded-up metrics.
   */
  accomplishments?: string[];
  technologies?: string[];
};
