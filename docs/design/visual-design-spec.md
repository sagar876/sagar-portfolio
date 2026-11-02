# Sagar Dixit Portfolio: Visual Design Specification

**Status:** Draft for review
**Date:** 2026-11-02
**Target stack:** Next.js (App Router) and Tailwind CSS v4
**Scope:** Visual direction only. No application code. Content placeholders appear as `[Placeholder]`.

---

## 0. Shared brief

### What the design has to do

- Let a technical recruiter confirm role, seniority, stack and contact options within about 30 seconds of landing.
- Give an engineering manager, CTO or interview panel case studies they can read for 10+ minutes without fatigue.
- Show judgment through the design itself. The site is evidence of what a UI architect builds: a coherent system, consistent tokens, accessible defaults and fast pages.

### Constraints that apply to every concept

| Area     | Rule                                                                                                                                            |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Spacing  | 4px base unit. Every margin, padding and gap uses a step from the scale.                                                                        |
| Type     | Fluid sizes using `clamp()`, interpolated between 360px and 1440px viewports. Running text 60–68 characters wide.                               |
| Contrast | WCAG 2.2 AA minimum: 4.5:1 for body text, 3:1 for large text and UI boundaries. Every text token pair below has been checked.                   |
| Motion   | Only `transform` and `opacity` are animated. Content is fully visible with no animation. `prefers-reduced-motion: reduce` removes all movement. |
| Focus    | Every interactive element has a visible 2px focus ring with 3px offset.                                                                         |
| Touch    | Minimum target size 44×44px on touch devices.                                                                                                   |
| Imagery  | Real product screenshots, architecture diagrams and UI details only. No stock photos, decorative 3D, floating code, neon or heavy gradients.    |

### Content placeholders used in mockups

`[Project name]`, `[Company]`, `[Year]`, `[Role]`, `[Team size]`, `[Outcome metric]`, `[Location]`, `[Availability status]`. Do not replace these with invented values. Use real values from the resume when supplied.

---

## Concept A: "Index" (light editorial, Swiss)

### A1. Visual identity

The site is laid out like a Swiss design catalogue. Work is shown as an indexed list of entries, not a gallery of cards. The name is set large and flush left. Metadata sits in a narrow mono column, like a colophon. Thin hairline rules separate entries. One signal red marks the current location (active nav item, active table-of-contents entry, link hover). The red is never used as decoration.

**Personality:** precise, calm, confident. The site looks considered because its system is consistent, not because of effects.

### A2. Color palette

| Token     | Light     | Dark      | Use                                                              |
| --------- | --------- | --------- | ---------------------------------------------------------------- |
| `paper`   | `#FAFAF7` | `#0F1011` | Page background                                                  |
| `paper-2` | `#F1F1EC` | `#17181A` | Figure backgrounds, hover rows, code blocks                      |
| `ink`     | `#111214` | `#EDEDE8` | Primary text, primary button fill                                |
| `ink-2`   | `#55585E` | `#A3A5A9` | Secondary text, summaries (6.8:1 / 7.7:1)                        |
| `ink-3`   | `#6E7076` | `#86888D` | Metadata, captions (4.7:1 / 5.4:1)                               |
| `rule`    | `#DCDCD5` | `#2A2B2E` | Hairlines, dividers                                              |
| `signal`  | `#D7261E` | `#FF5A4E` | Active state, link hover, current-section marker (4.8:1 / 6.1:1) |

Dark mode is a token swap of the same system, not a separate design.

### A3. Typography

| Role                          | Family                | Weights         | Notes                                                                         |
| ----------------------------- | --------------------- | --------------- | ----------------------------------------------------------------------------- |
| Display and UI                | **Schibsted Grotesk** | 400, 500, 700   | A grotesk with more character than Inter or Helvetica clones                  |
| Long-form body (case studies) | **Newsreader**        | 400, 400 italic | Variable optical size. Used only in case-study prose and the About narrative. |
| Metadata and labels           | **IBM Plex Mono**     | 400, 500        | Years, stacks, figure labels, colophon tables                                 |

