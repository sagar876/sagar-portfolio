import { expect, type Page, test } from "@playwright/test";

const isDesktop = (page: Page) => (page.viewportSize()?.width ?? 0) >= 1024;

/** Lowest opacity on the element or any ancestor, i.e. what the user actually sees. */
async function effectiveOpacity(page: Page, selector: string) {
  return page
    .locator(selector)
    .first()
    .evaluate((node) => {
      let element: Element | null = node;
      let opacity = 1;
      while (element) {
        opacity = Math.min(opacity, Number(getComputedStyle(element).opacity));
        element = element.parentElement;
      }
      return opacity;
    });
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test.describe("homepage content", () => {
  test("has one h1 and every section as a labelled region", async ({ page }) => {
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText("Sagar Dixit");

    for (const name of [
      "Selected work",
      "Experience",
      "Engineering capabilities",
      "Approach",
      "About",
      "Hiring a senior frontend engineer?",
    ]) {
      await expect(page.getByRole("region", { name })).toBeAttached();
    }
    await expect(page.getByRole("contentinfo")).toBeVisible();
  });

  test("hero is fully visible once the entrance animation finishes", async ({ page }) => {
    await expect(page.getByRole("link", { name: "Explore my work" })).toBeVisible();
    await expect.poll(() => effectiveOpacity(page, "#hero-title"), { timeout: 3000 }).toBe(1);
    await expect
      .poll(() => effectiveOpacity(page, "a[href='#selected-work']"), { timeout: 3000 })
      .toBe(1);
  });

  test("shows 3–4 featured projects, each linking to its case study", async ({ page }) => {
    const region = page.getByRole("region", { name: "Selected work" });
    const articles = region.getByRole("article");
    const count = await articles.count();
    expect(count).toBeGreaterThanOrEqual(3);
    expect(count).toBeLessThanOrEqual(4);

    const caseStudyLinks = region.getByRole("link", { name: /^Read case study/ });
    await expect(caseStudyLinks).toHaveCount(count);
    for (const link of await caseStudyLinks.all()) {
      await expect(link).toHaveAttribute("href", /^\/work\/[a-z0-9-]+$/);
    }
  });

  test("resume links download the PDF", async ({ page }) => {
    const resumeLinks = page.locator("a[download]");
    expect(await resumeLinks.count()).toBeGreaterThan(0);
    for (const link of await resumeLinks.all()) {
      await expect(link).toHaveAttribute("href", "/resume/sagar-dixit-resume.pdf");
    }
  });

  test("does not scroll horizontally", async ({ page }) => {
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
});

test.describe("interactions", () => {
  test("primary CTA jumps to selected work", async ({ page }) => {
    await page.getByRole("link", { name: "Explore my work" }).click();
    await expect(page).toHaveURL(/#selected-work$/);
    await expect(page.getByRole("heading", { name: "Selected work" })).toBeInViewport();
  });

  test("skip link is the first stop and moves focus to main", async ({ page }) => {
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to content" });
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();
    await page.keyboard.press("Enter");
    await expect(page.locator("main")).toBeFocused();
  });

  test("back to top returns to the start and focuses main", async ({ page }) => {
    const backToTop = page.getByRole("link", { name: "Back to top" });
    await backToTop.scrollIntoViewIfNeeded();
    await backToTop.click();
    await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 3000 }).toBeLessThan(5);
    await expect(page.locator("main")).toBeFocused();
  });

  test("respects reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.reload();
    const animation = await page
      .locator("#hero-title")
      .evaluate((node) => getComputedStyle(node.parentElement!).animationName);
    expect(animation).toBe("none");
    expect(await effectiveOpacity(page, "#hero-title")).toBe(1);
  });

  test("follows the dark color scheme", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await expect(page.locator("body")).toHaveCSS("background-color", "rgb(15, 16, 17)");
  });
});

test.describe("desktop header", () => {
  test.beforeEach(({ page }) => {
    test.skip(!isDesktop(page), "Desktop only");
  });

  test("shows inline navigation instead of the menu button", async ({ page }) => {
    const nav = page.getByRole("navigation", { name: "Main" });
    await expect(nav).toBeVisible();
    await expect(nav.getByRole("link", { name: "Work" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Open menu" })).toBeHidden();
  });

  test("hides on scroll down, returns on scroll up", async ({ page }) => {
    const header = page.locator("body > header");
    await page.mouse.wheel(0, 1200);
    await expect(header).toHaveAttribute("data-hidden", "true");
    await expect(header).not.toBeInViewport();

    await page.mouse.wheel(0, -300);
    await expect(header).toHaveAttribute("data-hidden", "false");
    await expect(header).toBeInViewport();
  });

  test("stays visible while it has keyboard focus", async ({ page }) => {
    const header = page.locator("body > header");
    await page.mouse.wheel(0, 1200);
    await expect(header).toHaveAttribute("data-hidden", "true");
    await header.getByRole("link", { name: "Work" }).focus();
    await expect(header).toBeInViewport();
  });

  test("marks the current page in the navigation", async ({ page }) => {
    await page
      .getByRole("navigation", { name: "Main" })
      .getByRole("link", { name: "Work" })
      .click();
    await expect(page).toHaveURL(/\/work$/);
    await expect(
      page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Work" }),
    ).toHaveAttribute("aria-current", "page");
  });
});

test.describe("mobile menu", () => {
  test.beforeEach(({ page }) => {
    test.skip(isDesktop(page), "Mobile only");
  });

  test("opens as a modal, traps focus, closes on Escape and restores focus", async ({ page }) => {
    const toggle = page.getByRole("button", { name: "Open menu" });
    await expect(toggle).toHaveAttribute("aria-expanded", "false");

    await toggle.click();
    const dialog = page.getByRole("dialog", { name: "Menu" });
    await expect(dialog).toBeVisible();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(dialog.getByRole("link", { name: "Work" })).toBeVisible();

    // Page behind is locked.
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).overflow)).toBe(
      "hidden",
    );

    // Focus never reaches page content behind the dialog. After the last item
    // a native modal hands focus to the browser UI (reported as <body>), then
    // wraps back to the first item.
    for (let i = 0; i < 12; i += 1) {
      await page.keyboard.press("Tab");
      const focusOutsideDialog = await page.evaluate(() => {
        const active = document.activeElement;
        return active !== null && active !== document.body && active.closest("dialog") === null;
      });
      expect(focusOutsideDialog).toBe(false);
    }

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(toggle).toBeFocused();
  });

  test("close button closes the menu", async ({ page }) => {
    await page.getByRole("button", { name: "Open menu" }).click();
    const dialog = page.getByRole("dialog", { name: "Menu" });
    await dialog.getByRole("button", { name: "Close menu" }).click();
    await expect(dialog).toBeHidden();
  });

  test("navigating from the menu closes it and marks the page", async ({ page }) => {
    await page.getByRole("button", { name: "Open menu" }).click();
    const dialog = page.getByRole("dialog", { name: "Menu" });
    await dialog.getByRole("link", { name: "About" }).click();
    await expect(page).toHaveURL(/\/about$/);
    await expect(dialog).toBeHidden();

    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(dialog.getByRole("link", { name: "About" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });
});
