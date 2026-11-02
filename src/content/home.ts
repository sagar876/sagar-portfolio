/**
 * Homepage copy. Every sentence here restates the positioning brief; nothing
 * claims a metric, employer or achievement. Edit freely.
 */

export const heroContent = {
  positioning: "Senior Frontend Engineer / UI Architect",
  intro:
    "I design and build the frontend architecture of React and Next.js products: micro-frontends, real-time WebSocket interfaces, offline-first applications, and the design systems that keep them consistent.",
  primaryCta: { label: "Explore my work", href: "#selected-work" },
  facts: [
    { term: "Experience", value: "8 years" },
    { term: "Focus", value: "Frontend architecture" },
    { term: "Stack", value: "React, Next.js, TypeScript" },
  ],
} as const;

export const workContent = {
  title: "Selected work",
  description:
    "Case studies on architecture decisions, the constraints behind them and what changed.",
  allWorkLabel: "All work",
} as const;

export const experienceContent = {
  title: "Experience",
  resumeNote: "Full history, dates and responsibilities are in my resume.",
} as const;

export const capabilitiesContent = {
  title: "Engineering capabilities",
} as const;

/**
 * DRAFT — written from the positioning brief as a starting point.
 * Replace with your own words before launch.
 */
export const philosophyContent = {
  label: "Approach",
  statement:
    "Interfaces outlive the sprint they ship in. I build them to be read, changed and handed over: clear boundaries between parts, components that carry their own accessibility, and performance budgets set before the first feature rather than after the last.",
} as const;

export const aboutPreviewContent = {
  title: "About",
  body: "I'm a Senior Frontend Engineer and UI Architect with 8 years of experience in React, Next.js, TypeScript and JavaScript. My work centres on frontend architecture and the systems around it: micro-frontends, real-time and offline-first applications, performance, design systems and engineering standards for accessibility.",
  linkLabel: "More about me",
} as const;

export const contactContent = {
  label: "Contact",
  title: "Hiring a senior frontend engineer?",
  body: "Get in touch about senior frontend and UI architecture roles. Email is the quickest way to reach me.",
  fallbackCta: "Get in touch",
} as const;
