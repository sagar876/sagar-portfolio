/**
 * About page copy.
 *
 * Statements of fact come from the positioning brief. Bracketed text is a
 * placeholder to replace.
 */

export const aboutIntro = {
  title: "Frontend engineer and UI architect",
  lead: "I'm a Senior Frontend Engineer and UI Architect with 9+ years designing scalable React, Next.js and TypeScript platforms across travel, FinTech, ecommerce and SaaS.",
  body: [
    "My work centres on frontend architecture: real-time and offline-first systems, access control, design systems and performance standards. I've led frontend architecture for global airline platforms at AirFi, built a company-wide component library at Fabric, and mentored the engineers I've worked with.",
    "I'm based in Goa, India, available immediately and open to relocating for the right senior frontend or UI architecture role.",
  ],
} as const;

/** Career story, from the resumes. */
export const aboutJourney = {
  title: "Career journey",
  body: [
    "I started in 2016 as a frontend engineer at Ninestack in Goa, where I led the CMS platform that became the company's most profitable product, shipped more than 15 responsive websites and mentored two interns.",
    "In Bangalore I worked at Happay, Spacejoy and Fabric. I led a full-codebase React 15 to 16 migration in a week with zero regressions, moved a codebase from global CSS to component-scoped styles, and architected UI Library 2.0, the design system shared across Fabric's products.",
    "At AirFi I owned frontend architecture for global airline platforms: an offline-first sync engine, a real-time WebSocket layer, platform-wide RBAC and a GPT-powered Airline Copilot. Since February 2026 I've worked as a freelance engineer.",
  ],
  experienceLinkLabel: "Full experience",
} as const;

export const aboutExpertise = {
  title: "Areas of expertise",
} as const;

/** Personal interests, as Sagar described them. Set to undefined to hide the section. */
export const aboutInterests: { title: string; items: string[] } | undefined = {
  title: "Outside work",
  items: [
    "Cats, especially Persian cats",
    "Travelling and discovering new places",
    "Technology and experimentation",
    "Building interesting digital products",
  ],
};

export const aboutResume = {
  title: "Resume",
  text: "My resume covers roles, dates and responsibilities in one page.",
  cta: "Download resume",
} as const;
