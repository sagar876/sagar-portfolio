import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import { getListedProjects, projectHref } from "@/lib/projects";

/** Lists every public page and published case study. */
export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => `${siteConfig.url}${path === "/" ? "" : path}`;

  const pages: MetadataRoute.Sitemap = ["/", "/work", "/about", "/experience", "/contact"].map(
    (path) => ({ url: url(path) }),
  );

  const projects: MetadataRoute.Sitemap = getListedProjects()
    .filter((project) => project.status === "published")
    .map((project) => ({ url: url(projectHref(project.slug)) }));

  return [...pages, ...projects];
}
