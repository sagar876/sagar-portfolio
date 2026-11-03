/**
 * Homepage copy. Every sentence here restates the positioning brief; nothing
 * claims a metric, employer or achievement. Edit freely.
 */

export const heroContent = {
  positioning: "Senior Frontend Engineer / UI Architect",
  intro:
    "I design scalable React, Next.js and TypeScript platforms. Most recently I owned frontend architecture for global airline platforms at AirFi: an offline-first sync engine, a real-time WebSocket layer and platform-wide access control.",
  primaryCta: { label: "Explore my work", href: "#selected-work" },
  facts: [
    { term: "Experience", value: "9+ years" },
    { term: "Focus", value: "Frontend architecture" },
    { term: "Stack", value: "React, Next.js, TypeScript" },
  ],
} as const;

export const workContent = {
  title: "Selected work",
  description:
    "Products and platforms I've built, from airline operations and finance to publishing and fitness.",
  allWorkLabel: "All work",
} as const;

export const experienceContent = {
  title: "Experience",
  resumeNote: "Full history, dates and responsibilities are in my resume.",
} as const;

export const capabilitiesContent = {
  title: "Engineering capabilities",
} as const;

export const aboutPreviewContent = {
  title: "About",
  body: "I'm a Senior Frontend Engineer and UI Architect with 9+ years of experience across travel, FinTech, ecommerce and SaaS. I've led frontend architecture for global airline platforms at AirFi, built a company-wide component library at Fabric, and cut a legacy portal's load time from ~7–8s to 2–3s.",
  linkLabel: "More about me",
} as const;

export const contactContent = {
  label: "Contact",
  title: "Hiring a senior frontend engineer?",
  body: "Get in touch about senior frontend and UI architecture roles. Email is the quickest way to reach me.",
  fallbackCta: "Get in touch",
} as const;
