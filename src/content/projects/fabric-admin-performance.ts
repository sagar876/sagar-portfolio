import { type Project } from "@/types/content";

/** Source: both resumes (Fabric.inc, May 2021 – Nov 2023). */
export const fabricAdminPerformance: Project = {
  slug: "fabric-admin-performance",
  status: "published",
  title: "Admin portal performance re-architecture",
  summary:
    "Re-architected a legacy admin portal, cutting load time from ~7–8s to 2–3s and bringing LCP under 2.5s.",
  category: "Performance",
  role: "Senior Software Engineer (SDE-2)",
  company: "Fabric.inc",
  timeline: "2021–2023",
  stack: ["React", "Code splitting", "Lazy loading", "Core Web Vitals"],
  featured: false,
  related: ["fabric-ui-library", "airfi-realtime-platform"],
  caseStudy: {
    overview: [
      {
        type: "paragraph",
        text: "Fabric's legacy admin portal took around 7–8 seconds to load. I re-architected how it loaded, bringing load time down to 2–3 seconds and Largest Contentful Paint under 2.5 seconds.",
      },
    ],
    architecture: [
      {
        type: "list",
        items: [
          "Route-based code splitting, so each page loads only the code it needs.",
          "Lazy loading for code that isn't needed on first render.",
          "Removed render-blocking scripts from the critical path.",
        ],
      },
    ],
    performance: [
      {
        type: "definitions",
        items: [
          { term: "Load time", description: "From ~7–8s to 2–3s." },
          { term: "LCP", description: 'Under 2.5s, inside the Core Web Vitals "good" threshold.' },
        ],
      },
    ],
  },
};
