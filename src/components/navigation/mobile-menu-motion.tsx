"use client";

import { AnimatePresence, domMax, LazyMotion, m, MotionConfig, type Variants } from "motion/react";

import { MenuPanel, type MenuItemProps } from "@/components/navigation/menu-panel";

/*
 * Motion layer for the mobile menu. Imported on demand by MobileMenu, so this
 * code (and Motion itself) never loads on desktop and stays off the critical
 * path on mobile.
 */

// The panel is opaque from its first frame; only the rows animate in. Fading
// the panel itself let the page show through, so its text and header icons
// double-exposed with the menu's for ~200ms, which read as a flicker on phones.
const panelVariants: Variants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1 },
  exit: { opacity: 0, transition: { duration: 0.18, delay: 0.08, ease: [0.2, 0, 0, 1] } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    // A firm, quickly settling spring: lively without overshooting much.
    transition: {
      type: "spring",
      stiffness: 420,
      damping: 34,
      mass: 0.8,
      delay: 0.05 + index * 0.045,
    },
  }),
  exit: { opacity: 0, y: -8, transition: { duration: 0.14, ease: [0.4, 0, 1, 1] } },
};

function MotionMenuItem({ index, className, children }: MenuItemProps) {
  return (
    <m.li
      className={className}
      custom={index}
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {children}
    </m.li>
  );
}

type MobileMenuMotionProps = {
  open: boolean;
  onClose: () => void;
  /** Called after the exit animation, so the dialog closes once it is no longer visible. */
  onExitComplete: () => void;
};

export function MobileMenuMotion({ open, onClose, onExitComplete }: MobileMenuMotionProps) {
  return (
    <LazyMotion features={domMax} strict>
      {/* Reduced motion: no movement, only short opacity fades. */}
      <MotionConfig reducedMotion="user">
        {/* If this layer arrives while the menu is already open, don't replay the entrance. */}
        <AnimatePresence initial={!open} onExitComplete={onExitComplete}>
          {open && (
            <m.div
              key="menu-panel"
              className="flex min-h-full flex-1 flex-col"
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <MenuPanel onClose={onClose} Item={MotionMenuItem} />
            </m.div>
          )}
        </AnimatePresence>
      </MotionConfig>
    </LazyMotion>
  );
}