**Type scale (fluid from 360px to 1440px):**

| Token        | Min → Max  | Line height | Tracking          | Tailwind value                                 |
| ------------ | ---------- | ----------- | ----------------- | ---------------------------------------------- |
| `display-xl` | 40 → 112px | 0.95        | -0.035em          | `clamp(2.5rem, 1rem + 6.667vw, 7rem)`          |
| `display`    | 32 → 64px  | 1.0         | -0.025em          | `clamp(2rem, 1.333rem + 2.963vw, 4rem)`        |
| `h1`         | 28 → 48px  | 1.05        | -0.02em           | `clamp(1.75rem, 1.333rem + 1.852vw, 3rem)`     |
| `h2`         | 24 → 32px  | 1.15        | -0.015em          | `clamp(1.5rem, 1.333rem + 0.741vw, 2rem)`      |
| `h3`         | 20 → 24px  | 1.25        | -0.01em           | `clamp(1.25rem, 1.167rem + 0.37vw, 1.5rem)`    |
| `body-lg`    | 18 → 20px  | 1.55        | 0                 | `clamp(1.125rem, 1.083rem + 0.185vw, 1.25rem)` |
| `body`       | 16px       | 1.6         | 0                 | `1rem`                                         |
| `small`      | 14px       | 1.5         | 0                 | `0.875rem`                                     |
| `meta`       | 12px       | 1.4         | 0.06em, uppercase | `0.75rem`                                      |

Display text uses `text-wrap: balance`. Body text uses `text-wrap: pretty`.

### A4. Spacing scale

