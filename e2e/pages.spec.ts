import { expect, test } from "@playwright/test";

test.describe("about page", () => {
  test("has every section and a resume download", async ({ page }) => {
    await page.goto("/about");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Frontend engineer and UI architect",
    );
    for (const name of ["How I work", "Career journey", "Areas of expertise"]) {
      await expect(page.getByRole("region", { name })).toBeAttached();
    }
    // Interests are hidden until provided.
    await expect(page.getByRole("region", { name: /interests|outside work/i })).toHaveCount(0);
    const resume = page
      .getByRole("region", { name: /resume/i })
      .getByRole("link", { name: /Download resume/ });
    await expect(resume).toHaveAttribute("download", "");
    await expect(page.getByRole("link", { name: "Full experience" })).toHaveAttribute(
      "href",
      "/experience",
    );
  });

  test("has page metadata", async ({ page }) => {
    await page.goto("/about");
    await expect(page).toHaveTitle("About — Sagar Dixit");
    await expect(page.locator("link[rel='canonical']")).toHaveAttribute("href", /\/about$/);
    await expect(page.locator("meta[name='description']")).toHaveAttribute(
      "content",
      /UI Architect/,
    );
  });
});

test.describe("experience page", () => {
  test("shows a timeline with dates, role, company and details", async ({ page }) => {
    await page.goto("/experience");
    await expect(page).toHaveTitle("Experience — Sagar Dixit");
    const roles = page.locator("main ol > li");
    expect(await roles.count()).toBeGreaterThan(0);

    const first = roles.first();
    await expect(first.getByRole("heading", { level: 3 })).toBeVisible();
    for (const label of ["Responsibilities", "Accomplishments", "Technologies"]) {
      await expect(first.getByRole("heading", { level: 4, name: label })).toBeVisible();
    }
    // An entry without verified accomplishments omits the heading.
    await expect(
      roles.last().getByRole("heading", { level: 4, name: "Accomplishments" }),
    ).toHaveCount(0);
  });

  test("is reachable from the navigation", async ({ page }) => {
    await page.goto("/");
    if ((page.viewportSize()?.width ?? 0) < 1024) {
      await page.getByRole("button", { name: "Open menu" }).click();
      await page
        .getByRole("dialog", { name: "Menu" })
        .getByRole("link", { name: "Experience" })
        .click();
    } else {
      await page
        .getByRole("navigation", { name: "Main" })
        .getByRole("link", { name: "Experience" })
        .click();
    }
    await expect(page).toHaveURL(/\/experience$/);
  });
});

test.describe("writing", () => {
  test("lists articles with category, reading time and status", async ({ page }) => {
    await page.goto("/writing");
    await expect(page).toHaveTitle("Writing — Sagar Dixit");
    const rows = page.locator("main ul > li a[href^='/writing/']");
    await expect(rows).toHaveCount(6);
    await expect(rows.first()).toContainText(/\d+ min read/);
    await expect(rows.first()).toContainText(/Draft|\d{4}/);
  });

  test("filters by category and announces the result", async ({ page }) => {
    await page.goto("/writing");
    const group = page.getByRole("group", { name: "Filter by category" });
    const rows = page.locator("main ul > li a[href^='/writing/']");

    await expect(group.getByRole("button", { name: "All" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await group.getByRole("button", { name: "Offline-first" }).click();
    await expect(group.getByRole("button", { name: "Offline-first" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(group.getByRole("button", { name: "All" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    await expect(rows).toHaveCount(1);
    await expect(rows.first()).toContainText("IndexedDB");
    await expect(page.getByText("1 article shown")).toBeAttached();

    await group.getByRole("button", { name: "All" }).click();
    await expect(rows).toHaveCount(6);
  });

  test("filter works with the keyboard", async ({ page }) => {
    await page.goto("/writing");
    const button = page.getByRole("button", { name: "Performance" });
    await button.focus();
    await page.keyboard.press("Enter");
    await expect(button).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("main ul > li a[href^='/writing/']")).toHaveCount(1);
  });

  test("article page renders MDX with the design system", async ({ page }) => {
    await page.goto("/writing");
    await page
      .getByRole("link", { name: /Managing real-time data with WebSockets in React/ })
      .click();
    await expect(page).toHaveURL(/\/writing\/real-time-data-with-websockets-in-react$/);

    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Managing real-time data with WebSockets in React",
    );
    await expect(page.getByText(/\d+ min read/).first()).toBeVisible();
    await expect(page.getByText("Real-time", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Draft", { exact: true }).first()).toBeVisible();

    const body = page.locator("article");
    expect(await body.getByRole("heading", { level: 2 }).count()).toBeGreaterThanOrEqual(3);
    const code = body.locator("pre[tabindex='0']").first();
    await expect(code).toContainText("class Connection");
    await code.focus();
    await expect(code).toBeFocused();
    await expect(body.locator("ul li").first()).toBeVisible();

    await expect(
      page.getByRole("region", { name: "More writing" }).locator("a[href^='/writing/']"),
    ).toHaveCount(2);
  });

  test("article metadata marks drafts as noindex", async ({ page }) => {
    await page.goto("/writing/offline-first-applications-with-indexeddb");
    await expect(page).toHaveTitle("Offline-first applications with IndexedDB — Sagar Dixit");
    await expect(page.locator("meta[name='robots']")).toHaveAttribute("content", /noindex/);
    await expect(page.locator("meta[property='og:type']")).toHaveAttribute("content", "article");
    await expect(page.locator("meta[property='article:section']")).toHaveAttribute(
      "content",
      "Offline-first",
    );
    await expect(page.locator("link[rel='canonical']")).toHaveAttribute(
      "href",
      /\/writing\/offline-first-applications-with-indexeddb$/,
    );
  });

  test("unknown articles return 404", async ({ page }) => {
    const response = await page.goto("/writing/does-not-exist");
    expect(response?.status()).toBe(404);
  });

  test("pages do not scroll horizontally", async ({ page }) => {
    for (const path of [
      "/about",
      "/experience",
      "/writing",
      "/writing/react-performance-optimization",
    ]) {
      await page.goto(path);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, path).toBeLessThanOrEqual(0);
    }
  });
});
