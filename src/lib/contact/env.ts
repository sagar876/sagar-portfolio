import { z } from "zod";

/*
 * Server-only configuration for the contact form. Read from environment
 * variables at request time; never prefixed with NEXT_PUBLIC_, so Next.js
 * never inlines them into browser code.
 */

const envSchema = z.object({
  RESEND_API_KEY: z.string().startsWith("re_", "RESEND_API_KEY should start with re_"),
  CONTACT_TO_EMAIL: z.email(),
  /** A sender on a domain verified in Resend, e.g. "Portfolio <contact@your-domain.com>". */
  CONTACT_FROM_EMAIL: z.string().min(3),
});

export type ContactEnv = {
  apiKey: string;
  to: string;
  from: string;
};

/** Returns the configuration, or null when it is missing or invalid (the form then reports "unavailable"). */
export function readContactEnv(source: NodeJS.ProcessEnv = process.env): ContactEnv | null {
  const parsed = envSchema.safeParse(source);
  if (!parsed.success) return null;
  return {
    apiKey: parsed.data.RESEND_API_KEY,
    to: parsed.data.CONTACT_TO_EMAIL,
    from: parsed.data.CONTACT_FROM_EMAIL,
  };
}
