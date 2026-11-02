import { type Metadata } from "next";

import { siteConfig } from "@/config/site";

const defaultTitle = `${siteConfig.name} — ${siteConfig.role}`;

const baseOpenGraph = {
  type: "website",
  siteName: siteConfig.name,
  locale: siteConfig.locale,
} as const;

/** Defaults applied to every route by the root layout. */
export const rootMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: defaultTitle,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  openGraph: {
    ...baseOpenGraph,
    title: defaultTitle,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary",
    title: defaultTitle,
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
  formatDetection: { email: false, address: false, telephone: false },
};

type PageMetadataInput = {
  /** Page title. Pass `undefined` on the home page to use the default title. */
  title?: string;
  description?: string;
  /** Route path starting with "/", used for the canonical URL. */
  path: string;
  /** Social preview image, path under /public. */
  image?: { src: string; alt: string; width?: number; height?: number };
  /** "article" for case studies; defaults to "website". */
  type?: "website" | "article";
  /** Keep the page out of search results (example content, drafts). */
  noIndex?: boolean;
};

/**
 * Per-page metadata with a canonical URL. Next.js shallow-merges metadata, so
 * Open Graph defaults are repeated here to avoid losing them on child routes.
 */
export function createPageMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  noIndex = false,
}: PageMetadataInput): Metadata {
  const resolvedDescription = description ?? siteConfig.description;
  const resolvedTitle = title ?? defaultTitle;
  const images = image
    ? [{ url: image.src, alt: image.alt, width: image.width, height: image.height }]
    : undefined;

  return {
    ...(title ? { title } : {}),
    description: resolvedDescription,
    alternates: { canonical: path },
    openGraph: {
      ...baseOpenGraph,
      type,
      title: resolvedTitle,
      description: resolvedDescription,
      url: path,
      ...(images ? { images } : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: resolvedTitle,
      description: resolvedDescription,
      ...(images ? { images } : {}),
    },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
  };
}
