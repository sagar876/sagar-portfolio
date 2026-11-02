import { beforeEach, describe, expect, it, vi } from "vitest";

import { type ContactEnv } from "@/lib/contact/env";
import {
  type ContactLogEvent,
  createContactHandler,
  MIN_FILL_TIME_MS,
} from "@/lib/contact/handler";
import { createMemoryRateLimiter } from "@/lib/contact/rate-limit";
import { type SendContactEmail } from "@/lib/email/contact-email";

const ENV: ContactEnv = {
  apiKey: "re_test",
  to: "owner@example.com",
  from: "Portfolio <p@example.com>",
};
const NOW = 1_700_000_000_000;

const valid = {
  name: "  Ada Lovelace  ",
  email: "ada@example.com",
  subject: "Senior frontend role",
  message: "Hello — we are hiring a senior frontend engineer and would like to talk.",
  website: "",
  startedAt: NOW - 30_000,
};

function setup(overrides: Partial<Parameters<typeof createContactHandler>[0]> = {}) {
  const sendEmail = vi.fn<SendContactEmail>(async () => ({ ok: true, id: "email_1" }));
  const logs: ContactLogEvent[] = [];
  const clock = { time: NOW };
  const handler = createContactHandler({
    getEnv: () => ENV,
    sendEmail,
    ipLimiter: createMemoryRateLimiter({ limit: 5, windowMs: 600_000, now: () => clock.time }),
    globalLimiter: createMemoryRateLimiter({
      limit: 30,
      windowMs: 3_600_000,
      now: () => clock.time,
    }),
    now: () => clock.time,
    log: (entry) => logs.push(entry),
    ...overrides,
  });
  return { handler, sendEmail, logs, clock };
}

