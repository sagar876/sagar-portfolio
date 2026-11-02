import { Grid, GridItem } from "@/components/layout/grid";
import { Section } from "@/components/layout/section";
import { TextLink } from "@/components/ui/text-link";
import { Label, Text } from "@/components/ui/typography";
import { aboutPreviewContent } from "@/content/home";

export function AboutPreview() {
  return (
    <Section id="about" labelledBy="about-title" divider>
      <Grid rowGap="md">
        <GridItem span="rail">
          <Label as="h2" id="about-title">
            {aboutPreviewContent.title}
          </Label>
        </GridItem>
        <GridItem span="prose" className="flex flex-col items-start gap-6">
          <Text size="lg" family="serif" measure>
            {aboutPreviewContent.body}
          </Text>
          <TextLink href="/about" className="text-body font-medium">
            {aboutPreviewContent.linkLabel}
          </TextLink>
        </GridItem>
      </Grid>
    </Section>
  );
}
