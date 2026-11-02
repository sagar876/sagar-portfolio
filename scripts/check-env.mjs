#!/usr/bin/env node
/**
 * Pre-build environment check. Runs before `next build`.
 *
 * - Production deployments (VERCEL_ENV=production): missing or placeholder
 *   values FAIL the build, so a broken contact form or wrong canonical domain
 *   can never go live.
 * - Previews and local builds: problems are printed as warnings only.
 *
 * Prints variable NAMES only, never values.
 */

const isProduction = process.env.VERCEL_ENV === "production";
const problems = [];

const placeholder = (value) =>
  /example\.(com|org|net)|your-domain|your_api_key|re_your/i.test(value);

function check(name, test, description) {
  const value = process.env[name];
  if (!value) problems.push(`${name} is not set (${description}).`);
  else if (placeholder(value)) problems.push(`${name} still has a placeholder value.`);
  else if (test && !test(value)) problems.push(`${name} is invalid (${description}).`);
}

check(
  "NEXT_PUBLIC_SITE_URL",
  (v) => /^https:\/\/[^/]+$/.test(v.replace(/\/+$/, "")),
  "https origin of the custom domain, e.g. https://domain.tld",
);
check("RESEND_API_KEY", (v) => v.startsWith("re_"), "Resend API key starting with re_");
check(
  "CONTACT_TO_EMAIL",
  (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
  "inbox that receives contact messages",
);
check("CONTACT_FROM_EMAIL", (v) => /@/.test(v), "sender on a domain verified in Resend");

if (problems.length === 0) {
  console.log("✓ Environment variables look complete.");
} else if (isProduction) {
  console.error("✗ Production build stopped. Fix these environment variables in Vercel:");
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
} else {
  console.warn(
    "! Environment variables to set before production (warning only outside production):",
  );
  for (const problem of problems) console.warn(`  - ${problem}`);
}
