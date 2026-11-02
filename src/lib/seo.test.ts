import { afterEach, describe, expect, it, vi } from "vitest";

/*
 * robots.ts and siteConfig read environment variables at import time, so each
 * case stubs the environment and re-imports the modules.
 */
async function load(env: Record<string, string | undefined>) {
  vi.resetModules();
  for (const [key, value] of Object.entries(env)) vi.stubEnv(key, value as string);
  const { default: robots } = await import("@/app/robots");
  const { siteConfig } = await import("@/config/site");
  return { robots: robots(), siteConfig };
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("robots.txt", () => {
  it("allows crawling on the production deployment and points to the sitemap", async () => {
    const { robots } = await load({
      VERCEL_ENV: "production",
      NEXT_PUBLIC_SITE_URL: "https://portfolio.test",
    });
    expect(robots.rules).toEqual({ userAgent: "*", allow: "/", disallow: "/api/" });
    expect(robots.sitemap).toBe("https://portfolio.test/sitemap.xml");
  });

  it("blocks all crawling on preview deployments", async () => {
    const { robots } = await load({
      VERCEL_ENV: "preview",
      NEXT_PUBLIC_SITE_URL: "https://portfolio.test",
    });
    expect(robots.rules).toEqual({ userAgent: "*", disallow: "/" });
    expect(robots.sitemap).toBeUndefined();
  });
});

describe("site URL", () => {
  it("prefers NEXT_PUBLIC_SITE_URL and strips a trailing slash", async () => {
    const { siteConfig } = await load({
      NEXT_PUBLIC_SITE_URL: "https://portfolio.test/",
      VERCEL_PROJECT_PRODUCTION_URL: "portfolio.vercel.app",
    });
    expect(siteConfig.url).toBe("https://portfolio.test");
  });

  it("falls back to Vercel's production domain", async () => {
    const { siteConfig } = await load({
      NEXT_PUBLIC_SITE_URL: "",
      VERCEL_PROJECT_PRODUCTION_URL: "portfolio.vercel.app",
    });
    expect(siteConfig.url).toBe("https://portfolio.vercel.app");
  });
});
