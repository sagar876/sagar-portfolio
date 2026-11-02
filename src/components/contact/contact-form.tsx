"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlert, CircleCheck, LoaderCircle } from "lucide-react";
import { type BaseSyntheticEvent, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import { controlStyles, describedBy, FormField } from "@/components/contact/form-field";
import { Button } from "@/components/ui/button";
import { Heading, Text } from "@/components/ui/typography";
import { cn } from "@/lib/cn";
import {
  CONTACT_LIMITS,
  type ContactErrorCode,
  type ContactField,
  type ContactFormValues,
  type ContactResponse,
  contactSchema,
} from "@/lib/contact/schema";

const REQUEST_TIMEOUT_MS = 15_000;
const FIELD_ORDER: ContactField[] = ["name", "email", "subject", "message"];

type Status =
  | { state: "idle" }
  | { state: "success" }
  | { state: "error"; code: ContactErrorCode | "network"; retryAfter?: number };

function errorMessage(code: ContactErrorCode | "network", retryAfter?: number): string {
  switch (code) {
    case "rate_limited": {
      const minutes = Math.max(1, Math.ceil((retryAfter ?? 600) / 60));
      return `You've sent several messages in a short time. Please try again in ${minutes} ${minutes === 1 ? "minute" : "minutes"}.`;
    }
    case "validation":
      return "Some fields need attention. Check the messages next to each field.";
    case "network":
      return "Your message couldn't be sent because the connection failed. Check your connection and try again.";
    case "not_configured":
    case "send_failed":
      return "Your message couldn't be sent right now. Please try again later.";
    default:
      return "Your message couldn't be sent. Please refresh the page and try again.";
  }
}

type ContactFormProps = {
  /** Another way to get in touch, shown when sending fails (e.g. LinkedIn). */
  fallback?: { label: string; href: string };
};

/**
 * Contact form: React Hook Form with the shared Zod schema on the client,
 * the same schema again on the server.
 *
 * Accessibility: every error is linked to its field (aria-describedby,
 * aria-invalid); on a failed submit focus moves to the first invalid field;
 * submission status is announced in a live region; success moves focus to
 * the confirmation heading.
 */
export function ContactForm({ fallback }: ContactFormProps) {
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const startedAt = useRef<number | undefined>(undefined);
  const successHeading = useRef<HTMLHeadingElement>(null);
  const inFlight = useRef(false);

  const {
    register,
    handleSubmit,
    setError,
    setFocus,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    mode: "onTouched",
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  // Record when the form became usable; the server drops instant submissions.
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  useEffect(() => {
    if (status.state === "success") successHeading.current?.focus();
  }, [status.state]);

  const submit = async (values: ContactFormValues, event?: BaseSyntheticEvent) => {
    if (inFlight.current) return; // Ignore repeat submits (e.g. Enter while sending).
    inFlight.current = true;
    const form = event?.target as HTMLFormElement | undefined;
    const website = (form?.elements.namedItem("website") as HTMLInputElement | null)?.value ?? "";
    setStatus({ state: "idle" });

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, website, startedAt: startedAt.current }),
        signal: controller.signal,
      });
      const result = (await response.json().catch(() => null)) as ContactResponse | null;

      if (result?.ok) {
        reset();
        setStatus({ state: "success" });
        return;
      }

      if (result && !result.ok && result.error === "validation" && result.fieldErrors) {
        const invalid = FIELD_ORDER.filter((field) => result.fieldErrors?.[field]?.length);
        for (const field of invalid) {
          setError(field, { type: "server", message: result.fieldErrors[field]?.[0] });
        }
        if (invalid[0]) setFocus(invalid[0]);
      }

      setStatus({
        state: "error",
        code: result && !result.ok ? result.error : "send_failed",
        retryAfter: result && !result.ok ? result.retryAfter : undefined,
      });
    } catch {
      setStatus({ state: "error", code: "network" });
    } finally {
      window.clearTimeout(timeout);
      inFlight.current = false;
    }
  };

  if (status.state === "success") {
    return (
      <div className="flex flex-col items-start gap-6 border-t border-fg pt-8">
        <CircleCheck aria-hidden="true" className="size-6 text-fg" strokeWidth={1.75} />
        <div className="flex flex-col gap-3">
          <Heading level={2} size="h2" ref={successHeading} tabIndex={-1} className="outline-none">
            Message sent
          </Heading>
          <Text tone="secondary" measure>
            Thanks for getting in touch. I&apos;ll reply to the email address you gave.
          </Text>
        </div>
        <Button variant="secondary" onClick={() => setStatus({ state: "idle" })}>
          Send another message
        </Button>
      </div>
    );
  }

  const messageHintId = "contact-message";

  return (
    <form
      noValidate
      onSubmit={(event) => void handleSubmit(submit)(event)}
      aria-busy={isSubmitting}
      aria-describedby="contact-form-note"
      className="relative flex flex-col gap-8"
    >
      <p id="contact-form-note" className="text-small text-fg-secondary">
        All fields are required.
      </p>

      <div className="grid gap-x-gutter gap-y-8 tablet:grid-cols-2">
        <FormField id="contact-name" label="Name" error={errors.name?.message}>
          <input
            id="contact-name"
            type="text"
            autoComplete="name"
            className={cn(controlStyles, "h-12")}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={describedBy("contact-name", { error: !!errors.name })}
            {...register("name")}
          />
        </FormField>

        <FormField id="contact-email" label="Email" error={errors.email?.message}>
          <input
            id="contact-email"
            type="email"
            autoComplete="email"
            inputMode="email"
            spellCheck={false}
            className={cn(controlStyles, "h-12")}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={describedBy("contact-email", { error: !!errors.email })}
            {...register("email")}
          />
        </FormField>

        <FormField
          id="contact-subject"
          label="Subject"
          error={errors.subject?.message}
          className="tablet:col-span-2"
        >
          <input
            id="contact-subject"
            type="text"
            className={cn(controlStyles, "h-12")}
            aria-invalid={errors.subject ? true : undefined}
            aria-describedby={describedBy("contact-subject", { error: !!errors.subject })}
            {...register("subject")}
          />
        </FormField>

        <FormField
          id={messageHintId}
          label="Message"
          hint={`Between ${CONTACT_LIMITS.message.min} and ${CONTACT_LIMITS.message.max.toLocaleString("en")} characters.`}
          error={errors.message?.message}
          className="tablet:col-span-2"
        >
          <textarea
            id={messageHintId}
            rows={8}
            className={cn(controlStyles, "min-h-48 resize-y py-3 leading-relaxed")}
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={describedBy(messageHintId, { hint: true, error: !!errors.message })}
            {...register("message")}
          />
        </FormField>
      </div>

      {/* Honeypot: off-screen and hidden from assistive tech. People never see it; bots fill it. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="contact-website">Leave this field empty</label>
        <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="empty:hidden">
        {status.state === "error" && (
          <div
            role="alert"
            className="flex items-start gap-3 border-y border-accent py-4 text-small text-fg"
          >
            <CircleAlert
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0 text-accent"
              strokeWidth={1.75}
            />
            <p>
              {errorMessage(status.code, status.retryAfter)}
              {fallback && status.code !== "validation" && status.code !== "rate_limited" && (
                <>
                  {" "}
                  You can also reach me on{" "}
                  <a
                    href={fallback.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-1 underline-offset-4 hover:decoration-accent"
                  >
                    {fallback.label}
                  </a>
                  .
                </>
              )}
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <Button
          type="submit"
          aria-disabled={isSubmitting || undefined}
          onClick={(event) => {
            if (isSubmitting) event.preventDefault();
          }}
          className="min-w-44 justify-center"
        >
          {isSubmitting ? (
            <>
              <LoaderCircle
                aria-hidden="true"
                className="size-4 motion-safe:animate-spin"
                strokeWidth={1.75}
              />
              Sending…
            </>
          ) : (
            "Send message"
          )}
        </Button>
        <span aria-live="polite" className="sr-only">
          {isSubmitting ? "Sending your message" : ""}
        </span>
      </div>
    </form>
  );
}
