import { type Project } from "@/types/content";

/**
 * Source: Sagar ("I built this, latest") and the public sign-in page of
 * https://superfit.sanketarsekar.com. Everything behind the login, the stack
 * and Sagar's exact role still need to be filled in.
 */
export const superfitNovember: Project = {
  slug: "superfit-november",
  status: "published",
  title: "Super Fit November",
  summary:
    "The web app for Super Fit November 2026, a 30-day fitness challenge by Sanket Arsekar built around running, Surya Namaskar, plank and meditation.",
  category: "Fitness challenge web app",
  role: "Freelance Engineer",
  timeline: "2026",
  stack: ["Web app", "Google sign-in"],
  featured: true,
  cover: {
    src: "/images/projects/superfit-november/cover.jpg",
    alt: "Super Fit November 2026 sign-in screen: the challenge logo, the four activities and a Continue with Google button.",
    width: 1600,
    height: 1000,
  },
  links: [{ label: "Live site", href: "https://superfit.sanketarsekar.com" }],
  related: ["airfi-realtime-platform", "happay-invoice-management"],
  caseStudy: {
    overview: [
      {
        type: "paragraph",
        text: 'Super Fit November 2026 is a 30-day fitness challenge, "A Movement by Sanket Arsekar", built around four activities: running, Surya Namaskar, plank and meditation. I built its web app, where participants sign in with Google.',
      },
    ],
  },
};
