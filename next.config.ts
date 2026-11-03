import type { NextConfig } from "next";

/**
 * Security headers for every response. A Content-Security-Policy is not set
 * here: Next.js inline scripts would need per-request nonces, which forces
 * dynamic rendering of every page. See docs/deployment.md.
 */
const securityHeaders = [
  // HTTPS only for two years, including subdomains. (Not "preload": that is a
  // separate, hard-to-undo commitment to make deliberately.)
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
