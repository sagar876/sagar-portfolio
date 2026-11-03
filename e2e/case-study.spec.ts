import { expect, type Page, test } from "@playwright/test";

const isDesktop = (page: Page) => (page.viewportSize()?.width ?? 0) >= 1024;

test.describe("work index", () => {
  test("lists every project, Superfit first and the CMS second", async ({ page }) => {
    await page.goto("/work");
    await expect(page.getByRole("heading", { level: 1, name: "Selected work" })).toBeVisible();
    const links = page.locator("main a[href^='/work/']");
    expect(await links.count()).toBeGreaterThanOrEqual(8);
    await expect(links.nth(0)).toHaveAttribute("href", "/work/superfit-november");
    await expect(links.nth(1)).toHaveAttribute("href", "/work/ninestack-cms");
    await links.first().click();
    await expect(page).toHaveURL(/\/work\/superfit-november$/);
  });
});

test.describe("case study page", () => {
  test("renders the header, facts and the sections it has, in order", async ({ page }) => {
    await page.goto("/work/airfi-offline-sync");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Offline-first sync engine");
    for (const term of ["Role", "Company", "Timeline", "Stack"]) {
      await expect(page.locator("dt", { hasText: new RegExp(`^${term}$`) }).first()).toBeAttached();
    }
    // Team size isn't known, so the fact is left out rather than invented.
    await expect(page.locator("dt", { hasText: /^Team$/ })).toHaveCount(0);
    const headings = await page.locator("article section > h2").allTextContents();
    expect(headings).toEqual([
      "Overview",
      "Problem",
      "My role",
      "Architecture",
      "Technology choices",
    ]);
    await expect(page.locator("#results")).toHaveCount(0);
  });

  test("shorter case studies only list the sections they have", async ({ page }) => {
    await page.goto("/work/fabric-ui-library");
    expect(await page.locator("article section > h2").allTextContents()).toEqual([
      "Overview",
      "My role",
    ]);
  });

  test("renders diagrams as readable, numbered figures", async ({ page }) => {
    await page.goto("/work/airfi-realtime-platform");
    const architecture = page.locator("#architecture");
    await expect(architecture.getByText("WebSocket layer")).toBeVisible();
    await expect(architecture.getByText("(highlighted)").first()).toBeAttached();
    const counter = await architecture
      .locator("figcaption")
      .first()
      .evaluate((node) => getComputedStyle(node, "::before").content);
    expect(counter).toContain("counter");

    await page.goto("/work/airfi-offline-sync");
    const steps = page
      .locator("#architecture ol")
      .filter({ hasText: "Capture data" })
      .locator(":scope > li");
    await expect(steps).toHaveCount(4);
  });

  test("labels illustrated covers and loads images with intrinsic size", async ({ page }) => {
    await page.goto("/work/airfi-realtime-platform");
    await expect(page.locator("header figcaption")).toContainText("Illustration");
    const cover = page.locator("article header img").first();
    await expect(cover).toHaveAttribute("alt", /^Illustration of/);
    await expect(cover).toHaveAttribute("width", /\d+/);
    await expect(cover).toHaveAttribute("height", /\d+/);
  });

  test("links to the live product when there is one", async ({ page }) => {
    await page.goto("/work/ninestack-cms");
    const link = page.getByRole("link", { name: /Boligkanalen/ });
    await expect(link).toHaveAttribute("href", "https://boligkanalen.no/");
    await expect(link).toHaveAttribute("target", "_blank");
  });

  test("links to related projects and back to the index", async ({ page }) => {
    await page.goto("/work/airfi-offline-sync");
    const related = page.getByRole("region", { name: "Related projects" });
    await expect(related.locator("a[href='/work/airfi-realtime-platform']")).toBeAttached();
    await expect(related.locator("a[href='/work/airfi-airline-copilot']")).toBeAttached();
    await page.getByRole("link", { name: "All work" }).first().click();
    await expect(page).toHaveURL(/\/work$/);
  });

  test("has indexable article metadata", async ({ page }) => {
    await page.goto("/work/airfi-realtime-platform");
    await expect(page).toHaveTitle("Real-time operations platform — Sagar Dixit");
    await expect(page.locator("meta[name='robots'][content*='noindex']")).toHaveCount(0);
    await expect(page.locator("link[rel='canonical']")).toHaveAttribute(
      "href",
      /\/work\/airfi-realtime-platform$/,
    );
    await expect(page.locator("meta[property='og:type']")).toHaveAttribute("content", "article");
    await expect(page.locator("meta[property='og:image']")).toHaveAttribute(
      "content",
      /cover\.png/,
    );
  });

  test("does not scroll horizontally", async ({ page }) => {
    for (const slug of [
      "superfit-november",
      "ninestack-cms",
      "airfi-realtime-platform",
      "happay-invoice-management",
    ]) {
      await page.goto(`/work/${slug}`);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, slug).toBeLessThanOrEqual(0);
    }
  });
});

test.describe("contents navigation", () => {
  test("desktop: sticky list jumps to sections and tracks the one being read", async ({ page }) => {
    test.skip(!isDesktop(page), "Desktop only");
    await page.goto("/work/airfi-offline-sync");
    const toc = page.getByRole("navigation", { name: "Contents" });
    await expect(toc.getByRole("link")).toHaveCount(5);
    await toc.getByRole("link", { name: "Architecture" }).click();
    await expect(page).toHaveURL(/#architecture$/);
    await expect(page.getByRole("heading", { level: 2, name: "Architecture" })).toBeInViewport();
    await expect(toc.getByRole("link", { name: "Architecture" })).toHaveAttribute(
      "aria-current",
      "location",
    );
    await expect(toc).toBeInViewport();
  });

  test("mobile: collapsible contents opens and jumps to a section", async ({ page }) => {
    test.skip(isDesktop(page), "Mobile only");
    await page.goto("/work/airfi-offline-sync");
    const summary = page.locator("details summary", { hasText: "Contents" });
    const link = page.locator("details").getByRole("link", { name: "Architecture" });
    await expect(link).toBeHidden();
    await summary.click();
    await link.click();
    await expect(page).toHaveURL(/#architecture$/);
    await expect(page.getByRole("heading", { level: 2, name: "Architecture" })).toBeInViewport();
  });
});

test("unknown case studies return 404", async ({ page }) => {
  const response = await page.goto("/work/does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("This page doesn't exist");
});
