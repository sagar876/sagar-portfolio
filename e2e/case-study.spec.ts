import { expect, type Page, test } from "@playwright/test";

const isDesktop = (page: Page) => (page.viewportSize()?.width ?? 0) >= 1024;
const SLUG = "example-project-one";

test.describe("work index", () => {
  test("lists every project with a link to its case study", async ({ page }) => {
    await page.goto("/work");
    await expect(page.getByRole("heading", { level: 1, name: "Selected work" })).toBeVisible();
    const links = page.locator("main a[href^='/work/']");
    expect(await links.count()).toBeGreaterThanOrEqual(3);
    await links.first().click();
    await expect(page).toHaveURL(/\/work\/[a-z0-9-]+$/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
});

test.describe("case study page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/work/${SLUG}`);
  });

  test("renders the header, facts and every provided section in order", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.getByText("Example content")).toBeVisible();
    for (const term of ["Role", "Company", "Timeline", "Team", "Stack"]) {
      await expect(page.locator("dt", { hasText: new RegExp(`^${term}$`) }).first()).toBeAttached();
    }

    const headings = await page.locator("article section > h2").allTextContents();
    expect(headings).toEqual([
      "Overview",
      "Context",
      "Problem",
      "My role",
      "Team",
      "Technical requirements",
      "Architecture",
      "Technology choices",
      "Key decisions",
      "Trade-offs and challenges",
      "Performance and scalability",
      "Accessibility",
      "Lessons learned",
    ]);
  });

  test("omits results when none are verified", async ({ page }) => {
    await expect(page.locator("#results")).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "Results" })).toHaveCount(0);
  });

  test("numbers figures in order", async ({ page }) => {
    const labels = await page
      .locator("article figcaption")
      .evaluateAll((captions) =>
        captions
          .map((c) => getComputedStyle(c, "::before").content)
          .filter((content) => content && content !== "none"),
      );
    expect(labels.length).toBeGreaterThanOrEqual(5);
    // CSS counters can't be read back as text, so check each caption declares one.
    for (const content of labels) expect(content).toContain("counter");
  });

  test("renders diagrams as readable structure", async ({ page }) => {
    const architecture = page.locator("#architecture");
    await expect(architecture.getByText("[App shell]")).toBeVisible();
    await expect(architecture.getByText("(highlighted)").first()).toBeAttached();
    const steps = architecture
      .locator("ol")
      .filter({ hasText: "[User action]" })
      .locator(":scope > li");
    await expect(steps).toHaveCount(4);
  });

  test("code blocks are keyboard scrollable", async ({ page }) => {
    const code = page.locator("pre[tabindex='0']").first();
    await code.focus();
    await expect(code).toBeFocused();
    await expect(code).toHaveAttribute("aria-label", /\.ts$/);
  });

  test("loads optimized images with intrinsic size", async ({ page }) => {
    const images = page.locator("article img");
    expect(await images.count()).toBeGreaterThan(0);
    for (const img of await images.all()) {
      await expect(img).toHaveAttribute("alt", /.+/);
      await expect(img).toHaveAttribute("width", /\d+/);
      await expect(img).toHaveAttribute("height", /\d+/);
    }
  });

  test("links to related projects", async ({ page }) => {
    const related = page.getByRole("region", { name: "Related projects" });
    await expect(related.locator("a[href='/work/example-project-two']")).toBeAttached();
    await expect(related.locator("a[href='/work/example-project-three']")).toBeAttached();
  });

  test("back link returns to the work index", async ({ page }) => {
    await page.getByRole("link", { name: "All work" }).first().click();
    await expect(page).toHaveURL(/\/work$/);
  });

  test("has article metadata and stays out of search while it is an example", async ({ page }) => {
    await expect(page).toHaveTitle("[Project name] — Sagar Dixit");
    await expect(page.locator("meta[name='robots']")).toHaveAttribute("content", /noindex/);
    await expect(page.locator("link[rel='canonical']")).toHaveAttribute(
      "href",
      new RegExp(`/work/${SLUG}$`),
    );
    await expect(page.locator("meta[property='og:type']")).toHaveAttribute("content", "article");
    await expect(page.locator("meta[property='og:image']")).toHaveAttribute("content", /cover/);
    await expect(page.locator("meta[name='description']")).toHaveAttribute("content", /.+/);
  });

  test("does not scroll horizontally", async ({ page }) => {
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
});

test.describe("contents navigation", () => {
  test("desktop: sticky list jumps to sections and tracks the one being read", async ({ page }) => {
    test.skip(!isDesktop(page), "Desktop only");
    await page.goto(`/work/${SLUG}`);
    const toc = page.getByRole("navigation", { name: "Contents" });
    await expect(toc).toBeVisible();
    await expect(toc.getByRole("link")).toHaveCount(13);

    await toc.getByRole("link", { name: "Architecture" }).click();
    await expect(page).toHaveURL(/#architecture$/);
    await expect(page.getByRole("heading", { level: 2, name: "Architecture" })).toBeInViewport();
    await expect(toc.getByRole("link", { name: "Architecture" })).toHaveAttribute(
      "aria-current",
      "location",
    );
    // Still visible after scrolling (sticky).
    await expect(toc).toBeInViewport();

    await page.evaluate(() => document.getElementById("lessons")?.scrollIntoView());
    await expect(toc.getByRole("link", { name: "Lessons learned" })).toHaveAttribute(
      "aria-current",
      "location",
    );
  });

  test("mobile: collapsible contents opens and jumps to a section", async ({ page }) => {
    test.skip(isDesktop(page), "Mobile only");
    await page.goto(`/work/${SLUG}`);
    const summary = page.locator("details summary", { hasText: "Contents" });
    await expect(summary).toBeVisible();
    const link = page.locator("details").getByRole("link", { name: "Key decisions" });
    await expect(link).toBeHidden();
    await summary.click();
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/#decisions$/);
    await expect(page.getByRole("heading", { level: 2, name: "Key decisions" })).toBeInViewport();
  });
});

test("a shorter case study only lists the sections it has", async ({ page }) => {
  await page.goto("/work/example-project-two");
  const headings = await page.locator("article section > h2").allTextContents();
  expect(headings).toEqual([
    "Overview",
    "Problem",
    "My role",
    "Architecture",
    "Key decisions",
    "Lessons learned",
  ]);
});

test("unknown case studies return 404", async ({ page }) => {
  const response = await page.goto("/work/does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("This page doesn't exist");
});
