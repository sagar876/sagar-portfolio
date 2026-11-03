#!/usr/bin/env node
/**
 * Renders the project illustrations in design/illustrations/*.html to PNG
 * covers in public/images/projects/<slug>/cover.png (2400×1500).
 *
 *   npm run illustrations            # all
 *   npm run illustrations -- airfi   # only files whose name contains "airfi"
 *
 * Uses the locally installed Google Chrome via Playwright.
 */
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { chromium } from "@playwright/test";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

/** Illustration file → project slug that uses it as a cover. */
const targets = {
  "airfi-dashboard.html": "airfi-realtime-platform",
  "happay-invoices.html": "happay-invoice-management",
  "ninestack-cms.html": "ninestack-cms",
};

const filter = process.argv[2];
const browser = await chromium.launch({ channel: "chrome" });
const context = await browser.newContext({
  viewport: { width: 1600, height: 1000 },
  deviceScaleFactor: 1.5,
});

for (const [file, slug] of Object.entries(targets)) {
  if (filter && !file.includes(filter)) continue;
  const page = await context.newPage();
  await page.goto(`file://${path.join(root, "design/illustrations", file)}`);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  const outDir = path.join(root, "public/images/projects", slug);
  mkdirSync(outDir, { recursive: true });
  const out = path.join(outDir, "cover.png");
  await page.screenshot({ path: out });
  await page.close();
  console.log(`✓ ${file} → ${path.relative(root, out)}`);
}

await browser.close();
