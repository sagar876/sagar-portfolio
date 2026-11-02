"use client";

import { useEffect, useState } from "react";

type ScrollState = {
  /** True after scrolling down past `offset`; false again on any upward scroll. */
  hidden: boolean;
  /** True once the page has scrolled at all. */
  scrolled: boolean;
};

/**
 * Tracks scroll direction for a hide-on-scroll header. Updates at most once
 * per animation frame and ignores movements smaller than `threshold` pixels.
 */
export function useHideOnScroll({ threshold = 8, offset = 64 } = {}): ScrollState {
  const [state, setState] = useState<ScrollState>({ hidden: false, scrolled: false });

  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const delta = y - lastY;
      const movedEnough = Math.abs(delta) >= threshold;

      setState((prev) => {
        let hidden = prev.hidden;
        if (y <= offset) hidden = false;
        else if (movedEnough) hidden = delta > 0;

        const scrolled = y > 0;
        return hidden === prev.hidden && scrolled === prev.scrolled ? prev : { hidden, scrolled };
      });

      if (movedEnough || y <= offset) lastY = y;
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [threshold, offset]);

  return state;
}
