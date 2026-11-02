# Sagar Dixit — Portfolio

Personal portfolio built with Next.js (App Router), React, TypeScript (strict), Tailwind CSS v4 and MDX.

Design direction: Concept A "Index" — see [`docs/design/visual-design-spec.md`](docs/design/visual-design-spec.md).

## Commands

| Command                  | What it does                                                        |
| ------------------------ | ------------------------------------------------------------------- |
| `npm install`            | Install dependencies (Node 20.9+)                                   |
| `npm run dev`            | Start the dev server at http://localhost:3000                       |
| `npm run build`          | Production build                                                    |
| `npm start`              | Serve the production build                                          |
| `npm run typecheck`      | Generate route types and run `tsc --noEmit`                         |
| `npm run lint`           | ESLint (`lint:fix` to auto-fix)                                     |
| `npm run format`         | Prettier, including Tailwind class sorting                          |
| `npm run check`          | Typecheck + lint + format check                                     |
| `npm run test:e2e`       | Build, then run Playwright tests (desktop + mobile) in local Chrome |
| `npm test`               | Unit tests (Vitest)                                                 |
| `npm run smoke -- <url>` | Read-only checks against a deployed site                            |

Copy `.env.example` to `.env.local` for local development. Deployment steps, environment variables, DNS, verification and rollback are in [`docs/deployment.md`](docs/deployment.md).

## Structure

```
src/
  app/                 Routes, root layout, metadata, error/loading/not-found boundaries
  components/
    layout/            Container, Section, Grid/GridItem, Stack/Cluster, header, footer
    navigation/        MainNav (server) and NavLink (client, active state)
    sections/          Page-level blocks composed from primitives (PageIntro)
    ui/                Typography, Button, IconButton, TextLink, Badge, Divider, SectionHeading
    content/           ProjectCard/ProjectList, ExperienceItem/ExperienceList
    case-study/        Case-study blocks, header, contents list, results, related projects
    animations/        Reveal (CSS entrance) and ReadingProgress (scroll-driven bar)
  config/              Site identity, links and navigation — the only place for these values
  content/             Projects, experience and writing as typed data
  data/                Supporting data (expertise list)
  hooks/               Client hooks (empty for now)
  lib/                 cn, fonts, metadata helpers, motion tokens, utilities
  types/               Shared content and navigation types
public/
  images/ icons/ resume/
```

## Conventions

- Server Components by default; `"use client"` only for interactivity (navigation, mobile menu, sticky header, contents list, writing filter, error boundaries).
- Design tokens live only in `src/app/globals.css`. Tailwind's default palette, type scale, breakpoints and container sizes are disabled, so only token utilities exist (`bg-surface`, `text-fg-secondary`, `text-h2`, `py-section`, `px-page-margin`, `desktop:`).
- Breakpoints: mobile (default), `tablet:` 640px, `desktop:` 1024px, `wide:` 1280px.
- Use named grid spans (`rail`, `headline`, `main`, `prose`, `wide`, `full`) instead of raw column numbers.
- Motion is CSS-first: entrance, reveal and progress effects are CSS (scroll-driven where supported); page transitions and the project-cover morph use React `<ViewTransition>`. The Motion library is used in two places only: the mobile menu (loaded on demand, never on desktop) and the writing filter. Check the bundle impact before using it anywhere else.
- Content goes in `src/content`; leave unknown details undefined rather than guessing.

## Adding a case study

1. Create `src/content/projects/<slug>.ts` exporting a `Project` (see `src/types/content.ts`) with `status: "published"`.
2. Write the body in `caseStudy` (see `src/types/case-study.ts`). Only `overview` is required; every other section is optional and is left out of the page and the contents list when missing.
3. Build sections from blocks: `paragraph`, `subheading`, `list`, `definitions`, `figure` (`single`, `wide`, `two-up`, `three-up`), `architecture-diagram`, `flow-diagram`, `diagram-image`, `code`, `decision`, `tradeoff`, `callout`. Wrap identifiers in backticks to set them in mono.
4. Put images in `public/images/projects/<slug>/` and give each its real `width` and `height`.
5. Add `results` only with verified numbers. It requires a `source`, which is shown under the metrics.
6. Import the project in `src/content/projects/index.ts`. Once three real projects exist, remove `exampleProjects` and delete `examples.ts` and `public/images/projects/example/`.

The build fails on duplicate slugs, invalid slugs, unknown `related` slugs or results without a source.
