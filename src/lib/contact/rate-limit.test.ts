import { describe, expect, it } from "vitest";

import { createMemoryRateLimiter } from "@/lib/contact/rate-limit";

describe("createMemoryRateLimiter", () => {
  it("allows up to the limit, then reports when to retry", () => {
    let time = 0;
    const limiter = createMemoryRateLimiter({ limit: 2, windowMs: 10_000, now: () => time });
    expect(limiter.check("a")).toEqual({ allowed: true, remaining: 1 });
    expect(limiter.check("a")).toEqual({ allowed: true, remaining: 0 });
    time = 4_000;
    expect(limiter.check("a")).toEqual({ allowed: false, retryAfterSeconds: 6 });
    time = 10_000;
    expect(limiter.check("a").allowed).toBe(true);
  });

  it("keeps the number of tracked keys bounded", () => {
    let time = 0;
    const limiter = createMemoryRateLimiter({
      limit: 1,
      windowMs: 1_000,
      now: () => time,
      maxKeys: 2,
    });
    limiter.check("a");
    limiter.check("b");
    time = 2_000; // a and b expired; adding c prunes them
    expect(limiter.check("c").allowed).toBe(true);
    expect(limiter.check("a").allowed).toBe(true);
  });
});
