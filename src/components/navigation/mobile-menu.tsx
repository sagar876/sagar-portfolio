"use client";

import { Menu } from "lucide-react";
import {
  type ComponentType,
  type SyntheticEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { MenuPanel } from "@/components/navigation/menu-panel";
import { IconButton } from "@/components/ui/icon-button";

const MENU_ID = "mobile-menu";
const DESKTOP_QUERY = "(min-width: 64rem)";

type MotionLayer = ComponentType<{
  open: boolean;
  onClose: () => void;
  onExitComplete: () => void;
}>;

/**
 * Full-screen navigation below 1024px (spec §A7).
 *
 * Built on the native modal <dialog>: the browser traps focus, makes the page
 * behind it inert and returns focus to the menu button on close.
 *
 * Animation is progressive: the Motion layer (spring entrance, exit before
 * close) is fetched in idle time on small screens, or as soon as the button is
 * touched or focused. Until it arrives the menu opens instantly with a CSS
 * entrance, so it never waits on the network.
 */
export function MobileMenu() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [MotionLayer, setMotionLayer] = useState<MotionLayer | null>(null);
  const loading = useRef(false);

  const loadMotion = useCallback(() => {
    if (loading.current) return;
    loading.current = true;
    import("@/components/navigation/mobile-menu-motion")
      .then((mod) => setMotionLayer(() => mod.MobileMenuMotion))
      .catch(() => {
        loading.current = false; // Retry on the next interaction; the static menu still works.
      });
  }, []);

  const closeDialog = useCallback(() => dialogRef.current?.close(), []);

  const openMenu = () => {
    loadMotion();
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
    setOpen(true);
  };

  // With the Motion layer, hide first and close the dialog after the exit
  // animation; without it, close immediately.
  const requestClose = useCallback(() => {
    setOpen(false);
    if (!MotionLayer) closeDialog();
  }, [MotionLayer, closeDialog]);

  // Escape: run the same animated close instead of the browser's instant one.
  const onCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault();
    requestClose();
  };

  // Prefetch the Motion layer in idle time on small screens only.
  useEffect(() => {
    if (window.matchMedia(DESKTOP_QUERY).matches) return;
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1500));
    const cancel = window.cancelIdleCallback ?? window.clearTimeout;
    const handle = idle(loadMotion);
    return () => cancel(handle);
  }, [loadMotion]);

  // Close if the viewport grows to desktop while the menu is open.
  useEffect(() => {
    const query = window.matchMedia(DESKTOP_QUERY);
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) closeDialog();
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, [closeDialog]);

  return (
    <div className="desktop:hidden">
      <IconButton
        icon={Menu}
        label="Open menu"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={MENU_ID}
        onClick={openMenu}
        onPointerDown={loadMotion}
        onFocus={loadMotion}
        className="-mr-3"
      />

      <dialog
        ref={dialogRef}
        id={MENU_ID}
        aria-label="Menu"
        onCancel={onCancel}
        onClose={() => setOpen(false)}
        className="m-0 h-dvh max-h-none w-full max-w-none flex-col bg-transparent p-0 text-fg backdrop:bg-transparent open:flex"
      >
        {MotionLayer ? (
          <MotionLayer open={open} onClose={requestClose} onExitComplete={closeDialog} />
        ) : (
          open && <MenuPanel onClose={requestClose} />
        )}
      </dialog>
    </div>
  );
}
