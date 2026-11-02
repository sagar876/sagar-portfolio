/**
 * Engineering capabilities, taken from the positioning brief. Descriptions say
 * what each area covers, not results. Used by the homepage and About page.
 */
export type Capability = {
  title: string;
  description: string;
};

export const capabilities: readonly Capability[] = [
  {
    title: "Frontend architecture",
    description:
      "Structuring applications so teams can ship independently: module boundaries, micro-frontends, shared contracts and real-time data flow over WebSockets.",
  },
  {
    title: "React and Next.js",
    description:
      "Server and client component boundaries, rendering strategy, routing and data fetching for production applications.",
  },
  {
    title: "TypeScript",
    description:
      "Strict types at the boundaries between components, services and teams, so refactoring stays safe as a codebase grows.",
  },
  {
    title: "Design systems",
    description:
      "Design tokens, reusable component libraries and documentation that keep large interfaces consistent.",
  },
  {
    title: "Performance",
    description:
      "Measuring and improving loading, rendering and interaction speed against agreed budgets.",
  },
  {
    title: "Accessibility",
    description:
      "Semantic markup, keyboard support and WCAG-aligned engineering standards built into shared components.",
  },
  {
    title: "Offline-first applications",
    description:
      "Local-first data, background sync and conflict handling so applications keep working on unreliable networks.",
  },
];
