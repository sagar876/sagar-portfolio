import { Download, X } from "lucide-react";
import { type ComponentType, type CSSProperties, type ReactNode } from "react";

import { Container } from "@/components/layout/container";
import { NavLink } from "@/components/navigation/nav-link";
import { Wordmark } from "@/components/navigation/wordmark";
import { IconButton } from "@/components/ui/icon-button";
import { TextLink } from "@/components/ui/text-link";
import { Label } from "@/components/ui/typography";
import { mainNav, resumeLink } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { STAGGER_MS } from "@/lib/motion";

export type MenuItemProps = { index: number; className: string; children: ReactNode };

/** Default list item: CSS rise-in, used until (or instead of) the Motion layer. */
export function StaticMenuItem({ index, className, children }: MenuItemProps) {
  const style: CSSProperties = { animationDelay: `${index * STAGGER_MS}ms` };
  return (
    <li className={`${className} motion-safe:animate-rise`} style={style}>
      {children}
    </li>
  );
}

type MenuPanelProps = {
  onClose: () => void;
  /** Wrapper for each animated row; lets the Motion layer swap in m.li. */
  Item?: ComponentType<MenuItemProps>;
};

/** Menu contents shared by the static and animated versions. Contains no animation library code. */
export function MenuPanel({ onClose, Item = StaticMenuItem }: MenuPanelProps) {
  const { email } = siteConfig.contact;

  return (
    <div className="flex min-h-full flex-1 flex-col bg-background">
      <Container className="flex min-h-16 shrink-0 items-center justify-between border-b border-border py-2">
        <Wordmark onClick={onClose} />
        <IconButton icon={X} label="Close menu" onClick={onClose} className="-mr-3" />
      </Container>

      <nav aria-label="Main" className="flex flex-1 flex-col overflow-y-auto">
        <Container className="flex flex-1 flex-col justify-between gap-12 py-8">
          <ul className="flex flex-col">
            {mainNav.map((item, index) => (
              <Item key={item.href} index={index} className="border-b border-border">
                <NavLink
                  href={item.href}
                  onClick={onClose}
                  className="flex min-h-16 items-center text-h1 active:text-fg-secondary"
                >
                  {item.label}
                </NavLink>
              </Item>
            ))}
          </ul>

          <ul className="flex flex-col gap-4">
            <Item index={mainNav.length} className="">
              <a
                href={resumeLink.href}
                download
                className="inline-flex min-h-11 items-center gap-2 text-body-lg font-medium underline decoration-1 underline-offset-4"
              >
                Download resume
                <Download aria-hidden="true" className="size-4" strokeWidth={1.75} />
                <span className="sr-only"> (PDF)</span>
              </a>
            </Item>
            {email && (
              <Item index={mainNav.length + 1} className="flex flex-col gap-1">
                <Label as="p">Email</Label>
                <TextLink href={`mailto:${email}`} className="text-body-lg select-all">
                  {email}
                </TextLink>
              </Item>
            )}
          </ul>
        </Container>
      </nav>
    </div>
  );
}
