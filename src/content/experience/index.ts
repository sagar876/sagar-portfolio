import { type ExperienceEntry } from "@/types/content";

/**
 * Employment history, newest first.
 *
 * PLACEHOLDERS: every bracketed value must be replaced with real details.
 * - Dates: ISO months ("2021-04"). Leave `end` undefined only for a current role.
 * - Responsibilities: what you owned.
 * - Accomplishments: only outcomes you can evidence. No estimated metrics.
 * - Technologies: what you used in the role, most important first.
 */
const placeholderRole: ExperienceEntry = {
  company: "[Company]",
  role: "[Role]",
  start: "[Start date]",
  end: "[End date]",
  location: "[Location]",
  employmentType: "[Full-time]",
  summary:
    "[One or two sentences about the company, the product and what your team was responsible for.]",
  responsibilities: [
    "[Responsibility — e.g. the area of the frontend you owned]",
    "[Responsibility — e.g. standards, reviews or mentoring you led]",
    "[Responsibility — e.g. collaboration with design, product or backend]",
  ],
  accomplishments: ["[Verified accomplishment]", "[Verified accomplishment]"],
  technologies: ["[Technology]", "[Technology]", "[Technology]", "[Technology]"],
};

export const experience: readonly ExperienceEntry[] = [
  placeholderRole,
  placeholderRole,
  { ...placeholderRole, accomplishments: undefined },
];
