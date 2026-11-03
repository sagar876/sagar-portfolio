import { type Project } from "@/types/content";

/** Source: both resumes (Fabric.inc, May 2021 – Nov 2023). */
export const fabricUiLibrary: Project = {
  slug: "fabric-ui-library",
  status: "published",
  title: "UI Library 2.0",
  summary:
    "A unified design system in React and TypeScript that gave every Fabric product one consistent, reusable component library.",
  category: "Design system",
  role: "Senior Software Engineer (SDE-2)",
  company: "Fabric.inc",
  timeline: "2021–2023",
  stack: ["React", "TypeScript", "Design system"],
  featured: false,
  related: ["fabric-admin-performance", "airfi-realtime-platform"],
  caseStudy: {
    overview: [
      {
        type: "paragraph",
        text: "At Fabric I architected UI Library 2.0, a unified design system in React and TypeScript that gave every product consistent, reusable UI.",
      },
    ],
    role: [
      {
        type: "list",
        items: [
          "Architected the component library.",
          "Led a team of engineers from technical design and scoping through to delivery, aligned with product stakeholders.",
        ],
      },
    ],
  },
};
