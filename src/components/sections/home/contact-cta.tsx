import { Grid, GridItem } from "@/components/layout/grid";
import { Section } from "@/components/layout/section";
import { Cluster } from "@/components/layout/stack";
import { ButtonLink } from "@/components/ui/button";
import { TextLink } from "@/components/ui/text-link";
import { Heading, Label, Text } from "@/components/ui/typography";
import { getSocialLinks, resumeLink } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { contactContent } from "@/content/home";

/**
 * Closing call to action. The email button appears only when an address is
 * configured; until then it points to the contact page.
 */
export function ContactCta() {
  const { email } = siteConfig.contact;
  const socialLinks = getSocialLinks();

  return (
    <Section id="contact" labelledBy="contact-title" divider>
      <Grid rowGap="lg">
        <GridItem span="rail">
          <Label as="p">{contactContent.label}</Label>
        </GridItem>
        <GridItem span="main" className="flex flex-col gap-8 desktop:col-end-12">
          <Heading level={2} size="display" id="contact-title">
            {contactContent.title}
          </Heading>
          <Text size="lg" tone="secondary" measure>
            {contactContent.body}
          </Text>
          <Cluster gap="lg">
            {email ? (
              <ButtonLink href={`mailto:${email}`} icon="arrow">
                {email}
              </ButtonLink>
            ) : (
              <ButtonLink href="/contact">{contactContent.fallbackCta}</ButtonLink>
            )}
            {socialLinks.map((link) => (
              <TextLink key={link.href} href={link.href} external className="text-body font-medium">
                {link.label}
              </TextLink>
            ))}
            <TextLink href={resumeLink.href} download className="text-body font-medium">
              Resume
            </TextLink>
          </Cluster>
        </GridItem>
      </Grid>
    </Section>
  );
}
