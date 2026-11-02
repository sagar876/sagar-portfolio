import { Grid, GridItem } from "@/components/layout/grid";
import { TextLink } from "@/components/ui/text-link";
import {
  Heading,
  type HeadingLevel,
  type HeadingSize,
  Label,
  Text,
} from "@/components/ui/typography";

type SectionHeadingProps = {
  /** Id for the heading. Pass the same value to Section's `labelledBy`. */
  id: string;
  title: string;
  /** Short mono label shown in the left rail on desktop. */
  label?: string;
  description?: string;
  /** Optional link aligned to the heading, e.g. "All case studies". */
  action?: { label: string; href: string };
  level?: HeadingLevel;
  size?: HeadingSize;
};

/**
 * Opening block for a page section: label in the rail, heading and optional
 * description in the main column. Includes the spacing to the content below.
 */
export function SectionHeading({
  id,
  title,
  label,
  description,
  action,
  level = 2,
  size = "h1",
}: SectionHeadingProps) {
  return (
    <Grid
      as="header"
      rowGap="sm"
      className="reveal-on-scroll pb-8 desktop:items-baseline desktop:pb-12"
    >
      {label && (
        <GridItem span="rail">
          <Label as="p">{label}</Label>
        </GridItem>
      )}
      <GridItem
        span="main"
        className="flex flex-col gap-4 desktop:flex-row desktop:items-end desktop:justify-between desktop:gap-8"
      >
        <div className="flex flex-col gap-4">
          <Heading level={level} size={size} id={id}>
            {title}
          </Heading>
          {description && (
            <Text tone="secondary" measure>
              {description}
            </Text>
          )}
        </div>
        {action && (
          <TextLink href={action.href} className="shrink-0 text-small">
            {action.label}
          </TextLink>
        )}
      </GridItem>
    </Grid>
  );
}
