import { type Metadata } from "next";

import { ContactForm } from "@/components/contact/contact-form";
import { Grid, GridItem } from "@/components/layout/grid";
import { Section } from "@/components/layout/section";
import { PageIntro } from "@/components/sections/page-intro";
import { TextLink } from "@/components/ui/text-link";
import { Label } from "@/components/ui/typography";
import { getSocialLinks, resumeLink } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { createPageMetadata } from "@/lib/metadata";

const lead =
  "Hiring for a senior frontend or UI architecture role? Send a message and I'll reply by email.";

export const metadata: Metadata = createPageMetadata({
  title: "Contact",
  description: lead,
  path: "/contact",
});

export default function ContactPage() {
  const { email } = siteConfig.contact;
  const socialLinks = getSocialLinks();
  const linkedIn = socialLinks.find((link) => link.label === "LinkedIn");

  return (
    <>
      <PageIntro eyebrow="Contact" title="Get in touch" lead={lead} />
      <Section spacing="none" className="pb-section" labelledBy="contact-form-title">
        <Grid rowGap="lg">
          <GridItem
            as="aside"
            span="rail"
            className="order-last flex flex-col gap-6 desktop:order-none"
          >
            <h2 className="sr-only">Other ways to reach me</h2>
            {email && (
              <div className="flex flex-col gap-1">
                <Label as="p">Email</Label>
                <TextLink href={`mailto:${email}`} className="select-all">
                  {email}
                </TextLink>
              </div>
            )}
            <div className="flex flex-col gap-1">
              <Label as="p">Elsewhere</Label>
              <ul className="flex flex-col gap-1">
                {socialLinks.map((link) => (
                  <li key={link.href}>
                    <TextLink
                      href={link.href}
                      external
                      className="inline-flex min-h-11 items-center"
                    >
                      {link.label}
                    </TextLink>
                  </li>
                ))}
                <li>
                  <TextLink
                    href={resumeLink.href}
                    download
                    className="inline-flex min-h-11 items-center"
                  >
                    Resume
                  </TextLink>
                </li>
              </ul>
            </div>
          </GridItem>

          <GridItem span="main" className="desktop:col-end-12">
            <h2 id="contact-form-title" className="sr-only">
              Contact form
            </h2>
            <div className="max-w-measure">
              <ContactForm
                fallback={linkedIn ? { label: "LinkedIn", href: linkedIn.href } : undefined}
              />
            </div>
          </GridItem>
        </Grid>
      </Section>
    </>
  );
}
