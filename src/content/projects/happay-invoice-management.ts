import { type Project } from "@/types/content";

/** Source: Sagar's description of the product and both resumes (Happay, May 2019 – Aug 2020). */
export const happayInvoiceManagement: Project = {
  slug: "happay-invoice-management",
  status: "published",
  title: "Invoice management",
  summary:
    "An invoice management system for creating, editing and managing invoices, with a dashboard of invoice tables.",
  category: "FinTech product",
  role: "Software Engineer",
  company: "Happay",
  timeline: "2019–2020",
  stack: ["React", "Dashboards", "Data tables"],
  featured: true,
  cover: {
    src: "/images/projects/happay-invoice-management/cover.png",
    alt: "Illustration of an invoice management screen: summary tiles, an invoices table with status labels, and an open edit-invoice panel with line items.",
    width: 2400,
    height: 1500,
    illustration: true,
  },
  related: ["ninestack-cms", "fabric-admin-performance"],
  caseStudy: {
    overview: [
      {
        type: "paragraph",
        text: "At Happay I worked on an invoice management system where finance teams create, edit and manage invoices, and track them from a dashboard of invoice tables.",
      },
    ],
    role: [
      {
        type: "list",
        items: [
          "Planned and led a full-codebase React 15 to 16 migration, completed in one week with zero production regressions.",
          "Core dashboards loading in 2–3 seconds.",
        ],
      },
    ],
  },
};
