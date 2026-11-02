import Link from "next/link";

import { Label } from "@/components/ui/typography";
import { siteConfig } from "@/config/site";

type WordmarkProps = {
  /** Show the role beside the name from desktop up. */
  withRole?: boolean;
  onClick?: () => void;
};

export function Wordmark({ withRole = false, onClick }: WordmarkProps) {
  return (
    <Link href="/" onClick={onClick} className="inline-flex min-h-11 items-center">
      <span className="flex items-baseline gap-3">
        <span className="text-body font-medium text-fg">{siteConfig.name}</span>
        {withRole && <Label className="hidden desktop:inline">{siteConfig.role}</Label>}
      </span>
    </Link>
  );
}
