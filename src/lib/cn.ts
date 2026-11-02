type ClassValue = string | false | null | undefined;

/**
 * Joins class names, skipping falsy values.
 *
 * This does not resolve Tailwind conflicts. Components own their visual styles
 * through variants; the `className` prop is for layout additions (margins,
 * grid placement), not for overriding color or type.
 */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}
