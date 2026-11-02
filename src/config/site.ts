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
    "Senior Frontend Engineer and UI Architect with 8 years of experience in React, Next.js and TypeScript. Frontend architecture, micro-frontends, real-time and offline-first applications, performance and design systems.",
  url: resolveSiteUrl(),
  locale: "en_US",
  /** Path under /public. Add the PDF at public/resume/ before launch. */
  resumePath: "/resume/sagar-dixit-resume.pdf",
  /**
   * [Placeholder] Availability line shown in the hero, e.g. "Open to senior
   * frontend roles". Only set this once it is true; undefined hides it.
   */
  availability: undefined as string | undefined,
  contact: {
    /** [Placeholder] Public contact email. */
    email: undefined as string | undefined,
    /** [Placeholder] e.g. "[City, Country]". */
    location: undefined as string | undefined,
  },
  social: {
    /** [Placeholder] Full GitHub profile URL. */
    github: undefined as string | undefined,
    /** [Placeholder] Full LinkedIn profile URL. */
    linkedin: undefined as string | undefined,
  },
} as const;

export type SiteConfig = typeof siteConfig;
