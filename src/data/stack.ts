/**
 * Skills, merged from both resumes and grouped as on the resume. Shown on the
 * About page.
 */
export const coreStack = ["React", "Next.js", "TypeScript", "JavaScript"] as const;

export const skillGroups: readonly { group: string; skills: readonly string[] }[] = [
  {
    group: "Architecture",
    skills: [
      "Frontend architecture",
      "System design",
      "Design systems",
      "Component libraries",
      "Module boundaries",
      "Micro-frontends (Module Federation)",
      "Monorepos (Turborepo, Nx)",
      "Migration strategy",
    ],
  },
  {
    group: "Frontend",
    skills: [
      "React (Hooks, RSC)",
      "Next.js (App Router, SSR, SSG, ISR)",
      "TypeScript",
      "JavaScript (ES6+)",
      "HTML5",
      "CSS3",
    ],
  },
  {
    group: "Real-time and data",
    skills: [
      "WebSockets",
      "PWA and offline sync",
      "REST",
      "GraphQL",
      "Redux Toolkit",
      "Zustand",
      "TanStack Query",
    ],
  },
  {
    group: "Performance",
    skills: [
      "Core Web Vitals (LCP, INP, CLS)",
      "Code splitting",
      "Lazy loading",
      "Bundle analysis",
      "Caching",
      "Lighthouse",
    ],
  },
  {
    group: "Accessibility",
    skills: [
      "WCAG 2.2 AA",
      "WAI-ARIA",
      "Semantic HTML",
      "Keyboard navigation",
      "Screen-reader testing",
      "axe-core",
    ],
  },
  {
    group: "Security and platform",
    skills: ["RBAC", "OAuth 2.0 / JWT", "CSP and XSS prevention", "Feature flags", "i18n"],
  },
  {
    group: "Observability",
    skills: [
      "Sentry",
      "Datadog RUM",
      "OpenTelemetry",
      "Web Vitals monitoring",
      "Mixpanel",
      "Google Analytics",
    ],
  },
  {
    group: "UI and design systems",
    skills: [
      "Storybook",
      "Design tokens",
      "Tailwind CSS",
      "Radix UI",
      "shadcn/ui",
      "styled-components",
      "Material UI",
      "Figma",
    ],
  },
  {
    group: "Testing and CI/CD",
    skills: [
      "Jest",
      "Vitest",
      "React Testing Library",
      "Playwright",
      "Chromatic",
      "Vite",
      "Webpack",
      "GitLab CI/CD",
      "GitHub Actions",
    ],
  },
  {
    group: "AI",
    skills: [
      "LLM / GPT integration",
      "Streaming conversational UIs",
      "Vercel AI SDK",
      "AI-assisted development (Cursor, Claude Code)",
    ],
  },
];