4px base. Allowed steps (Tailwind's default numbers): `1`=4, `2`=8, `3`=12, `4`=16, `6`=24, `8`=32, `12`=48, `16`=64, `24`=96, `32`=128, `40`=160.

| Rhythm                                    | Mobile                | Desktop               |
| ----------------------------------------- | --------------------- | --------------------- |
| Between page sections                     | 96px                  | 160px                 |
| Between a section heading and its content | 32px                  | 48px                  |
| Between index rows                        | 20px vertical padding | 24px vertical padding |
| Paragraph spacing                         | 1em                   | 1em                   |

### A5. Grid system

| Breakpoint  | Columns | Side margin | Gutter | Max container |
| ----------- | ------- | ----------- | ------ | ------------- |
| < 640px     | 4       | 20px        | 16px   | Full width    |
| 640–1023px  | 8       | 32px        | 20px   | Full width    |
| 1024–1279px | 12      | 48px        | 24px   | Full width    |
| ≥ 1280px    | 12      | 64px        | 24px   | 1440px        |

**Key alignments at 12 columns:**

- Display headline: columns 1–10.
- Metadata rail: columns 1–3.
- Running text: columns 5–11. This asymmetric measure is the Swiss signature and keeps line length near 66 characters.
- Figures and screenshots: columns 1–12 (full) or 5–12 (inset).

### A6. Buttons

| Variant   | Spec                                                                                                                                                     |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Primary   | `ink` fill, `paper` text, 0 radius, 48px tall, 20px horizontal padding, Schibsted Grotesk 500 15px. Trailing arrow `→` moves 4px right on hover (150ms). |
| Secondary | Text link: `ink` text with a 1px underline, 4px underline offset. On hover the underline turns `signal`.                                                 |
| External  | Secondary style plus `↗`. Opens in a new tab with `rel="noopener"`.                                                                                      |
| Focus     | 2px `ink` outline, 3px offset (`paper` outline on dark).                                                                                                 |
| Disabled  | `ink-3` fill, `aria-disabled`, no hover movement.                                                                                                        |

No pills, shadows or gradients.

### A7. Navigation

- Top bar, 64px tall, `paper` background with a `rule` bottom border that only appears after the page scrolls.
- Left: wordmark "Sagar Dixit" (Schibsted 500, 16px) with "Senior Frontend Engineer" in `meta` beside it from 1024px up.
- Right: Work, About, Contact, then Resume ↗ (PDF).
- Active page: a 6px `signal` square before the label, plus `aria-current="page"`.
- Behavior: hides on scroll down and reappears on scroll up. Always visible when it has keyboard focus.
- Mobile (< 1024px): a "Menu" text button opens a full-screen `paper` overlay with 32px links and the contact email shown as selectable text. Focus is trapped while open. Esc closes it.

### A8. Cards (index rows)

Concept A replaces cards with **index rows**:
`[Year]` (mono) | `[Project name]` (h3) | `[Role] · [Key stack]` (mono, `ink-3`) | `→`

- Rows are separated by 1px `rule` lines with no border box, radius or shadow.
- Hover (desktop only): the row fills with `paper-2`, the arrow moves, and a 4:3 thumbnail appears in a fixed spot in columns 10–12. It doesn't follow the cursor.
- The whole row is one link with an accessible name of "[Project name], case study".

**Featured project block** (homepage, at most 3): full-width 16:10 image with no frame, and a caption block underneath with the title (h2), a one-sentence summary (`ink-2`) and a meta line.

### A9. Project presentation (case study)

1. **Title block:** project name (`display`), a one-line summary (`body-lg`, `ink-2`).
2. **Colophon table** (mono, two columns): Role `[Role]`, Company `[Company]`, Timeline `[Year–Year]`, Team `[Team size]`, Stack `[Stack]`, Links `[Live / Repo, if public]`.
3. **Hero figure:** full-bleed product image or architecture diagram.
4. **Body sections**, in a fixed order: Context, Problem, Constraints, Architecture, Key decisions and trade-offs, Outcome, Reflection.
5. **Figures:** SVG diagrams drawn in `ink` on `paper-2`, labelled "Fig. 1", "Fig. 2" in mono. Every figure has a caption and a text alternative.
6. **Outcome:** shows `[Outcome metric]` placeholders only until real numbers are supplied.
7. **Sticky table of contents** in columns 1–3 from 1024px up. The active section is marked with the `signal` square.
8. **Next project** link at the end, set as a full-width index row.

Prose is set in Newsreader `body-lg`. Code snippets are allowed only where they explain a decision, in IBM Plex Mono on `paper-2`.

### A10. Animation principles

| Token            | Value                        | Use                                      |
| ---------------- | ---------------------------- | ---------------------------------------- |
| `duration-micro` | 150ms                        | Arrow nudge, underline color             |
| `duration-ui`    | 250ms                        | Nav reveal, row hover fill, menu overlay |
| `duration-page`  | 400ms                        | Route transitions                        |
| `ease-standard`  | `cubic-bezier(0.2, 0, 0, 1)` | Everything                               |

- **Load:** hero lines rise 12px and fade in, with a 60ms stagger. This happens once per session.
- **Route change:** View Transitions API morphs a project's thumbnail into the case-study hero, as a progressive enhancement.
- **Not allowed:** scroll-jacking, parallax, cursor followers, looping animation, scroll-triggered reveals that leave content hidden.
- **Reduced motion:** no transforms. Only crossfades of 150ms or less, or none.

### A11. Mobile behavior

- 4-column grid. The metadata rail stacks above its content.
- Index rows become two lines: title, then `[Year] · [Stack]`. No hover thumbnails.
- `display-xl` sizes down to 40px. The name and role stay within the first screen together with a "View work" link.
- The sticky table of contents becomes a collapsible "Contents" disclosure at the top of the case study.
- Diagrams scroll horizontally inside their own container and link to a full-size SVG.

---

## Concept B: "Blueprint" (dark architectural, technical)

### B1. Visual identity

The site looks like a technical drawing sheet. Faint column guides are visible, sections have corner tick marks, and every page ends with a drawing title block (name, role, sheet = page name). Work is presented as systems: every case study opens with its architecture schematic. The risk is drifting toward a generic dark developer template. The guard is strict restraint: no glow, no terminal imitation, one cool accent.

**Personality:** rigorous, systems-minded, engineering-first.

### B2. Color palette (dark-first)

| Token       | Dark (default) | Light variant | Use                                                 |
| ----------- | -------------- | ------------- | --------------------------------------------------- |
| `bg`        | `#0E1013`      | `#F3F5F7`     | Page                                                |
| `surface`   | `#15181D`      | `#FFFFFF`     | Modules                                             |
| `surface-2` | `#1C2027`      | `#E9EDF1`     | Diagram background, hover                           |
| `line`      | `#2A3039`      | `#D3D8DE`     | Borders, guides, ticks                              |
| `text`      | `#E4E7EB`      | `#0E1013`     | Primary text                                        |
| `text-2`    | `#9AA3AE`      | `#4A525C`     | Secondary (7.4:1 dark)                              |
| `text-3`    | `#7D8692`      | `#5F6873`     | Labels, annotations (5.1:1 dark)                    |
| `blueprint` | `#8DB4E8`      | `#2D5C9E`     | Accent: links, active, primary button (8.8:1 dark)  |
| `trace`     | `#D9A443`      | `#9A6A12`     | Used only inside diagrams for highlighted data flow |

### B3. Typography

One superfamily, chosen for its engineering-drawing feel:

| Role                   | Family                      | Weights  |
| ---------------------- | --------------------------- | -------- |
| Display                | **IBM Plex Sans Condensed** | 500, 600 |
| Body                   | **IBM Plex Sans**           | 400, 500 |
| Labels and annotations | **IBM Plex Mono**           | 400, 500 |

| Token        | Min → Max | Line height | Notes                   |
| ------------ | --------- | ----------- | ----------------------- |
| `display-xl` | 40 → 96px | 0.98        | Condensed 600, -0.02em  |
| `h1`         | 28 → 44px | 1.05        | Condensed 500           |
| `h2`         | 22 → 28px | 1.2         | Condensed 500           |
| `body`       | 16 → 17px | 1.6         | Plex Sans 400           |
| `label`      | 11 → 12px | 1.3         | Mono, uppercase, 0.08em |

### B4. Spacing scale

Strict 8px steps: 8, 16, 24, 32, 48, 64, 96, 128. Section spacing is 96px on mobile and 128px on desktop. Module inner padding is 24px on mobile and 32px on desktop.

### B5. Grid system

- 12 columns at 1024px and up. Margins 40px, **gutter 0**. Modules butt against each other and are divided by 1px `line` borders, like cells on a drawing sheet.
- Decorative column guides: 1px lines at 6% opacity, `aria-hidden`, desktop only.
- Page frame: a 1px `line` border inset 16px from the viewport on desktop, with the title block docked to the bottom-right of the footer.
- 8 columns at 640–1023px. 4 columns below 640px with 20px margins.

### B6. Buttons

| Variant   | Spec                                                                                                              |
| --------- | ----------------------------------------------------------------------------------------------------------------- |
| Primary   | `blueprint` fill, `bg` text, 0 radius, 44px tall, mono uppercase 12px label, 0.08em tracking.                     |
| Secondary | Transparent with a 1px `line` border. On hover the border turns `blueprint` and 4px L-shaped corner ticks appear. |
| Focus     | 2px `blueprint` outline, 3px offset.                                                                              |

### B7. Navigation

- Top bar, 56px tall, with a 1px `line` bottom border. Left: "SAGAR DIXIT / UI ARCHITECT" in mono. Right: Work, About, Contact, Resume ↗, in mono uppercase.
- The current section's label appears in the bar as a breadcrumb (e.g. "Work / [Project name] / Architecture").
- Mobile: a "Menu" button opens a bottom sheet listing the same items. Focus is trapped. Esc and swipe-down close it.

### B8. Cards (modules)

- Bordered modules: 1px `line`, 0 radius, no shadow.
- Header strip: mono label `[Project type] · [Year]`.
- Image area: screenshot with an optional schematic overlay.
- Footer: stack as mono text separated by slashes ("React / TypeScript / WebSocket"), not pills.
- Hover: the border turns `blueprint` and corner ticks appear (200ms).

### B9. Project presentation

1. **Title block** in the top right, styled like an engineering drawing: Project, Role, Company `[Company]`, Date `[Year]`, Rev.
2. **Architecture schematic first**, drawn as an SVG with numbered callouts (①②③).
3. The narrative follows the callout numbers, so each section links back to a part of the diagram.
4. Section order: System overview, Constraints, Decisions, Implementation notes, Outcome `[Outcome metric]`, What I'd change.
5. Annotations are set in mono `label` style along the margins.

### B10. Animation principles

- Diagram strokes draw in once using `stroke-dashoffset` (600ms, `cubic-bezier(0.4, 0, 0.2, 1)`). They are fully drawn at rest if JavaScript is late, and immediately under reduced motion.
- Column guides fade in on first load (300ms).
- Hover states: 200ms.
- Not allowed: glow, scanlines, typing effects, cursor trails.

### B11. Mobile behavior

- Column guides and the page frame are hidden. Only top and bottom rules remain.
- Modules stack at full width with shared borders.
- Schematics scroll horizontally in their own container, with a "View full diagram" link.
- The title block becomes a two-column definition list.

---

## Concept C: "Two Planes" (contemporary split-tone)

### C1. Visual identity

Each page is split into two tonal planes, like a two-page spread. A dark **statement** plane carries identity and narrative. A light **evidence** plane carries work, details and facts. On desktop the homepage's left ink plane (name, positioning, navigation) is sticky while the stone plane on the right scrolls through the work. A serif display face gives it an editorial, contemporary voice.

**Personality:** confident, current, a little more personal than A or B.

### C2. Color palette

| Token                     | Value                 | Use                                                    |
| ------------------------- | --------------------- | ------------------------------------------------------ |
| `ink`                     | `#16181B`             | Statement plane                                        |
| `ink-2`                   | `#23262B`             | Raised areas on ink                                    |
| `stone`                   | `#E7E8E4`             | Evidence plane                                         |
| `stone-2`                 | `#F4F4F1`             | Raised areas on stone                                  |
| `on-ink`                  | `#F2F2EE`             | Text on ink                                            |
| `on-ink-muted`            | `#A7AAAE`             | Secondary text on ink (7.6:1)                          |
| `on-stone`                | `#16181B`             | Text on stone                                          |
| `on-stone-muted`          | `#575A5F`             | Secondary text on stone (5.7:1)                        |
| `rule-ink` / `rule-stone` | `#34373C` / `#CFD0CB` | Dividers                                               |
| `cobalt`                  | `#2A47E8`             | Accent on stone (5.4:1); white text on cobalt is 6.6:1 |
| `cobalt-light`            | `#9AACFF`             | Accent on ink (8.2:1)                                  |

The two planes are the theme. Concept C does not offer a separate dark mode. It respects the OS setting only by keeping both planes as they are.

### C3. Typography

| Role        | Family               | Weights                                                  |
| ----------- | -------------------- | -------------------------------------------------------- |
| Display     | **Instrument Serif** | 400, 400 italic (italic for one emphasized word at most) |
| Body and UI | **Instrument Sans**  | 400, 500, 600                                            |
| Metadata    | **JetBrains Mono**   | 400                                                      |

| Token        | Min → Max  | Line height           |
| ------------ | ---------- | --------------------- |
| `display-xl` | 44 → 120px | 0.95, -0.02em         |
| `h1`         | 32 → 56px  | 1.0                   |
| `h2`         | 28 → 44px  | 1.1                   |
| `h3` (sans)  | 18 → 22px  | 1.3                   |
| `body`       | 16 → 18px  | 1.6                   |
| `meta`       | 12px       | 1.4, uppercase 0.05em |

### C4. Spacing scale

Same 4px scale as Concept A. Plane inner padding is 24px on mobile, 48px on tablet and 64px on desktop.

### C5. Grid system

- At 1024px and up: two full-bleed planes split 5/12 (ink) to 7/12 (stone). The ink plane is `position: sticky` with its own 4-column grid. The stone plane has a 7-column grid with a 24px gutter.
- 640–1023px: planes stack. The ink plane becomes a top band and is not sticky.
- Below 640px: 4 columns, 20px margins.

### C6. Buttons

| Variant          | Spec                                                                                          |
| ---------------- | --------------------------------------------------------------------------------------------- |
| Primary on stone | `cobalt` fill, white text, 2px radius, 48px tall, Instrument Sans 500 15px.                   |
| Primary on ink   | `stone` fill, `ink` text.                                                                     |
| Secondary        | Text link with a 1px underline. On hover the underline turns cobalt (or cobalt-light on ink). |
| Focus            | 2px outline in the plane's accent, 3px offset.                                                |

### C7. Navigation

- Desktop: no top bar. Navigation is a vertical list inside the sticky ink plane, under the name: Work, About, Contact, Resume ↗.
- Mobile and tablet: a 56px ink top bar with the name and a "Menu" button that opens a full-screen ink overlay.

### C8. Cards (project tiles)

- On the stone plane: a 4:3 image with 2px radius, then the title (Instrument Serif, 28px), a one-line summary (sans, muted) and a meta line (mono).
- No border or shadow.
- Hover: the image scales to 1.02 inside its mask (300ms) and the title is underlined.

### C9. Project presentation

1. A full-width ink band holding the title (`display`), summary and colophon.
2. The stone body with a sticky left table of contents.
3. **Decision / Trade-off pairs** use the tonal split in a small dose: decision on `ink-2`, trade-off on `stone-2`, side by side.
4. Section order is the same as Concept A.

### C10. Animation principles

- Route change: the ink plane wipes across using `clip-path` (400ms), and the content crossfades.
- Tile hover: 300ms image scale.
- Reduced motion: instant plane change with no wipe or scale.

### C11. Mobile behavior

- Planes become full-width bands that alternate tone down the page.
- The sticky identity panel becomes the top hero band.
- Tiles are one per row.
- Decision / Trade-off pairs stack, decision first.

---

## Comparison

| Criterion                                | A · Index                                                  | B · Blueprint                                            | C · Two Planes                                          |
| ---------------------------------------- | ---------------------------------------------------------- | -------------------------------------------------------- | ------------------------------------------------------- |
| 30-second recruiter skim                 | **Strong.** Name, role and work index sit near the top.    | Medium. The mono labels slow scanning.                   | Strong on desktop; the split costs height on mobile.    |
| Signals senior judgment and architecture | **Strong.** Restraint plus case-study diagrams.            | **Strong.** Schematic-first case studies.                | Medium. Reads as design-led more than architecture-led. |
| Distance from developer templates        | Strong, if typography is executed precisely.               | Medium. Dark technical sites are common.                 | Strong.                                                 |
| Case-study readability (10+ min)         | **Best.** Serif long-form, light page, 66-character lines. | Fair. Long dark-mode reading is harder for some readers. | Good. The sticky TOC reduces body width.                |
| Accessibility risk                       | Low                                                        | Medium (low-contrast hairlines, mono-heavy text)         | Medium (two contrast contexts per page)                 |
| Build and maintenance cost               | **Low**                                                    | Medium (frame, guides, diagram animation)                | Medium–high (sticky split, plane transitions)           |
| How long it stays current                | **High**                                                   | Medium                                                   | Medium. Serif-display trend.                            |

## Recommendation: Concept A "Index", with two elements from B

**Choose A.** Recruiters and engineering managers reward clarity. A light editorial layout with strict Swiss alignment puts the facts first: who you are, what you build and how to reach you. Then it gives case studies the most readable long-form layout. The restraint is also the argument. A UI architect is hired to bring consistency and judgment to large interfaces, and a tightly systematized, fast, accessible site shows that directly.

**Borrow from B:**

1. **Schematic architecture diagrams with numbered callouts** inside case studies, drawn in A's palette (`ink` on `paper-2`, with `signal` for the highlighted path). Systems thinking shows where it counts.
2. **The colophon / title-block metadata table** at the top of each case study, set in IBM Plex Mono.

**Don't borrow from C.** A sticky split takes width away from case studies. It also complicates the tablet layout and adds a second contrast context to every page.

**Main risk with A:** a minimal site looks plain when content is thin. It relies on precise typography, real screenshots and real diagrams. Mitigation: don't launch a case study without at least one real architecture figure and one real product image.

---

## Implementation notes (Next.js and Tailwind CSS v4)

These notes describe the setup to build. No code is written yet.

1. **Tokens in CSS:** declare every color, font, type-scale step, easing and duration from Concept A in a single `@theme` block in `app/globals.css`. Color utilities then follow automatically (`bg-paper`, `text-ink-2`, `border-rule`, `text-signal`).
2. **Dark mode by token swap:** components use semantic utilities only and never `dark:` overrides. Redefine the color variables under `@media (prefers-color-scheme: dark)` and under `[data-theme="dark"]`, with a `[data-theme="light"]` override, so a theme toggle works in both directions. Prevent a flash of the wrong theme with an inline script in `<head>` that reads the stored preference before paint.
3. **Fonts:** load Schibsted Grotesk, Newsreader and IBM Plex Mono through `next/font/google` as variable fonts with `display: 'swap'` and Latin subsets, exposed as CSS variables (`--font-display`, `--font-serif`, `--font-mono`). Preload only Schibsted Grotesk. Load Newsreader on case-study and About routes only.
4. **Fluid type:** add type-scale steps to `@theme` as `--text-*` tokens using the `clamp()` values in A3, with paired `--text-*--line-height` and `--text-*--letter-spacing` values.
5. **Grid:** add a `Container` component (max 1440px, responsive side margins from A5) and a `Grid` component (4/8/12 columns, responsive gutters). Name the key alignments from A5 as layout variants (`rail`, `prose`, `wide`, `full`) so pages don't hard-code column spans.
6. **Motion:** add `--ease-standard` and the three duration tokens. Wrap transition utilities in `motion-safe:` so reduced motion is the default fallback.
7. **Planned components** (to be specified in the PRD and implementation plan): `Button`, `TextLink`, `SiteHeader`, `MenuOverlay`, `IndexRow`, `FeaturedProject`, `CaseStudyHeader`, `Colophon`, `Figure`, `Diagram`, `TableOfContents`, `NextProject`, `SiteFooter`.
8. **Diagrams:** author them as inline SVG components that use `currentColor` and the CSS color tokens, so they follow the theme automatically.

## Decisions

- **Conversion goal (2026-11-02): both full-time roles and consulting.** Full-time leads, because recruiters and engineering managers are the primary audience. Consulting is a clearly labelled secondary path.
  - Hero: primary button "View selected work", secondary link "Download resume", plus one `meta` line under the role: `[Availability status]`, e.g. open to senior/staff roles and select contract work.
  - Contact page: one form with an inquiry type (Full-time role / Contract or consulting / Something else). The type changes which optional fields appear (consulting adds timeline and scope; full-time adds company and role link).
  - Navigation stays the same. No separate "Hire me" or "Services" page.

## Open questions

1. Which 3–4 projects can be shown publicly, and which need anonymizing (`[Company]` kept generic)?
2. Is a portrait photo wanted? Concept A works with or without one. If used, it goes in About as a single black-and-white image, not in the hero.
