import { z } from "zod";

import { type ContactEnv } from "@/lib/contact/env";
import { type RateLimiter } from "@/lib/contact/rate-limit";
import {
  type ContactErrorCode,
  type ContactField,
  contactRequestSchema,
  type ContactResponse,
} from "@/lib/contact/schema";
import { type SendContactEmail } from "@/lib/email/contact-email";

/*
 * POST /api/contact, written as a factory so every dependency (config, email
 * provider, rate limiters, clock, logger) can be replaced in tests.
 *
 * Order of checks, cheapest first:
 *   1. Rate limit (per IP, then a global cap that protects the email quota)
 *   2. Same-origin check, content type, body size
 *   3. JSON parsing and schema validation
 *   4. Spam signals (honeypot, too-fast submission): accepted silently, not sent
 *   5. Configuration, then send
 *
 * Logs never contain the visitor's name, email, subject or message.
 */

export const MAX_BODY_BYTES = 16 * 1024;
/** Humans take longer than this to fill in four fields. */
export const MIN_FILL_TIME_MS = 3000;

export type ContactLogEvent = {
  event: "contact";
  outcome:
    | "sent"
    | "spam_dropped"
    | "rate_limited"
    | "invalid"
    | "rejected"
    | "not_configured"
    | "send_failed";
  reason?: string;
};

export type ContactHandlerDeps = {
  getEnv: () => ContactEnv | null;
  sendEmail: SendContactEmail;
  ipLimiter: RateLimiter;
  globalLimiter: RateLimiter;
  now?: () => number;
  log?: (entry: ContactLogEvent) => void;
};

const defaultLog = (entry: ContactLogEvent) => console.info(JSON.stringify(entry));

function json(body: ContactResponse, status: number, headers?: HeadersInit) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store", ...headers },
  });
}

function fail(error: ContactErrorCode, status: number, extra?: Partial<ContactResponse>) {
  return json({ ok: false, error, ...extra } as ContactResponse, status);
}

/** Client IP from proxy headers. Shared fallback bucket when unknown. */
export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const first = forwarded?.split(",")[0]?.trim();
  return first || request.headers.get("x-real-ip")?.trim() || "unknown";
}

/** Browsers send Origin on POST; it must match the host the request was made to. */
function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true; // Non-browser clients; still rate limited and validated.
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export function createContactHandler({
  getEnv,
  sendEmail,
  ipLimiter,
  globalLimiter,
  now = Date.now,
  log = defaultLog,
}: ContactHandlerDeps) {
  return async function POST(request: Request): Promise<Response> {
    // 1. Rate limits
    for (const [limiter, key] of [
      [ipLimiter, clientIp(request)],
      [globalLimiter, "global"],
    ] as const) {
      const result = limiter.check(key);
      if (!result.allowed) {
        log({ event: "contact", outcome: "rate_limited" });
        return json(
          { ok: false, error: "rate_limited", retryAfter: result.retryAfterSeconds },
          429,
          {
            "Retry-After": String(result.retryAfterSeconds),
          },
        );
      }
    }

    // 2. Request shape
    if (!isSameOrigin(request)) {
      log({ event: "contact", outcome: "rejected", reason: "origin" });
      return fail("forbidden_origin", 403);
    }
    if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
      log({ event: "contact", outcome: "rejected", reason: "content_type" });
      return fail("unsupported_media_type", 415);
    }
    const declaredLength = Number(request.headers.get("content-length") ?? 0);
    if (declaredLength > MAX_BODY_BYTES) {
      log({ event: "contact", outcome: "rejected", reason: "too_large" });
      return fail("payload_too_large", 413);
    }

    const raw = await request.text();
    if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) {
      log({ event: "contact", outcome: "rejected", reason: "too_large" });
      return fail("payload_too_large", 413);
    }

    // 3. Parse and validate
    let body: unknown;
    try {
      body = JSON.parse(raw);
    } catch {
      log({ event: "contact", outcome: "invalid", reason: "json" });
      return fail("invalid_json", 400);
    }

    const parsed = contactRequestSchema.safeParse(body);
    if (!parsed.success) {
      const { fieldErrors } = z.flattenError(parsed.error);
      log({ event: "contact", outcome: "invalid", reason: "schema" });
      return fail("validation", 400, {
        fieldErrors: fieldErrors as Partial<Record<ContactField, string[]>>,
      });
    }

    const { website, startedAt, ...message } = parsed.data;

    // 4. Spam signals: answer like a success so bots learn nothing.
    if (website && website.trim() !== "") {
      log({ event: "contact", outcome: "spam_dropped", reason: "honeypot" });
      return json({ ok: true }, 200);
    }
    if (startedAt !== undefined && now() - startedAt < MIN_FILL_TIME_MS) {
      log({ event: "contact", outcome: "spam_dropped", reason: "too_fast" });
      return json({ ok: true }, 200);
    }

    // 5. Send
    const env = getEnv();
    if (!env) {
      log({ event: "contact", outcome: "not_configured" });
      return fail("not_configured", 503);
    }

    const result = await sendEmail(env, message);
    if (!result.ok) {
      log({ event: "contact", outcome: "send_failed", reason: result.reason });
      return fail("send_failed", 502);
    }

    log({ event: "contact", outcome: "sent" });
    return json({ ok: true }, 200);
  };
}
