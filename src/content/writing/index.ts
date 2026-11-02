import { type Article } from "@/types/content";

/**
 * Article registry. Metadata lives here (typed); each body lives in
 * src/content/writing/<slug>.mdx.
 *
 * The six entries below are DRAFT OUTLINES: technically accurate starting
 * points with no claims about specific employers, projects or results. Edit
 * each one in your own voice, then set `status: "published"` and a
 * `publishedAt` date.
 */
export const articles: readonly Article[] = [
  {
    slug: "designing-scalable-frontend-architecture",
    title: "Designing scalable frontend architecture",
    summary:
      "How to draw boundaries in a large frontend so teams can ship independently: modules, ownership, shared contracts and when micro-frontends are worth it.",
    category: "Architecture",
    status: "draft",
  },
  {
    slug: "offline-first-applications-with-indexeddb",
    title: "Offline-first applications with IndexedDB",
    summary:
      "Treating the local database as the source of truth: storage design, a sync queue, and handling conflicts when the network comes back.",
    category: "Offline-first",
    status: "draft",
  },
  {
    slug: "real-time-data-with-websockets-in-react",
    title: "Managing real-time data with WebSockets in React",
    summary:
      "One connection, many subscribers: keeping WebSocket state outside React, reconnecting safely and rendering high-frequency updates without jank.",
    category: "Real-time",
    status: "draft",
  },
  {
    slug: "building-reusable-component-systems",
    title: "Building reusable component systems",
    summary:
      "Tokens, component APIs and documentation: what makes a component library something teams choose to use rather than work around.",
    category: "Design systems",
    status: "draft",
  },
  {
    slug: "react-performance-optimization",
    title: "React performance optimization",
    summary:
      "Measure first, then fix: profiling renders, splitting state, virtualising long lists and moving work off the critical path.",
    category: "Performance",
    status: "draft",
  },
  {
    slug: "accessible-frontend-applications",
    title: "Making frontend applications accessible",
    summary:
      "Semantic HTML, keyboard support, focus management and testing — and how to build them into shared components so they stay fixed.",
    category: "Accessibility",
    status: "draft",
  },
];
