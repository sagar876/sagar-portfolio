import { type Project } from "@/types/content";

/** Source: both resumes (AirFi, May 2024 – Jan 2026). */
export const airfiRealtimePlatform: Project = {
  slug: "airfi-realtime-platform",
  status: "published",
  title: "Real-time operations platform",
  summary:
    "The WebSocket real-time layer behind live device tracking, flight monitoring and operational messaging, secured with platform-wide role-based access control.",
  category: "Real-time architecture",
  role: "Senior Frontend Engineer, frontend architecture owner",
  company: "AirFi.aero",
  timeline: "2024–2026",
  stack: ["WebSockets", "React", "Next.js", "TypeScript", "RBAC"],
  featured: true,
  cover: {
    src: "/images/projects/airfi-realtime-platform/cover.png",
    alt: "Illustration of an in-flight operations dashboard: flight progress and altitude, entertainment usage by category, a cabin seat map of connected devices and a live messages feed.",
    width: 2400,
    height: 1500,
    illustration: true,
  },
  related: ["airfi-offline-sync", "airfi-airline-copilot"],
  caseStudy: {
    overview: [
      {
        type: "paragraph",
        text: "I designed the WebSocket real-time layer used across AirFi's global airline platforms for live device tracking, flight monitoring and operational messaging, and a platform-wide RBAC system that secures UI routing and data access. The platform's dashboards cover in-flight entertainment and live flight data.",
      },
    ],
    role: [
      {
        type: "list",
        items: [
          "Designed the WebSocket real-time layer.",
          "Built the platform-wide RBAC system for UI routing and data access.",
          "Improved Core Web Vitals (LCP, INP) and responsiveness on the Analytics and Admin dashboards through batched API requests, advanced filtering and real-time data pipelines.",
          "Led the migration to Next.js, TypeScript and Tailwind CSS.",
        ],
      },
    ],
    architecture: [
      {
        type: "architecture-diagram",
        title: "Platform overview, simplified",
        layers: [
          {
            label: "Features",
            nodes: [
              { label: "Device tracking" },
              { label: "Flight monitoring" },
              { label: "Operational messaging" },
            ],
          },
          {
            label: "Real-time",
            nodes: [
              { label: "WebSocket layer", note: "Live updates to every feature", highlight: true },
            ],
          },
          {
            label: "Access",
            nodes: [{ label: "RBAC", note: "Secures routing and data access" }],
          },
        ],
        caption:
          "One shared real-time layer serves every live feature; access control applies across the platform.",
      },
    ],
    accessibility: [
      {
        type: "paragraph",
        text: "The airline UIs were built to be WCAG compliant, with semantic HTML, ARIA, keyboard navigation and screen-reader testing.",
      },
    ],
  },
};
