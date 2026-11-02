import { ArrowUp } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Grid, GridItem } from "@/components/layout/grid";
import { TextLink } from "@/components/ui/text-link";
import { Label } from "@/components/ui/typography";
import { getSocialLinks, mainNav, resumeLink } from "@/config/navigation";
import { siteConfig } from "@/config/site";

const listStyles = "flex flex-col gap-1 text-small";
const linkStyles = "inline-flex min-h-11 items-center desktop:min-h-9";

export function SiteFooter() {
  const { email } = siteConfig.contact;
  const socialLinks = getSocialLinks();

  return (
    <footer className="border-t border-border py-section-compact">
      <Container>
        <Grid rowGap="lg">
          <GridItem span="rail" className="flex flex-col gap-1">
            <p className="text-body font-medium">{siteConfig.name}</p>
            <Label as="p">{siteConfig.role}</Label>
          </GridItem>

          <GridItem
            span="main"
            className="grid grid-cols-2 gap-x-gutter gap-y-10 tablet:grid-cols-3"
          >
            <nav aria-label="Footer" className="flex flex-col gap-3">
              <Label as="h2">Pages</Label>
              <ul className={listStyles}>
                {mainNav.map((item) => (
                  <li key={item.href}>
                    <TextLink href={item.href} className={linkStyles}>
                      {item.label}
                    </TextLink>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex flex-col gap-3">
              <Label as="h2">Elsewhere</Label>
              <ul className={listStyles}>
                {email && (
                  <li>
                    <TextLink href={`mailto:${email}`} className={linkStyles}>
                      Email
                    </TextLink>
                  </li>
                )}
                {socialLinks.map((link) => (
                  <li key={link.href}>
                    <TextLink href={link.href} external className={linkStyles}>
                      {link.label}
                    </TextLink>
                  </li>
                ))}
                <li>
                  <TextLink href={resumeLink.href} download className={linkStyles}>
                    {resumeLink.label}
                  </TextLink>
                </li>
              </ul>
            </div>

            <div className="col-span-2 flex items-end justify-between gap-6 tablet:col-span-1 tablet:flex-col tablet:items-end">
              <Label as="p">
                © {new Date().getFullYear()} {siteConfig.name}
              </Label>
              <a
                href="#main"
                className="group inline-flex min-h-11 items-center gap-2 text-small font-medium underline decoration-1 underline-offset-4 hover:decoration-accent"
              >
                Back to top
                <ArrowUp
                  aria-hidden="true"
                  strokeWidth={1.75}
                  className="size-4 transition-transform duration-micro ease-standard group-hover:-translate-y-0.5"
                />
              </a>
            </div>
          </GridItem>
        </Grid>
      </Container>
    </footer>
  );
}
