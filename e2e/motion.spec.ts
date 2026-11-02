import { expect, type Page, test } from "@playwright/test";

const isDesktop = (page: Page) => (page.viewportSize()?.width ?? 0) >= 1024;

/** Collects cumulative layout shift (ignoring shifts right after input, as CLS does). */
async function trackLayoutShift(page: Page) {
  await page.addInitScript(() => {
    (window as unknown as { __cls: number }).__cls = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as (PerformanceEntry & {
        value: number;
        hadRecentInput: boolean;
      })[]) {
        if (!entry.hadRecentInput) (window as unknown as { __cls: number }).__cls += entry.value;
      }
    }).observe({ type: "layout-shift", buffered: true });
  });
}
const readLayoutShift = (page: Page) =>
  page.evaluate(() => (window as unknown as { __cls: number }).__cls);

/** Script URLs referenced by the server-rendered HTML (the initial bundle). */
async function initialScripts(page: Page, path: string) {
  const html = await page.request.get(path).then((r) => r.text());
  const base = new URL(path, test.info().project.use.baseURL);
  return [...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map(
    (match) => new URL(match[1]!, base).href,
  );
}

const opacityOf = (page: Page, selector: string) =>
  page
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

test.describe("performance and stability", () => {
  for (const path of [
    "/",
    "/work/example-project-one",
    "/writing/react-performance-optimization",
  ]) {
    test(`no layout shift while loading and scrolling ${path}`, async ({ page }) => {
      await trackLayoutShift(page);
      await page.goto(path);
      await page.waitForTimeout(800);
      for (let i = 0; i < 6; i += 1) {
        await page.mouse.wheel(0, 700);
        await page.waitForTimeout(120);
      }
      expect(await readLayoutShift(page)).toBeLessThan(0.01);
    });
  }

  test("Motion is only in the initial bundle of the page that uses it", async ({ page }) => {
    // "dragSnapToOrigin" survives minification in Motion bundles.
    // Read the server HTML, not the live DOM: after load, prefetching and
    // idle loading add script tags that aren't part of the initial bundle.
    const motionInInitialBundle = async (path: string) => {
      const srcs = await initialScripts(page, path);
      const bodies = await Promise.all(
        srcs.map((src) => page.request.get(src).then((r) => r.text())),
      );
      return bodies.some((body) => body.includes("dragSnapToOrigin"));
    };
    expect(await motionInInitialBundle("/")).toBe(false);
    expect(await motionInInitialBundle("/work/example-project-one")).toBe(false);
    expect(await motionInInitialBundle("/about")).toBe(false);
    // The writing filter uses Motion for its list animation.
    expect(await motionInInitialBundle("/writing")).toBe(true);
  });
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("homepage content is fully visible", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect.poll(() => opacityOf(page, "#hero-title"), { timeout: 3000 }).toBe(1);

    // Sections below the fold reveal as they scroll in, which works without JS.
    const heading = page.getByRole("heading", { name: "Engineering capabilities" });
    await heading.scrollIntoViewIfNeeded();
    await page.evaluate(() =>
      document.getElementById("capabilities-title")?.scrollIntoView({ block: "center" }),
    );
    await expect.poll(() => opacityOf(page, "#capabilities-title"), { timeout: 3000 }).toBe(1);
  });

  test("writing list and case study render all content", async ({ page }) => {
    await page.goto("/writing");
    await expect(page.locator("main ul > li a[href^='/writing/']")).toHaveCount(6);
    await page.goto("/work/example-project-one");
    await expect(page.locator("article section > h2")).toHaveCount(13);
    // Contents disclosure is a native <details>, so it works without JS too.
    if (!isDesktop(page)) {
      await page.locator("details summary", { hasText: "Contents" }).click();
      await expect(
        page.locator("details").getByRole("link", { name: "Architecture" }),
      ).toBeVisible();
    }
  });
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("disables entrance and scroll-reveal animations", async ({ page }) => {
    await page.goto("/");
    const heroAnimation = await page
      .locator("#hero-title")
      .evaluate((node) => getComputedStyle(node.parentElement!).animationName);
    expect(heroAnimation).toBe("none");

    const revealAnimation = await page
      .locator("#selected-work-title")
      .evaluate((node) => getComputedStyle(node.closest("header")!).animationName);
    expect(revealAnimation).toBe("none");
    expect(await opacityOf(page, "#selected-work-title")).toBe(1);
  });

  test("keeps reading progress, which only mirrors scrolling", async ({ page }) => {
    await page.goto("/work/example-project-one");
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight / 2));
    await expect
      .poll(() =>
        page
          .locator("[data-reading-progress]")
          .evaluate((node) => new DOMMatrix(getComputedStyle(node).transform).a),
      )
      .toBeGreaterThan(0.2);
  });
});

