import { expect, type Page, type Route, test } from "@playwright/test";

const VALID = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  subject: "Senior frontend role",
  message: "We are hiring a senior frontend engineer and would like to talk with you.",
};

async function fillValid(page: Page) {
  await page.getByLabel("Name").fill(VALID.name);
  await page.getByLabel("Email").fill(VALID.email);
  await page.getByLabel("Subject").fill(VALID.subject);
  await page.getByLabel("Message").fill(VALID.message);
}

/** The form's own alert (Next.js also renders a route announcer with role="alert"). */
const formAlert = (page: Page) => page.locator("form").getByRole("alert");

const submit = (page: Page) => page.getByRole("button", { name: /Send message|Sending/ });

/** Mocks the API with a fixed response; returns the captured request bodies. */
async function mockApi(page: Page, status: number, body: unknown, delayMs = 0) {
  const requests: unknown[] = [];
  await page.route("**/api/contact", async (route: Route) => {
    requests.push(route.request().postDataJSON());
    if (delayMs) await new Promise((resolve) => setTimeout(resolve, delayMs));
    await route.fulfill({ status, json: body });
  });
  return requests;
}

test.describe("contact form (UI)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/contact");
  });

  test("validates on the client with accessible errors, without calling the API", async ({
    page,
  }) => {
    const requests = await mockApi(page, 200, { ok: true });
    await submit(page).click();

    const name = page.getByLabel("Name");
    await expect(name).toBeFocused();
    for (const label of ["Name", "Email", "Subject", "Message"]) {
      const field = page.getByLabel(label);
      await expect(field).toHaveAttribute("aria-invalid", "true");
      const describedBy = (await field.getAttribute("aria-describedby")) ?? "";
      const errorId = describedBy.split(" ").find((id) => id.endsWith("-error"));
      expect(errorId, label).toBeTruthy();
      await expect(page.locator(`#${errorId}`)).toContainText("Error:");
    }
    expect(requests).toHaveLength(0);

    // Errors clear as fields are corrected.
    await name.fill(VALID.name);
    await name.blur();
    await expect(name).not.toHaveAttribute("aria-invalid", "true");
  });

  test("rejects an invalid email address", async ({ page }) => {
    await fillValid(page);
    await page.getByLabel("Email").fill("not-an-email");
    await submit(page).click();
    await expect(page.getByLabel("Email")).toBeFocused();
    await expect(
      page.getByText("Enter an email address in the format name@example.com."),
    ).toBeVisible();
  });

  test("shows a loading state and ignores repeat submits", async ({ page }) => {
    const requests = await mockApi(page, 200, { ok: true }, 800);
    await fillValid(page);
    await submit(page).click();

    const button = submit(page);
    await expect(button).toHaveText("Sending…");
    await expect(button).toHaveAttribute("aria-disabled", "true");
    await expect(page.locator("form")).toHaveAttribute("aria-busy", "true");
    await button.click({ force: true });
    await page.keyboard.press("Enter");

    await expect(page.getByRole("heading", { name: "Message sent" })).toBeVisible();
    expect(requests).toHaveLength(1);
  });

  test("sends the fields plus spam signals, then shows success with focus", async ({ page }) => {
    const requests = await mockApi(page, 200, { ok: true });
    await fillValid(page);
    await submit(page).click();

    const heading = page.getByRole("heading", { name: "Message sent" });
    await expect(heading).toBeFocused();
    expect(requests[0]).toMatchObject({ ...VALID, website: "" });
    expect(typeof (requests[0] as { startedAt: unknown }).startedAt).toBe("number");

    await page.getByRole("button", { name: "Send another message" }).click();
    await expect(page.getByLabel("Name")).toHaveValue("");
  });

  test("shows a failure message and keeps what was typed", async ({ page }) => {
    await mockApi(page, 502, { ok: false, error: "send_failed" });
    await fillValid(page);
    await submit(page).click();
    await expect(formAlert(page)).toContainText("couldn't be sent right now");
    await expect(page.getByLabel("Message")).toHaveValue(VALID.message);
    await expect(submit(page)).toHaveText("Send message");
  });

  test("explains rate limiting with the wait time", async ({ page }) => {
    await mockApi(page, 429, { ok: false, error: "rate_limited", retryAfter: 290 });
    await fillValid(page);
    await submit(page).click();
    await expect(formAlert(page)).toContainText("try again in 5 minutes");
  });

  test("shows server-side field errors on the right field", async ({ page }) => {
    await mockApi(page, 400, {
      ok: false,
      error: "validation",
      fieldErrors: { subject: ["Use a single line."] },
    });
    await fillValid(page);
    await submit(page).click();
    await expect(page.getByLabel("Subject")).toBeFocused();
    await expect(page.getByLabel("Subject")).toHaveAttribute("aria-invalid", "true");
    await expect(page.getByText("Use a single line.")).toBeVisible();
  });

  test("handles a network failure", async ({ page }) => {
    await page.route("**/api/contact", (route) => route.abort("failed"));
    await fillValid(page);
    await submit(page).click();
    await expect(formAlert(page)).toContainText("connection failed");
  });

  test("keeps the honeypot away from people and assistive tech", async ({ page }) => {
    const honeypot = page.locator("#contact-website");
    await expect(honeypot).toHaveAttribute("tabindex", "-1");
    await expect(page.getByRole("textbox", { name: "Leave this field empty" })).toHaveCount(0);
    const box = await honeypot.boundingBox();
    expect(box === null || box.x + box.width < 0).toBe(true);
  });
});

