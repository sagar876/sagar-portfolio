#!/usr/bin/env node
/**
 * Read-only smoke test for a deployed site. Sends GET/HEAD requests only;
 * it never submits the contact form (that would send a real email).
 *
 *   npm run smoke -- https://your-domain.tld
 *   npm run smoke -- https://your-domain.tld --www     # also check www → apex redirect
 *   npm run smoke -- https://<preview>.vercel.app --preview
 *
 * Exits non-zero if any check fails.
 */

const args = process.argv.slice(2);
const target = args.find((arg) => !arg.startsWith("--"));
const checkWww = args.includes("--www");
const isPreview = args.includes("--preview");

if (!target) {
  console.error("Usage: npm run smoke -- <https://origin> [--www] [--preview]");
  process.exit(2);
}

const origin = new URL(target).origin;
const isLocal = /^http:\/\/(localhost|127\.0\.0\.1)/.test(origin);
const results = [];

async function check(name, fn) {
  try {
    const detail = await fn();
    results.push({ ok: true, name, detail });
  } catch (error) {
    results.push({
      ok: false,
      name,
      detail: error instanceof Error ? error.message : String(error),
    });
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const get = (path, init) => fetch(new URL(path, origin), { redirect: "manual", ...init });

await check("Home page responds 200", async () => {
  const response = await get("/");
  assert(response.status === 200, `status ${response.status}`);
  return response.headers.get("content-type");
});

for (const path of ["/work", "/about", "/experience", "/writing", "/contact"]) {
  await check(`${path} responds 200`, async () => {
    const response = await get(path);
    assert(response.status === 200, `status ${response.status}`);
  });
}

await check("Unknown pages return 404", async () => {
  const response = await get(`/this-page-does-not-exist-${Date.now()}`);
  assert(response.status === 404, `status ${response.status}`);
});

await check("Contact API rejects GET with 405 (form not submitted)", async () => {
  const response = await get("/api/contact");
  assert(response.status === 405, `status ${response.status}`);
});

await check("Security headers present", async () => {
  const headers = (await get("/")).headers;
  for (const name of [
    "strict-transport-security",
    "x-content-type-options",
    "referrer-policy",
    "x-frame-options",
    "permissions-policy",
  ]) {
    assert(headers.get(name), `missing ${name}`);
  }
  assert(!headers.get("x-powered-by"), "x-powered-by is exposed");
});

await check("Canonical URL uses this origin", async () => {
  const html = await (await get("/")).text();
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  assert(canonical, "no canonical link");
  if (!isPreview) assert(new URL(canonical).origin === origin, `canonical is ${canonical}`);
  return canonical;
});

await check(
  isPreview
    ? "robots.txt blocks crawling (preview)"
    : "robots.txt allows crawling and links the sitemap",
  async () => {
    const response = await get("/robots.txt");
    assert(response.status === 200, `status ${response.status}`);
    const body = await response.text();
    if (isPreview) {
      assert(/Disallow: \/\s*$/m.test(body), "preview robots.txt does not disallow everything");
    } else {
      assert(
        body.includes(`Sitemap: ${origin}/sitemap.xml`),
        "Sitemap line missing or on another origin",
      );
      assert(!/^Disallow: \/\s*$/m.test(body), "robots.txt blocks the whole site");
    }
  },
);

if (!isPreview) {
  await check("sitemap.xml lists pages on this origin", async () => {
    const response = await get("/sitemap.xml");
    assert(response.status === 200, `status ${response.status}`);
    const locs = [...(await response.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    assert(locs.length > 0, "no <loc> entries");
    const foreign = locs.filter((loc) => !loc.startsWith(origin));
    assert(foreign.length === 0, `entries on another origin: ${foreign.slice(0, 2).join(", ")}`);
    return `${locs.length} URLs`;
  });
}

if (!isLocal && origin.startsWith("https://")) {
  await check("HTTP redirects to HTTPS", async () => {
    const response = await fetch(origin.replace("https://", "http://"), { redirect: "manual" });
    assert([301, 307, 308].includes(response.status), `status ${response.status}`);
    const location = response.headers.get("location") ?? "";
    assert(location.startsWith("https://"), `redirects to ${location}`);
    return `${response.status} → ${location}`;
  });
}

if (checkWww) {
  await check("www redirects to the canonical domain", async () => {
    const url = new URL(origin);
    const www = `${url.protocol}//www.${url.host}`;
    const response = await fetch(www, { redirect: "manual" });
    assert([301, 307, 308].includes(response.status), `status ${response.status}`);
    const location = response.headers.get("location") ?? "";
    assert(new URL(location).origin === origin, `redirects to ${location}`);
    return `${response.status} → ${location}`;
  });
}

let failed = 0;
for (const { ok, name, detail } of results) {
  if (!ok) failed += 1;
  console.log(`${ok ? "✓" : "✗"} ${name}${detail ? `  (${detail})` : ""}`);
}
console.log(`\n${results.length - failed}/${results.length} checks passed for ${origin}`);
process.exit(failed ? 1 : 0);
