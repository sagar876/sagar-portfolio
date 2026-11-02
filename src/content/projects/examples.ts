import { type CaseStudyBody, type ImageAsset } from "@/types/case-study";
import { type Project } from "@/types/content";

/**
 * EXAMPLE CONTENT — NOT REAL PROJECTS.
 *
 * These entries show every case-study block in place and double as a writing
 * guide: each bracketed sentence says what belongs there. Replace them with
 * real, verified projects (status: "published"), then delete this file.
 *
 * No results section is included on purpose: results appear only when real,
 * verified numbers and their source are supplied.
 */

const exampleImage = (name: string, alt: string, width: number, height: number): ImageAsset => ({
  src: `/images/projects/example/${name}.svg`,
  alt,
  width,
  height,
});

const cover = exampleImage("cover", "Example placeholder for a project cover image", 1600, 1000);

const fullBody: CaseStudyBody = {
  overview: [
    {
      type: "paragraph",
      text: "[Introduce the project in two or three sentences: what the product is, who uses it, and why the frontend work mattered.]",
    },
    {
      type: "figure",
      layout: "wide",
      images: [
        exampleImage(
          "screen-wide",
          "Example placeholder for a full product screenshot",
          1600,
          1000,
        ),
      ],
      caption: "[Caption: what the screenshot shows and where it sits in the product.]",
    },
  ],
  context: [
    {
      type: "paragraph",
      text: "[Describe the situation before the work started: the product stage, the existing frontend, and any organisational context that shaped the project. Keep confidential names and details out.]",
    },
  ],
  problem: [
    {
      type: "paragraph",
      text: "[State the problem in one paragraph. Focus on the user or business problem first, then the technical one.]",
    },
    {
      type: "callout",
      title: "Problem statement",
      text: "[One sentence a reader could repeat: e.g. what had to change, for whom, and under which constraint.]",
    },
  ],
  role: [
    {
      type: "paragraph",
      text: "[Describe your role in one or two sentences, including what you owned end to end.]",
    },
    {
      type: "list",
      items: [
        "[Responsibility you held]",
        "[Responsibility you held]",
        "[Responsibility you held]",
      ],
    },
  ],
  team: [
    {
      type: "definitions",
      items: [
        { term: "[Role]", description: "[Number of people and what they owned]" },
        { term: "[Role]", description: "[Number of people and what they owned]" },
      ],
    },
  ],
  requirements: [
    { type: "subheading", text: "Functional" },
    { type: "list", items: ["[What the system had to do]", "[What the system had to do]"] },
    { type: "subheading", text: "Non-functional" },
    {
      type: "list",
      items: [
        "[A constraint such as browser support, latency budget or offline behaviour]",
        "[A constraint such as accessibility level or bundle-size limit]",
      ],
    },
  ],
  architecture: [
    {
      type: "paragraph",
      text: "[Explain the architecture at the level a new team member would need on day one. Reference the diagram below.]",
    },
    {
      type: "architecture-diagram",
      title: "[System overview]",
      layers: [
        {
          label: "[Client]",
          nodes: [
            { label: "[App shell]", note: "[Routing, auth]" },
            {
              label: "[Feature module]",
              highlight: true,
              note: "[The part this case study is about]",
            },
            { label: "[Feature module]" },
          ],
        },
        {
          label: "[Shared]",
          nodes: [{ label: "[Design system]" }, { label: "[State / data layer]" }],
        },
        {
          label: "[Services]",
          nodes: [{ label: "[API]" }, { label: "[Real-time service]" }],
        },
      ],
      caption: "[Caption: what the highlighted part is and why it matters.]",
    },
    {
      type: "flow-diagram",
      title: "[Data flow]",
      steps: [
        { label: "[User action]" },
        { label: "[Optimistic update]", note: "[Where state changes]" },
        { label: "[Queue / sync]", highlight: true },
        { label: "[Server confirmation]" },
      ],
      caption: "[Caption: the path a single change takes through the system.]",
    },
  ],
  technology: [
    {
      type: "definitions",
      items: [
        { term: "[Technology]", description: "[Why it was chosen over the alternatives]" },
        { term: "[Technology]", description: "[Why it was chosen over the alternatives]" },
        { term: "[Technology]", description: "[Why it was chosen over the alternatives]" },
      ],
    },
  ],
  decisions: [
    {
      type: "decision",
      title: "[Decision title]",
      context: "[What forced a choice]",
      decision: "[What was decided]",
      rationale: "[Why, in terms of the requirements above]",
      alternatives: ["[Option considered and why it lost]", "[Option considered and why it lost]"],
    },
    {
      type: "code",
      language: "ts",
      filename: "[example-file].ts",
      code: `// Example only: replace with a short, non-confidential excerpt
// that makes the decision above concrete.
type SyncStatus = "idle" | "pending" | "failed";

export function nextStatus(current: SyncStatus, ok: boolean): SyncStatus {
  if (current === "pending") return ok ? "idle" : "failed";
  return current;
}`,
      caption: "[Caption: what this excerpt shows.]",
    },
  ],
  tradeoffs: [
    {
      type: "tradeoff",
      title: "[Trade-off title]",
      gain: "[What the team gained]",
      cost: "[What it cost]",
      mitigation: "[How the cost was contained]",
    },
    {
      type: "tradeoff",
      title: "[Challenge title]",
      gain: "[What was achieved despite it]",
      cost: "[What made it hard]",
    },
  ],
  performance: [
    {
      type: "paragraph",
      text: "[Describe how performance and scale were approached: budgets, measurement, and the techniques used. Only include numbers you can verify.]",
    },
    {
      type: "figure",
      layout: "two-up",
      images: [
        exampleImage("detail", "Example placeholder for a detail screenshot", 1200, 900),
        exampleImage("detail", "Example placeholder for a second detail screenshot", 1200, 900),
      ],
      caption: "[Caption for a side-by-side comparison.]",
    },
  ],
  accessibility: [
    {
      type: "paragraph",
      text: "[Describe accessibility work: keyboard support, screen-reader testing, contrast, motion. Name the standard you targeted.]",
    },
    {
      type: "figure",
      layout: "three-up",
      images: [
        exampleImage("mobile", "Example placeholder for a mobile screenshot", 780, 1560),
        exampleImage("mobile", "Example placeholder for a mobile screenshot", 780, 1560),
        exampleImage("mobile", "Example placeholder for a mobile screenshot", 780, 1560),
      ],
      caption: "[Caption for a set of mobile screens.]",
    },
  ],
  lessons: [
    {
      type: "list",
      items: ["[What you would repeat]", "[What you would do differently]"],
    },
  ],
};

/** A shorter body: shows that optional sections can be left out. */
const shortBody: CaseStudyBody = {
  overview: fullBody.overview,
  problem: fullBody.problem,
  role: fullBody.role,
  architecture: fullBody.architecture,
  decisions: fullBody.decisions,
  lessons: fullBody.lessons,
};

const base = {
  status: "example",
  title: "[Project name]",
  summary: "[One or two sentences: the problem, your role and the approach taken.]",
  category: "[Category]",
  role: "[Role]",
  timeline: "[Year]",
  stack: ["[Technology]", "[Technology]", "[Technology]"],
  featured: true,
  cover,
} as const satisfies Partial<Project>;

export const exampleProjects: Project[] = [
  {
    ...base,
    slug: "example-project-one",
    stack: [...base.stack],
    company: "[Company]",
    teamSize: "[Team size]",
    caseStudy: fullBody,
    related: ["example-project-two", "example-project-three"],
  },
  {
    ...base,
    slug: "example-project-two",
    stack: [...base.stack],
    caseStudy: shortBody,
  },
  {
    ...base,
    slug: "example-project-three",
    stack: [...base.stack],
    caseStudy: shortBody,
  },
];
