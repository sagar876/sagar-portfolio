/**
 * Site-wide identity and links. Single source for names, URLs and metadata defaults.
 *
 * Fields set to `undefined` are placeholders: the UI hides anything that is not
 * filled in, so nothing broken or invented ships.
 */

/**
 * Canonical origin, without a trailing slash. In order of preference:
 * 1. NEXT_PUBLIC_SITE_URL (set this to the custom domain in production)
 * 2. Vercel's production domain, which Vercel provides automatically
 * 3. Local development
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, "");
  const vercelProduction = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelProduction) return `https://${vercelProduction}`;
  return "http://localhost:3000";
}

/**
 * True only for the live production site. Vercel preview deployments (pull
 * requests) are excluded so they are never indexed by search engines.
 */
export const isProductionDeployment = process.env.VERCEL_ENV
  ? process.env.VERCEL_ENV === "production"
  : process.env.NODE_ENV === "production";

export const siteConfig = {
  name: "Sagar Dixit",
  role: "Senior Frontend Engineer & UI Architect",
  description:
    "Senior Frontend Engineer and UI Architect with 9+ years designing scalable React, Next.js and TypeScript platforms across travel, FinTech, ecommerce and SaaS. Frontend architecture, real-time and offline-first systems, design systems and performance.",
  url: resolveSiteUrl(),
  locale: "en_US",
  /** Portrait in /public/images/profile (cropped 4:5, metadata stripped). */
  portrait: {
    src: "/images/profile/sagar-dixit.jpg",
    alt: "Sagar Dixit outdoors under a cloudy sky, wearing a cap and a brown leather jacket.",
    width: 960,
    height: 1200,
  },
  /** Resume in /public/resume, used by every "Resume" and "Download resume" link. */
  resumePath: "/resume/Sagar_Dixit_UI_Architect.pdf",
  /** Shown as a badge in the hero. From the resume: immediate joiner, open to relocation. */
  availability: "Available immediately · Open to relocation" as string | undefined,
  contact: {
    email: "sagar876@gmail.com" as string | undefined,
    location: "Goa, India" as string | undefined,
  },
  social: {
    github: "https://github.com/sagar876" as string | undefined,
    linkedin: "https://www.linkedin.com/in/sagar-dixit-2055a7124" as string | undefined,
  },
} as const;

export type SiteConfig = typeof siteConfig;
