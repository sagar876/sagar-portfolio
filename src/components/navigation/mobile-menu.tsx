"use client";

import { Menu } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { MenuPanel } from "@/components/navigation/menu-panel";
import { IconButton } from "@/components/ui/icon-button";

const MENU_ID = "mobile-menu";
const DESKTOP_QUERY = "(min-width: 64rem)";

/**
 * Full-screen navigation below 1024px (spec §A7).
 *
 * Built on the native modal <dialog>: the browser traps focus, makes the page
 * behind it inert and returns focus to the menu button on close.
 *
 * Deliberately unanimated: it opens and closes instantly. Animated versions
 * flickered on iPhone (WebKit), so keep it this way.
 */
export function MobileMenu() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  const closeDialog = useCallback(() => dialogRef.current?.close(), []);

  const openMenu = () => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
    setOpen(true);
  };

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
        className="-mr-3"
      />

      <dialog
        ref={dialogRef}
        id={MENU_ID}
        aria-label="Menu"
        onClose={() => setOpen(false)}
        className="m-0 h-dvh max-h-none w-full max-w-none flex-col bg-transparent p-0 text-fg backdrop:bg-transparent open:flex"
      >
        {open && <MenuPanel onClose={closeDialog} />}
      </dialog>
    </div>
  );
}
