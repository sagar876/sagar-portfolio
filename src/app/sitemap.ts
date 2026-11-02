import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import { getAllProjects, projectHref } from "@/lib/projects";
import { articleHref, getAllArticles } from "@/lib/writing";

/**
 * Lists indexable pages only: example case studies and draft articles are
 * excluded (they are also marked noindex on the page itself).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => `${siteConfig.url}${path === "/" ? "" : path}`;

  const pages: MetadataRoute.Sitemap = [
    "/",
    "/work",
    "/about",
    "/experience",
    "/writing",
    "/contact",
  ].map((path) => ({ url: url(path) }));

  const projects: MetadataRoute.Sitemap = getAllProjects()
    .filter((project) => project.status === "published")
    .map((project) => ({ url: url(projectHref(project.slug)) }));

  const articles: MetadataRoute.Sitemap = getAllArticles()
    .filter((article) => article.status === "published")
    .map((article) => ({
      url: url(articleHref(article.slug)),
      lastModified: article.updatedAt ?? article.publishedAt,
    }));

  return [...pages, ...projects, ...articles];
}
