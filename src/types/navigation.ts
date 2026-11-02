export type NavItem = {
  label: string;
  href: string;
  /** Opens in a new tab and is marked as external for assistive tech. */
  external?: boolean;
  /** Downloads the file instead of navigating (resume PDF). */
  download?: boolean;
};
