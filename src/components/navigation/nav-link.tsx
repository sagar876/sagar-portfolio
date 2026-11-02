"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";

import { SignalMark } from "@/components/ui/signal-mark";
import { cn } from "@/lib/cn";

type NavLinkProps = {
  href: string;
  className: string;
  onClick?: () => void;
  children: ReactNode;
};

/**
 * Internal nav link that marks the current section with the accent square.
 * The mark sits in the gap to the left of the label, so it never shifts layout.
 */
export function NavLink({ href, className, onClick, children }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className={cn("relative", className)}
    >
      {isActive && <SignalMark className="absolute top-1/2 -left-3.5 -translate-y-1/2" />}
      {children}
    </Link>
  );
}
