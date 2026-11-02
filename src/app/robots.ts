import type { MetadataRoute } from "next";

import { isProductionDeployment, siteConfig } from "@/config/site";

/**
 * Production: allow everything except the API.
 * Previews and local builds: disallow everything, so pull-request deployments
 * never appear in search results.
 */
export default function robots(): MetadataRoute.Robots {
  if (!isProductionDeployment) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
