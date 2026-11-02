import { defineConfig, devices } from "@playwright/test";

const PORT = 3200;

/**
 * End-to-end tests run against the production build (`npm run test:e2e`
 * builds first). They use the locally installed Google Chrome, so no
 * browser download is needed.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    channel: "chrome",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "desktop",
      use: {
        ...devices["Desktop Chrome"],
        channel: "chrome",
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: "mobile",
      use: { ...devices["Pixel 7"], channel: "chrome" },
    },
  ],
  webServer: {
    command: `npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    // No Resend key, so the contact API answers "not configured" instead of
    // sending email. The global cap is raised so repeated test runs against
    // one server don't exhaust it; the per-IP limit keeps its real default.
    env: { CONTACT_RATE_LIMIT_GLOBAL: "100000", RESEND_API_KEY: "" },
  },
});
