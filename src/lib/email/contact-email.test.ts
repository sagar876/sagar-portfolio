import { describe, expect, it } from "vitest";

import { buildContactEmail } from "@/lib/email/contact-email";

describe("buildContactEmail", () => {
  it("escapes visitor input in the HTML version", () => {
    const { html, text, subject } = buildContactEmail({
      name: "<script>alert(1)</script>",
      email: "a@example.com",
      subject: "Hello & welcome",
      message: 'Click <a href="x">here</a>',
    });
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
    expect(html).toContain("&lt;a href=&quot;x&quot;&gt;");
    expect(subject).toBe("Portfolio contact: Hello & welcome");
    expect(text).toContain('Click <a href="x">here</a>'); // plain text stays as typed
  });
});