test.describe("interactions", () => {
  test("reading progress fills as the page scrolls and is hidden from assistive tech", async ({
    page,
  }) => {
    await page.goto("/writing/offline-first-applications-with-indexeddb");
    const bar = page.locator("[data-reading-progress]");
    await expect(bar).toHaveAttribute("aria-hidden", "true");
    const scale = () => bar.evaluate((node) => new DOMMatrix(getComputedStyle(node).transform).a);

    expect(await scale()).toBeLessThan(0.05);
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await expect.poll(scale).toBeGreaterThan(0.95);
  });

  test("navigation uses a view transition and morphs the project cover", async ({ page }) => {
    await page.addInitScript(() => {
      const original = document.startViewTransition?.bind(document);
      (window as unknown as { __vt: number }).__vt = 0;
      if (original) {
        document.startViewTransition = ((arg: Parameters<typeof original>[0]) => {
          (window as unknown as { __vt: number }).__vt += 1;
          return original(arg);
        }) as typeof document.startViewTransition;
      }
    });
    await page.goto("/");
    const supported = await page.evaluate(() => "startViewTransition" in document);
    test.skip(!supported, "View Transitions API not supported");

    await page
      .getByRole("link", { name: /Read case study/ })
      .first()
      .click();
    await expect(page).toHaveURL(/\/work\/example-project-one$/);
    expect(await page.evaluate(() => (window as unknown as { __vt: number }).__vt)).toBeGreaterThan(
      0,
    );
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("desktop nav underline grows on hover", async ({ page }) => {
    test.skip(!isDesktop(page), "Desktop only");
    await page.goto("/");
    const label = page
      .getByRole("navigation", { name: "Main" })
      .getByRole("link", { name: "About" })
      .locator("span");
    const width = () => label.evaluate((node) => getComputedStyle(node).backgroundSize);
    expect(await width()).toBe("0% 1px");
    await label.hover();
    await expect.poll(width).toBe("100% 1px");
  });

  test("featured card hover scales the image and nudges the call to action", async ({ page }) => {
    test.skip(!isDesktop(page), "Hover is a pointer interaction");
    await page.goto("/");
    const card = page.locator("#selected-work article").first();
    const image = card.locator("img").first();
    await card.scrollIntoViewIfNeeded();
    await card.getByRole("heading").hover();
    await expect.poll(() => image.evaluate((node) => getComputedStyle(node).scale)).toBe("1.02");
  });

  test("mobile menu links spring in, then exit before the dialog closes", async ({ page }) => {
    test.skip(isDesktop(page), "Mobile only");
    await page.goto("/");
    // Let the idle prefetch bring in the Motion layer.
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: "Open menu" }).click();
    const dialog = page.getByRole("dialog", { name: "Menu" });
    const firstItem = dialog.locator("nav ul li").first();

    // Mid-entrance the item is offset; it settles at rest.
    await expect
      .poll(() => firstItem.evaluate((node) => getComputedStyle(node).transform), { timeout: 3000 })
      .toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
    await expect.poll(() => opacityOf(page, "#mobile-menu nav ul li")).toBe(1);

    await page.keyboard.press("Escape");
    // The dialog stays open briefly for the exit animation, then closes.
    await expect(dialog).toBeHidden();
    await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();
  });

  test("mobile menu still works if the Motion layer fails to load", async ({ page }) => {
    test.skip(isDesktop(page), "Mobile only");
    const initial = new Set((await initialScripts(page, "/")).map((src) => new URL(src).pathname));
    // Block every script that isn't part of the initial page (lazy chunks, prefetches).
    await page.route("**/_next/static/chunks/**", (route) => {
      const { pathname } = new URL(route.request().url());
      return !pathname.endsWith(".js") || initial.has(pathname) ? route.continue() : route.abort();
    });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await page.getByRole("button", { name: "Open menu" }).click();
    const dialog = page.getByRole("dialog", { name: "Menu" });
    await expect(dialog.getByRole("link", { name: "Work" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await page.getByRole("button", { name: "Open menu" }).click();
    await dialog.getByRole("button", { name: "Close menu" }).click();
    await expect(dialog).toBeHidden();
  });

  test("contents marker follows the section being read", async ({ page }) => {
    test.skip(!isDesktop(page), "Desktop only");
    await page.goto("/work/example-project-one");
    const toc = page.getByRole("navigation", { name: "Contents" });
    const marker = toc.locator("[data-contents-marker]");
    await expect(marker).toHaveCount(1);

    await page.evaluate(() => document.getElementById("decisions")?.scrollIntoView());
    const active = toc.getByRole("link", { name: "Key decisions" });
    await expect(active).toHaveAttribute("aria-current", "location");

    // The marker settles beside the active link (after its transition).
    await expect
      .poll(async () => {
        const [m, a] = await Promise.all([marker.boundingBox(), active.boundingBox()]);
        if (!m || !a) return Infinity;
        return Math.abs(m.y + m.height / 2 - (a.y + a.height / 2));
      })
      .toBeLessThan(2);
  });

  test("writing filter animates rows without losing content", async ({ page }) => {
    await page.goto("/writing");
    const rows = page.locator("main ul > li a[href^='/writing/']");
    await page.getByRole("button", { name: "Accessibility" }).click();
    await expect(rows).toHaveCount(1);
    await expect.poll(() => opacityOf(page, "main ul > li")).toBe(1);
    await page.getByRole("button", { name: "All" }).click();
    await expect(rows).toHaveCount(6);
    await expect.poll(() => opacityOf(page, "main ul > li:last-child")).toBe(1);
  });
});
