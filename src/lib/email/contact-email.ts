import { Resend } from "resend";

import { type ContactEnv } from "@/lib/contact/env";
import { type ContactMessage } from "@/lib/contact/schema";

/*
 * Email service for contact notifications. The only module that talks to
 * Resend; swap the provider here without touching the route.
 */

export type SendResult = { ok: true; id?: string } | { ok: false; reason: string };

export type SendContactEmail = (env: ContactEnv, message: ContactMessage) => Promise<SendResult>;

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/** Builds the notification. Everything from the visitor is escaped before it goes into HTML. */
export function buildContactEmail(message: ContactMessage) {
  const subject = `Portfolio contact: ${message.subject}`;
  const text = [
    `New message from the portfolio contact form.`,
    ``,
    `Name: ${message.name}`,
    `Email: ${message.email}`,
    `Subject: ${message.subject}`,
    ``,
    message.message,
    ``,
    `Reply to this email to answer ${message.name} directly.`,
  ].join("\n");

  const html = `<!doctype html>
<html lang="en">
  <body style="font-family: -apple-system, Segoe UI, Arial, sans-serif; color: #111214; line-height: 1.6;">
    <p style="color: #55585e; font-size: 14px;">New message from the portfolio contact form.</p>
    <table style="font-size: 14px; border-collapse: collapse;">
      <tr><td style="padding: 2px 16px 2px 0; color: #55585e;">Name</td><td>${escapeHtml(message.name)}</td></tr>
      <tr><td style="padding: 2px 16px 2px 0; color: #55585e;">Email</td><td>${escapeHtml(message.email)}</td></tr>
      <tr><td style="padding: 2px 16px 2px 0; color: #55585e;">Subject</td><td>${escapeHtml(message.subject)}</td></tr>
    </table>
    <hr style="border: 0; border-top: 1px solid #dcdcd5; margin: 16px 0;" />
    <p style="white-space: pre-wrap; font-size: 16px;">${escapeHtml(message.message)}</p>
  </body>
</html>`;

  return { subject, text, html };
}

/** Sends the notification to the configured inbox, with Reply-To set to the visitor. */
export const sendContactEmail: SendContactEmail = async (env, message) => {
  const resend = new Resend(env.apiKey);
  const { subject, text, html } = buildContactEmail(message);

  try {
    const { data, error } = await resend.emails.send({
      from: env.from,
      to: env.to,
      replyTo: message.email,
      subject,
      text,
      html,
    });
    if (error) return { ok: false, reason: error.name };
    return { ok: true, id: data?.id };
  } catch (error) {
    return { ok: false, reason: error instanceof Error ? error.name : "unknown" };
  }
};
