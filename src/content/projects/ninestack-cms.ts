import { type Project } from "@/types/content";

/** Source: Sagar's description of the product and both resumes (Ninestack, May 2016 – Apr 2019). */
export const ninestackCms: Project = {
  slug: "ninestack-cms",
  status: "published",
  title: "Story CMS",
  summary:
    "A CMS for creating, editing and publishing articles as visual, scrolling stories. It became Ninestack's most profitable platform, adopted by 50+ clients within 4 months.",
  category: "Content management",
  role: "Frontend Engineer",
  company: "Ninestack",
  timeline: "2016–2019",
  stack: ["CMS", "Responsive web", "Rich text editing"],
  featured: true,
  cover: {
    src: "/images/projects/ninestack-cms/cover.png",
    alt: "Illustration of a story editor: a section list, a full-width title image with a serif headline, a block toolbar and publishing settings.",
    width: 2400,
    height: 1500,
    illustration: true,
  },
  links: [{ label: "Boligkanalen", href: "https://boligkanalen.no/" }],
  related: ["happay-invoice-management", "fabric-ui-library"],
  caseStudy: {
    overview: [
      {
        type: "paragraph",
        text: "At Ninestack I led the company's CMS platform: a tool for creating, editing and publishing articles as visual, scrolling stories, in the spirit of Shorthand. It became the company's most profitable platform, adopted by 50+ clients within 4 months.",
      },
    ],
    role: [
      {
        type: "list",
        items: ["Led the CMS platform.", "Shipped 15+ responsive websites.", "Mentored 2 interns."],
      },
    ],
  },
};
