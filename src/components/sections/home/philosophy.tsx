import { Grid, GridItem } from "@/components/layout/grid";
import { Section } from "@/components/layout/section";
import { Label } from "@/components/ui/typography";
import { philosophyContent } from "@/content/home";

/** A single editorial statement, set large in the serif. */
export function Philosophy() {
  return (
    <Section id="approach" labelledBy="approach-title" divider>
      <Grid rowGap="md">
        <GridItem span="rail">
          <Label as="h2" id="approach-title">
            {philosophyContent.label}
          </Label>
        </GridItem>
        <GridItem span="main" className="desktop:col-end-12">
          <p className="font-serif text-h1 font-normal text-fg">{philosophyContent.statement}</p>
        </GridItem>
      </Grid>
    </Section>
  );
}