test.describe("contact API (real route handler)", () => {
  // Each test uses its own client IP so the shared server's rate limiter
  // doesn't couple tests together.
  const headersFor = (ip: string) => ({
    "x-forwarded-for": ip,
    "content-type": "application/json",
  });
  const longAgo = () => Date.now() - 60_000;
  const octet = () => Math.floor(Math.random() * 254) + 1;
  const uniqueIp = () => `10.${octet()}.${octet()}.${octet()}`;

  test("validates on the server", async ({ request }) => {
    const response = await request.post("/api/contact", {
      headers: headersFor(uniqueIp()),
      data: { name: "", email: "nope", subject: "x", message: "short" },
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toBe("validation");
    expect(Object.keys(body.fieldErrors).sort()).toEqual(["email", "message", "name", "subject"]);
  });

  test("reports 'not configured' when no Resend key is set", async ({ request }) => {
    const response = await request.post("/api/contact", {
      headers: headersFor(uniqueIp()),
      data: { ...VALID, website: "", startedAt: longAgo() },
    });
    expect(response.status()).toBe(503);
    expect((await response.json()).error).toBe("not_configured");
  });

  test("accepts honeypot submissions silently", async ({ request }) => {
    const response = await request.post("/api/contact", {
      headers: headersFor(uniqueIp()),
      data: { ...VALID, website: "https://spam.example", startedAt: longAgo() },
    });
    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
  });

  test("rejects cross-origin requests and wrong content types", async ({ request }) => {
    const crossOrigin = await request.post("/api/contact", {
      headers: { ...headersFor(uniqueIp()), origin: "https://evil.example" },
      data: VALID,
    });
    expect(crossOrigin.status()).toBe(403);

    const textBody = await request.post("/api/contact", {
      headers: { "x-forwarded-for": uniqueIp(), "content-type": "text/plain" },
      data: "hello",
    });
    expect(textBody.status()).toBe(415);
  });

  test("only accepts POST", async ({ request }) => {
    expect((await request.get("/api/contact")).status()).toBe(405);
  });

  test("rate limits repeated requests from one client", async ({ request }) => {
    const ip = uniqueIp();
    const statuses: number[] = [];
    for (let i = 0; i < 6; i += 1) {
      const response = await request.post("/api/contact", {
        headers: headersFor(ip),
        data: { ...VALID, website: "", startedAt: longAgo() },
      });
      statuses.push(response.status());
      if (response.status() === 429) {
        expect(Number(response.headers()["retry-after"])).toBeGreaterThan(0);
      }
    }
    expect(statuses.slice(0, 5).every((status) => status !== 429)).toBe(true);
    expect(statuses[5]).toBe(429);
  });

  test("keeps the API key and email SDK out of browser code", async ({ page }) => {
    const html = await page.request.get("/contact").then((r) => r.text());
    const srcs = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map((m) => m[1]!);
    const bodies = await Promise.all(
      srcs.map((src) => page.request.get(src).then((r) => r.text())),
    );
    for (const body of bodies) {
      expect(body).not.toContain("RESEND_API_KEY");
      expect(body).not.toContain("api.resend.com");
      expect(body).not.toMatch(/re_[A-Za-z0-9]{20,}/);
    }
  });
});
