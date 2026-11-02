import { expect, test } from "@playwright/test";

/*
 * Production readiness checks against the built app. The same assertions are
 * repeated against the live domain after deployment (see docs/deployment.md).
 */

test("robots.txt allows crawling and links the sitemap", async ({ request }) => {
  const response = await request.get("/robots.txt");
  expect(response.status()).toBe(200);
  const body = await response.text();
  expect(body).toContain("User-Agent: *");
  expect(body).toContain("Disallow: /api/");
  expect(body).toMatch(/Sitemap: https?:\/\/[^\s]+\/sitemap\.xml/);
});

test("sitemap lists public pages and leaves out examples and drafts", async ({ request }) => {
  const response = await request.get("/sitemap.xml");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("xml");
  const xml = await response.text();
  for (const path of ["/work", "/about", "/experience", "/writing", "/contact"]) {
    expect(xml).toContain(`${path}</loc>`);
  }
  expect(xml).not.toContain("example-project");
  expect(xml).not.toContain("/writing/");
  expect(xml).not.toContain("/api/");
});

test("responses carry security headers and hide the framework", async ({ request }) => {
  const response = await request.get("/");
  const headers = response.headers();
  expect(headers["strict-transport-security"]).toContain("max-age=63072000");
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(headers["x-frame-options"]).toBe("DENY");
  expect(headers["permissions-policy"]).toContain("camera=()");
  expect(headers["x-powered-by"]).toBeUndefined();
});

test("development-only pages are gone", async ({ request }) => {
  expect((await request.get("/design-system")).status()).toBe(404);
});

test("every public page has a canonical URL on the configured origin", async ({ page }) => {
  for (const path of ["/", "/work", "/about", "/experience", "/writing", "/contact"]) {
    await page.goto(path);
    const canonical = await page.locator("link[rel='canonical']").getAttribute("href");
    expect(canonical, path).toBeTruthy();
    expect(new URL(canonical!).pathname.replace(/\/$/, "") || "/", path).toBe(path);
  }
});
