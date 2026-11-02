import { Download } from "lucide-react";

import { NavLink } from "@/components/navigation/nav-link";
import { mainNav, resumeLink } from "@/config/navigation";

const itemStyles =
  "inline-flex min-h-11 items-center gap-2 text-fg transition-colors duration-micro ease-standard active:text-fg-secondary";

/** Desktop navigation (≥1024px). Below that, MobileMenu takes over. */
export function MainNav() {
  return (
    <nav aria-label="Main" className="hidden desktop:block">
      <ul className="flex items-center gap-x-6 text-small font-medium">
        {mainNav.map((item) => (
          <li key={item.href}>
            <NavLink href={item.href} className={itemStyles}>
              <span className="link-grow pb-0.5">{item.label}</span>
            </NavLink>
          </li>
        ))}
        <li>
          <a href={resumeLink.href} download className={itemStyles}>
            <span className="link-grow pb-0.5">{resumeLink.label}</span>
            <Download aria-hidden="true" className="size-3.5" strokeWidth={1.75} />
            <span className="sr-only"> (PDF download)</span>
          </a>
        </li>
      </ul>
    </nav>
  );
}
