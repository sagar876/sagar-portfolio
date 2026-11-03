import { type ExperienceEntry } from "@/types/content";

/**
 * Employment history, newest first. Source: Sagar's two resumes
 * ("Senior Frontend Engineer" CV and "UI Architect" CV), merged. Nothing here
 * goes beyond what those documents state.
 */
export const experience: readonly ExperienceEntry[] = [
  {
    company: "Self-employed",
    role: "Freelance Engineer",
    start: "2026-02",
    location: "Remote",
    employmentType: "Freelance",
    responsibilities: [
      "Ship pixel-perfect, responsive and WCAG-compliant web applications for freelance clients.",
      "Tuned and optimised the performance of internal dashboards for a Goa-based client.",
    ],
  },
  {
    company: "AirFi.aero",
    role: "Senior Frontend Engineer",
    start: "2024-05",
    end: "2026-01",
    location: "Bangalore",
    employmentType: "Full-time",
    summary:
      "Owned frontend architecture for global airline platforms, and set the code-quality, review and delivery standards the frontend team adopted.",
    responsibilities: [
      "Architected an offline-first PWA sync engine with background sync, request queuing and conflict resolution, so operations teams could capture data reliably in low-connectivity environments.",
      "Designed the WebSocket real-time layer for live device tracking, flight monitoring and operational messaging.",
      "Secured UI routing and data access across the platform with a platform-wide RBAC system.",
      "Built accessible, WCAG-compliant airline UIs with semantic HTML, ARIA, keyboard navigation and screen-reader testing.",
      "Mentored engineers on the frontend team.",
    ],
    accomplishments: [
      "Launched a GPT-powered Airline Copilot, a conversational interface giving passengers itinerary insights.",
      "Improved Core Web Vitals (LCP, INP) and responsiveness on the Analytics and Admin dashboards through batched API requests, advanced filtering and real-time data pipelines.",
      "Led the migration to Next.js, TypeScript and Tailwind CSS, raising type safety, maintainability and delivery speed.",
    ],
    technologies: [
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "WebSockets",
      "PWA / offline sync",
      "RBAC",
      "LLM / GPT integration",
    ],
  },
  {
    company: "Fabric.inc",
    role: "Senior Software Engineer (SDE-2)",
    start: "2021-05",
    end: "2023-11",
    location: "Bangalore",
    employmentType: "Full-time",
    responsibilities: [
      "Architected UI Library 2.0 in React and TypeScript: one unified, reusable design system for every product.",
      "Led a team of engineers from technical design and scoping through to delivery, aligned with product stakeholders.",
      "Kept cross-team delivery consistent and resolved customer issues promptly.",
    ],
    accomplishments: [
      "Re-architected the legacy admin portal, cutting load time from ~7–8s to 2–3s and bringing LCP under 2.5s with route-based code splitting, lazy loading and removal of render-blocking scripts.",
    ],
    technologies: ["React", "TypeScript", "Design systems", "Code splitting"],
  },
  {
    company: "Spacejoy",
    role: "Senior Software Engineer",
    start: "2020-08",
    end: "2021-04",
    location: "Bangalore",
    employmentType: "Full-time",
    responsibilities: [
      "Replaced global CSS with component-scoped styled-components, eliminating style collisions and reducing CSS bundle size.",
    ],
    technologies: ["React", "styled-components"],
  },
  {
    company: "Happay",
    role: "Software Engineer",
    start: "2019-05",
    end: "2020-08",
    location: "Bangalore",
    employmentType: "Full-time",
    responsibilities: [
      "Planned and led a full-codebase React 15 to 16 migration, completed in one week with zero production regressions.",
    ],
    accomplishments: ["Core dashboards loading in 2–3s."],
    technologies: ["React"],
  },
  {
    company: "Ninestack",
    role: "Frontend Engineer",
    start: "2016-05",
    end: "2019-04",
    location: "Goa",
    employmentType: "Full-time",
    responsibilities: [
      "Led the company's CMS platform and shipped 15+ responsive websites.",
      "Mentored 2 interns.",
    ],
    accomplishments: [
      "The CMS became the company's most profitable platform, adopted by 50+ clients within 4 months.",
      "Employee of the Year, Employee of the Month and Emerging Leader of the Year (2017–2018).",
    ],
  },
];

export const education = {
  degree: "B.E., Goa Engineering College",
  year: "2015",
  certifications: ["JavaScript Algorithms & Data Structures — freeCodeCamp"],
  awards: [
    "Employee of the Year, Employee of the Month, Emerging Leader of the Year — Ninestack (2017–2018)",
  ],
} as const;
