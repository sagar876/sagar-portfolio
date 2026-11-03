import { projects } from "@/content/projects";
import { type Project } from "@/types/content";

/*
 * Project queries. Pages and components read projects through these helpers
 * rather than importing content directly.
 *
 * The content is checked once at import time, so a broken reference fails the
 * build instead of shipping.
 */

function validate(list: readonly Project[]) {
  const slugs = new Set<string>();
  for (const project of list) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.slug)) {
      throw new Error(`Project slug "${project.slug}" must be lowercase kebab-case.`);
    }
    if (slugs.has(project.slug)) throw new Error(`Duplicate project slug "${project.slug}".`);
    slugs.add(project.slug);
  }
  for (const project of list) {
    for (const related of project.related ?? []) {
      if (!slugs.has(related)) {
        throw new Error(`Project "${project.slug}" lists unknown related project "${related}".`);
      }
    }
    if (project.caseStudy.results && !project.caseStudy.results.source.trim()) {
      throw new Error(`Project "${project.slug}" has results without a source.`);
    }
  }
}

validate(projects);

export function getAllProjects(): readonly Project[] {
  return projects;
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

/** Projects shown in listings (work index, related links, sitemap). */
export function getListedProjects(): Project[] {
  return projects.filter((project) => project.listed !== false);
}

/** Homepage selection: up to four featured projects. */
export function getFeaturedProjects(): Project[] {
  return getListedProjects()
    .filter((project) => project.featured)
    .slice(0, 4);
}

/** Explicitly related projects, or the next projects in the list (wrapping). */
export function getRelatedProjects(project: Project, limit = 2): Project[] {
  if (project.related?.length) {
    return project.related
      .map((slug) => getProjectBySlug(slug))
      .filter((p): p is Project => p !== undefined)
      .slice(0, limit);
  }
  const listed = getListedProjects();
  const index = listed.indexOf(project);
  const others = index === -1 ? listed : [...listed.slice(index + 1), ...listed.slice(0, index)];
  return others.slice(0, limit);
}

export function projectHref(slug: string): `/work/${string}` {
  return `/work/${slug}`;
}

/** Shared name that lets a project's cover morph from its card into the case-study header. */
export function coverTransitionName(slug: string) {
  return `project-cover-${slug}`;
}
