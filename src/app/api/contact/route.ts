import { readContactEnv } from "@/lib/contact/env";
import { createContactHandler } from "@/lib/contact/handler";
import { createMemoryRateLimiter } from "@/lib/contact/rate-limit";
import { sendContactEmail } from "@/lib/email/contact-email";

/** Positive integer from an environment variable, or the fallback. */
function limitFromEnv(name: string, fallback: number): number {
  const value = Number(process.env[name]);
  return Number.isInteger(value) && value > 0 ? value : fallback;
}

/**
 * Contact form endpoint. See src/lib/contact/handler.ts for the full flow.
 *
 * Default limits: 5 messages per IP per 10 minutes, and 30 per hour across all
 * visitors to protect the email quota. Both can be tuned with environment
 * variables (see .env.example). Only POST is exported, so other methods get 405.
 */
export const POST = createContactHandler({
  getEnv: () => readContactEnv(),
  sendEmail: sendContactEmail,
  ipLimiter: createMemoryRateLimiter({
    limit: limitFromEnv("CONTACT_RATE_LIMIT_PER_IP", 5),
    windowMs: 10 * 60 * 1000,
  }),
  globalLimiter: createMemoryRateLimiter({
    limit: limitFromEnv("CONTACT_RATE_LIMIT_GLOBAL", 30),
    windowMs: 60 * 60 * 1000,
  }),
});
