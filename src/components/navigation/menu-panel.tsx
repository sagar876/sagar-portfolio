import { Download, X } from "lucide-react";

import { Container } from "@/components/layout/container";
import { NavLink } from "@/components/navigation/nav-link";
import { Wordmark } from "@/components/navigation/wordmark";
import { IconButton } from "@/components/ui/icon-button";
import { TextLink } from "@/components/ui/text-link";
import { Label } from "@/components/ui/typography";
import { mainNav, resumeLink } from "@/config/navigation";
import { siteConfig } from "@/config/site";

type MenuPanelProps = {
  onClose: () => void;
};

/** Menu contents. No animation: the menu appears and disappears instantly. */
export function MenuPanel({ onClose }: MenuPanelProps) {
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
            {mainNav.map((item) => (
              <li key={item.href} className="border-b border-border">
                <NavLink
                  href={item.href}
                  onClick={onClose}
                  className="flex min-h-16 items-center text-h1 active:text-fg-secondary"
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <ul className="flex flex-col gap-4">
            <li>
              <a
                href={resumeLink.href}
                download
                className="inline-flex min-h-11 items-center gap-2 text-body-lg font-medium underline decoration-1 underline-offset-4"
              >
                Download resume
                <Download aria-hidden="true" className="size-4" strokeWidth={1.75} />
                <span className="sr-only"> (PDF)</span>
              </a>
            </li>
            {email && (
              <li className="flex flex-col gap-1">
                <Label as="p">Email</Label>
                <TextLink href={`mailto:${email}`} className="text-body-lg select-all">
                  {email}
                </TextLink>
              </li>
            )}
          </ul>
        </Container>
      </nav>
    </div>
  );
}
