/**
 * About page copy.
 *
 * Statements of fact come from the positioning brief. Bracketed text is a
 * placeholder to replace. Sections marked DRAFT were written as a starting
 * point and should be rewritten in your own words before launch.
 */

export const aboutIntro = {
  title: "Frontend engineer and UI architect",
  lead: "I'm a Senior Frontend Engineer and UI Architect with 8 years of experience building with React, Next.js, TypeScript and JavaScript.",
  body: [
    "My work centres on frontend architecture: how large interfaces are split into parts, how those parts share data and design, and how teams keep shipping without slowing each other down. That has meant micro-frontends, real-time applications over WebSockets, offline-first clients, and the design systems and component libraries underneath them.",
    "[Add one or two sentences in your own words: what kind of products you like working on and what you are looking for next.]",
  ],
} as const;

/** DRAFT — principles derived from the positioning brief. Rewrite in your own words. */
export const aboutPhilosophy = {
  title: "How I work",
  statement:
    "Interfaces outlive the sprint they ship in. I build them to be read, changed and handed over.",
  principles: [
    {
      title: "Boundaries before features",
      text: "Decide where one part of the system ends and another begins before writing the first screen. Clear boundaries are what let teams and codebases grow.",
    },
    {
      title: "Accessible by default",
      text: "Accessibility belongs in shared components and engineering standards, so every team gets it without having to remember it.",
    },
    {
      title: "Measure, then optimise",
      text: "Set performance budgets early and measure against them, rather than guessing where time goes.",
    },
    {
      title: "Systems over one-offs",
      text: "A reusable component, documented once, saves more time than any clever single implementation.",
    },
  ],
} as const;

/** PLACEHOLDER — your career story, in a few short paragraphs. */
export const aboutJourney = {
  title: "Career journey",
  body: [
    "[How you started in frontend engineering and what drew you to it.]",
    "[The roles and problems that moved you from building features to shaping architecture.]",
    "[What you focus on now, and the kind of team you want to join.]",
  ],
  experienceLinkLabel: "Full experience",
} as const;

export const aboutExpertise = {
  title: "Areas of expertise",
} as const;

/**
 * Optional. Leave undefined to hide the section. Add only interests you are
 * happy for hiring managers to read, e.g. ["[Interest]", "[Interest]"].
 */
export const aboutInterests: { title: string; items: string[] } | undefined = undefined;

export const aboutResume = {
  title: "Resume",
  text: "My resume covers roles, dates and responsibilities in one page.",
  cta: "Download resume",
} as const;
