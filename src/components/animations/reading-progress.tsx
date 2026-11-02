/**
 * Thin accent bar at the top of long pages that fills as you scroll.
 * Pure CSS (scroll-driven animation): no JavaScript, no scroll listeners.
 * Hidden in browsers without scroll timelines. Decorative, so hidden from
 * assistive tech.
 */
export function ReadingProgress() {
  return (
    <div
      aria-hidden="true"
      data-reading-progress
      className="pointer-events-none fixed inset-x-0 top-0 z-50 reading-progress h-0.5 bg-accent"
    />
  );
}
