import { z } from "zod";

/*
 * Contact form validation, shared by the client form and the API route so the
 * rules can never drift apart. This module is safe to import in the browser:
 * it contains no secrets and no server code.
 */

export const CONTACT_LIMITS = {
  name: { min: 2, max: 100 },
  email: { max: 254 },
  subject: { min: 3, max: 150 },
  message: { min: 20, max: 5000 },
} as const;

/** Rejects line breaks in single-line fields (also blocks header-injection attempts). */
const singleLine = /^[^\r\n]*$/;

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(CONTACT_LIMITS.name.min, "Enter your name.")
    .max(CONTACT_LIMITS.name.max, `Use ${CONTACT_LIMITS.name.max} characters or fewer.`)
    .regex(singleLine, "Use a single line."),
  email: z
    .string()
    .trim()
    .min(1, "Enter your email address.")
    .max(CONTACT_LIMITS.email.max, "This email address is too long.")
    .pipe(z.email("Enter an email address in the format name@example.com.")),
  subject: z
    .string()
    .trim()
    .min(CONTACT_LIMITS.subject.min, "Enter a subject.")
    .max(CONTACT_LIMITS.subject.max, `Use ${CONTACT_LIMITS.subject.max} characters or fewer.`)
    .regex(singleLine, "Use a single line."),
  message: z
    .string()
    .trim()
    .min(
      CONTACT_LIMITS.message.min,
      `Write at least ${CONTACT_LIMITS.message.min} characters so I have some context.`,
    )
    .max(CONTACT_LIMITS.message.max, `Use ${CONTACT_LIMITS.message.max} characters or fewer.`),
});

export type ContactFormValues = z.input<typeof contactSchema>;
export type ContactMessage = z.output<typeof contactSchema>;
export type ContactField = keyof ContactFormValues;

/**
 * What the API accepts: the form fields plus two anti-spam signals.
 * - `website`: honeypot. Hidden from people; bots tend to fill it.
 * - `startedAt`: when the form was rendered (ms). Instant submissions are bots.
 */
export const contactRequestSchema = contactSchema.extend({
  website: z.string().max(500).optional(),
  startedAt: z.number().int().nonnegative().optional(),
});

export type ContactRequest = z.input<typeof contactRequestSchema>;

/* -------------------------------------------------------------------------- */
/* API responses                                                              */
/* -------------------------------------------------------------------------- */

export type ContactErrorCode =
  | "validation"
  | "invalid_json"
  | "unsupported_media_type"
  | "payload_too_large"
  | "forbidden_origin"
  | "rate_limited"
  | "not_configured"
  | "send_failed";

export type ContactResponse =
  | { ok: true }
  | {
      ok: false;
      error: ContactErrorCode;
      /** Present for `validation`: messages per field. */
      fieldErrors?: Partial<Record<ContactField, string[]>>;
      /** Present for `rate_limited`: seconds until another attempt is allowed. */
      retryAfter?: number;
    };
