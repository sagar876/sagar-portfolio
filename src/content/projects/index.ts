import { exampleProjects } from "@/content/projects/examples";
import { type Project } from "@/types/content";

/**
 * All case studies, in display order (newest first).
 *
 * Add real projects as one file per project in this folder, import them here,
 * and remove `exampleProjects` once at least three real projects exist.
 */
export const projects: readonly Project[] = [...exampleProjects];
