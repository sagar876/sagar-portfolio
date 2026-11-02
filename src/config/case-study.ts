import { type CaseStudySectionKey } from "@/types/case-study";

/** Section titles and reading order. The page renders only sections that have content. */
export const caseStudySections: readonly { key: CaseStudySectionKey; title: string }[] = [
  { key: "overview", title: "Overview" },
  { key: "context", title: "Context" },
  { key: "problem", title: "Problem" },
  { key: "role", title: "My role" },
  { key: "team", title: "Team" },
  { key: "requirements", title: "Technical requirements" },
  { key: "architecture", title: "Architecture" },
  { key: "technology", title: "Technology choices" },
  { key: "decisions", title: "Key decisions" },
  { key: "tradeoffs", title: "Trade-offs and challenges" },
  { key: "performance", title: "Performance and scalability" },
  { key: "accessibility", title: "Accessibility" },
  { key: "results", title: "Results" },
  { key: "lessons", title: "Lessons learned" },
];