function post(
  body: unknown,
  { ip = "203.0.113.7", headers = {} }: { ip?: string; headers?: Record<string, string> } = {},
) {
  return new Request("http://localhost:3000/api/contact", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      host: "localhost:3000",
      origin: "http://localhost:3000",
      "x-forwarded-for": `${ip}, 10.0.0.1`,
      ...headers,
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

describe("POST /api/contact", () => {
  let ctx: ReturnType<typeof setup>;
  beforeEach(() => {
    ctx = setup();
  });

  it("sends a valid message and returns ok", async () => {
    const response = await ctx.handler(post(valid));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(response.headers.get("cache-control")).toBe("no-store");

    expect(ctx.sendEmail).toHaveBeenCalledTimes(1);
    const [env, message] = ctx.sendEmail.mock.calls[0]!;
    expect(env).toBe(ENV);
    // Trimmed, and spam-signal fields are not passed to the email service.
    expect(message).toEqual({
      name: "Ada Lovelace",
      email: "ada@example.com",
      subject: "Senior frontend role",
      message: valid.message,
    });
    expect(ctx.logs).toEqual([{ event: "contact", outcome: "sent" }]);
  });

  it("returns field errors for invalid input and sends nothing", async () => {
    const response = await ctx.handler(
      post({ name: "A", email: "not-an-email", subject: "", message: "too short" }),
    );
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe("validation");
    expect(Object.keys(body.fieldErrors).sort()).toEqual(["email", "message", "name", "subject"]);
    expect(ctx.sendEmail).not.toHaveBeenCalled();
  });

  it("rejects line breaks in single-line fields", async () => {
    const response = await ctx.handler(
      post({ ...valid, subject: "Hi\r\nBcc: victim@example.com" }),
    );
    expect(response.status).toBe(400);
    expect((await response.json()).fieldErrors.subject).toBeDefined();
  });

  it("rejects malformed JSON", async () => {
    const response = await ctx.handler(post("{not json"));
    expect(response.status).toBe(400);
    expect((await response.json()).error).toBe("invalid_json");
  });

  it("rejects non-JSON content types", async () => {
    const response = await ctx.handler(post(valid, { headers: { "content-type": "text/plain" } }));
    expect(response.status).toBe(415);
  });

  it("rejects oversized bodies", async () => {
    const response = await ctx.handler(post({ ...valid, message: "x".repeat(20_000) }));
    expect(response.status).toBe(413);
    expect(ctx.sendEmail).not.toHaveBeenCalled();
  });

  it("rejects cross-origin browser requests", async () => {
    const response = await ctx.handler(
      post(valid, { headers: { origin: "https://evil.example" } }),
    );
    expect(response.status).toBe(403);
    expect(ctx.sendEmail).not.toHaveBeenCalled();
  });

  it("silently drops honeypot submissions", async () => {
    const response = await ctx.handler(post({ ...valid, website: "https://spam.example" }));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(ctx.sendEmail).not.toHaveBeenCalled();
    expect(ctx.logs[0]).toMatchObject({ outcome: "spam_dropped", reason: "honeypot" });
  });

  it("silently drops submissions made faster than a person could type", async () => {
    const response = await ctx.handler(post({ ...valid, startedAt: NOW - (MIN_FILL_TIME_MS - 1) }));
    expect(response.status).toBe(200);
    expect(ctx.sendEmail).not.toHaveBeenCalled();
    expect(ctx.logs[0]).toMatchObject({ outcome: "spam_dropped", reason: "too_fast" });
  });

  it("returns 503 when email is not configured", async () => {
    const { handler, sendEmail } = setup({ getEnv: () => null });
    const response = await handler(post(valid));
    expect(response.status).toBe(503);
    expect((await response.json()).error).toBe("not_configured");
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("returns 502 when the email provider fails", async () => {
    const { handler, logs } = setup({
      sendEmail: async () => ({ ok: false, reason: "validation_error" }),
    });
    const response = await handler(post(valid));
    expect(response.status).toBe(502);
    expect((await response.json()).error).toBe("send_failed");
    expect(logs[0]).toEqual({
      event: "contact",
      outcome: "send_failed",
      reason: "validation_error",
    });
  });

  it("rate limits each IP to 5 requests per window", async () => {
    for (let i = 0; i < 5; i += 1) {
      expect((await ctx.handler(post(valid))).status).toBe(200);
    }
    const limited = await ctx.handler(post(valid));
    expect(limited.status).toBe(429);
    expect(limited.headers.get("retry-after")).toBe("600");
    expect((await limited.json()).retryAfter).toBe(600);

    // Another visitor is unaffected; the window resets after 10 minutes.
    expect((await ctx.handler(post(valid, { ip: "198.51.100.9" }))).status).toBe(200);
    ctx.clock.time += 600_000;
    expect((await ctx.handler(post(valid))).status).toBe(200);
  });

  it("counts invalid requests towards the limit", async () => {
    for (let i = 0; i < 5; i += 1) await ctx.handler(post("{bad"));
    expect((await ctx.handler(post(valid))).status).toBe(429);
  });

  it("applies a global cap across all visitors", async () => {
    const { handler } = setup({
      globalLimiter: createMemoryRateLimiter({ limit: 2, windowMs: 3_600_000, now: () => NOW }),
    });
    expect((await handler(post(valid, { ip: "192.0.2.1" }))).status).toBe(200);
    expect((await handler(post(valid, { ip: "192.0.2.2" }))).status).toBe(200);
    expect((await handler(post(valid, { ip: "192.0.2.3" }))).status).toBe(429);
  });

  it("never logs the visitor's personal data or message", async () => {
    await ctx.handler(post(valid));
    await ctx.handler(post({ ...valid, email: "bad" }));
    await ctx.handler(post({ ...valid, website: "spam" }));
    const serialized = JSON.stringify(ctx.logs);
    for (const value of [
      "Ada",
      "ada@example.com",
      "Senior frontend role",
      "hiring",
      "203.0.113.7",
    ]) {
      expect(serialized).not.toContain(value);
    }
  });
});
