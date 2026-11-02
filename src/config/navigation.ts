import { siteConfig } from "@/config/site";
import { type NavItem } from "@/types/navigation";

export const mainNav: readonly NavItem[] = [
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Experience", href: "/experience" },
  { label: "Writing", href: "/writing" },
  { label: "Contact", href: "/contact" },
];

export const resumeLink: NavItem = {
  label: "Resume",
  href: siteConfig.resumePath,
  download: true,
};

/** Social links that have been filled in, in display order. */
export function getSocialLinks(): NavItem[] {
  const { github, linkedin } = siteConfig.social;
  const links: NavItem[] = [];
  if (github) links.push({ label: "GitHub", href: github, external: true });
  if (linkedin) links.push({ label: "LinkedIn", href: linkedin, external: true });
  return links;
}
