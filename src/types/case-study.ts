/**
 * Case-study content model.
 *
 * Case studies are plain typed data (src/content/projects). The UI renders
 * them through a fixed set of blocks, so content never contains markup and
 * components never contain portfolio copy.
 */

/* -------------------------------------------------------------------------- */
/* Assets                                                                     */
/* -------------------------------------------------------------------------- */

export type ImageAsset = {
  /** Path under /public, e.g. "/images/projects/<slug>/dashboard.png". */
  src: string;
  /** What the image shows, for screen readers. */
  alt: string;
  /** Intrinsic size in pixels; sets the aspect ratio and prevents layout shift. */
  width: number;
  height: number;
  /** True for drawn or mocked-up scenes (not real screenshots). Shown with an "Illustration" label. */
  illustration?: boolean;
};

/* -------------------------------------------------------------------------- */
/* Blocks                                                                     */
/* -------------------------------------------------------------------------- */

/** Paragraph. Wrap code identifiers in backticks to set them in mono. */
export type ParagraphBlock = { type: "paragraph"; text: string };

/** Sub-heading inside a section (rendered as h3). */
export type SubheadingBlock = { type: "subheading"; text: string };

export type ListBlock = { type: "list"; style?: "bullet" | "numbered"; items: string[] };

/** Term/description pairs, e.g. technology → why it was chosen. */
export type DefinitionsBlock = {
  type: "definitions";
  items: { term: string; description: string }[];
};

/**
 * Screenshots and other images.
 * - single: one image at prose width
 * - wide: one image across the full content column
 * - two-up / three-up: side by side on desktop, stacked on mobile
 */
export type FigureBlock = {
  type: "figure";
  layout: "single" | "wide" | "two-up" | "three-up";
  images: ImageAsset[];
  caption?: string;
};

export type DiagramNode = {
  label: string;
  /** Short annotation under the label. */
  note?: string;
  /** Draws attention to the part the text discusses. */
  highlight?: boolean;
};

/** Layered architecture: each layer is a row of nodes, top to bottom. */
export type ArchitectureDiagramBlock = {
  type: "architecture-diagram";
  title: string;
  layers: { label: string; nodes: DiagramNode[] }[];
  caption?: string;
};

/** Ordered flow: steps connected by arrows, left to right (stacked on mobile). */
export type FlowDiagramBlock = {
  type: "flow-diagram";
  title: string;
  steps: DiagramNode[];
  caption?: string;
};

/** Exported diagram image (SVG or PNG), when a drawn diagram is clearer than generated ones. */
export type DiagramImageBlock = {
  type: "diagram-image";
  image: ImageAsset;
  caption?: string;
};

export type CodeBlock = {
  type: "code";
  /** Display label only, e.g. "ts" or "tsx". */
  language: string;
  code: string;
  filename?: string;
  caption?: string;
};

/** An engineering decision with its reasoning. */
export type DecisionBlock = {
  type: "decision";
  title: string;
  context: string;
  decision: string;
  rationale: string;
  /** Options considered and rejected. */
  alternatives?: string[];
};

/** A trade-off accepted or a challenge met. */
export type TradeoffBlock = {
  type: "tradeoff";
  title: string;
  /** What was gained. */
  gain: string;
  /** What it cost. */
  cost: string;
  /** How the cost was contained, if at all. */
  mitigation?: string;
};

export type CalloutBlock = { type: "callout"; title?: string; text: string };

export type Block =
  | ParagraphBlock
  | SubheadingBlock
  | ListBlock
  | DefinitionsBlock
  | FigureBlock
  | ArchitectureDiagramBlock
  | FlowDiagramBlock
  | DiagramImageBlock
  | CodeBlock
  | DecisionBlock
  | TradeoffBlock
  | CalloutBlock;

/* -------------------------------------------------------------------------- */
/* Results — verified only                                                    */
/* -------------------------------------------------------------------------- */

export type Metric = {
  /** e.g. "38%". */
  value: string;
  /** e.g. "Reduction in median interaction latency". */
  label: string;
};

/**
 * Results exist only with a stated source. The type makes the source
 * mandatory, so an unverified number cannot be added by accident.
 */
export type VerifiedResults = {
  /** Where the numbers come from, e.g. "Production RUM data, Jan–Mar 2024". Shown under the metrics. */
  source: string;
  metrics?: Metric[];
  blocks?: Block[];
};

/* -------------------------------------------------------------------------- */
/* Case study                                                                 */
/* -------------------------------------------------------------------------- */

/** Sections in reading order. Omit any that don't apply; they are skipped and left out of the contents list. */
export type CaseStudyBody = {
  overview: Block[];
  context?: Block[];
  problem?: Block[];
  role?: Block[];
  /** Only when the team structure is known. */
  team?: Block[];
  requirements?: Block[];
  architecture?: Block[];
  technology?: Block[];
  decisions?: Block[];
  tradeoffs?: Block[];
  performance?: Block[];
  accessibility?: Block[];
  results?: VerifiedResults;
  lessons?: Block[];
};

export type CaseStudySectionKey = keyof CaseStudyBody;
