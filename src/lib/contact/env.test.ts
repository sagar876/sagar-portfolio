import { describe, expect, it } from "vitest";

import { readContactEnv } from "@/lib/contact/env";

describe("readContactEnv", () => {
  it("returns config when every variable is valid", () => {
    expect(
      readContactEnv({
        RESEND_API_KEY: "re_123",
        CONTACT_TO_EMAIL: "me@example.com",
        CONTACT_FROM_EMAIL: "Portfolio <p@example.com>",
      } as unknown as NodeJS.ProcessEnv),
    ).toEqual({ apiKey: "re_123", to: "me@example.com", from: "Portfolio <p@example.com>" });
  });

  it("returns null when anything is missing or malformed", () => {
    expect(readContactEnv({} as unknown as NodeJS.ProcessEnv)).toBeNull();
    expect(
      readContactEnv({
        RESEND_API_KEY: "not-a-key",
        CONTACT_TO_EMAIL: "me@example.com",
        CONTACT_FROM_EMAIL: "p@example.com",
      } as unknown as NodeJS.ProcessEnv),
    ).toBeNull();
  });
});
