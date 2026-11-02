/**
 * Fixed-window rate limiter kept in memory.
 *
 * Good enough for a personal site on a single server. On serverless or
 * multi-instance hosting each instance has its own memory, so limits are per
 * instance; swap `createMemoryRateLimiter` for a shared store (for example
 * Upstash Redis or Vercel KV) behind the same `RateLimiter` interface.
 */

export type RateLimitResult =
  { allowed: true; remaining: number } | { allowed: false; retryAfterSeconds: number };

export type RateLimiter = {
  check: (key: string) => RateLimitResult;
};

type Options = {
  /** Requests allowed per window. */
  limit: number;
  windowMs: number;
  /** Injectable clock for tests. */
  now?: () => number;
  /** Upper bound on tracked keys, so the map can't grow without limit. */
  maxKeys?: number;
};

export function createMemoryRateLimiter({
  limit,
  windowMs,
  now = Date.now,
  maxKeys = 10_000,
}: Options): RateLimiter {
  const windows = new Map<string, { count: number; resetAt: number }>();

  const prune = (time: number) => {
    for (const [key, window] of windows) {
      if (window.resetAt <= time) windows.delete(key);
    }
  };

  return {
    check(key) {
      const time = now();
      let window = windows.get(key);

      if (!window || window.resetAt <= time) {
        if (windows.size >= maxKeys) prune(time);
        window = { count: 0, resetAt: time + windowMs };
        windows.set(key, window);
      }

      if (window.count >= limit) {
        return { allowed: false, retryAfterSeconds: Math.ceil((window.resetAt - time) / 1000) };
      }

      window.count += 1;
      return { allowed: true, remaining: limit - window.count };
    },
  };
}
