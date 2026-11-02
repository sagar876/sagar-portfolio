import { GridItem } from "@/components/layout/grid";
import { Heading, type HeadingLevel, Label, Text } from "@/components/ui/typography";
import { formatMonth, isIsoMonth } from "@/lib/format";
import { type ExperienceEntry } from "@/types/content";

function DateValue({ value }: { value: string }) {
  const text = formatMonth(value);
  return isIsoMonth(value) ? <time dateTime={value}>{text}</time> : <>{text}</>;
}

function BulletList({ items }: { items: readonly string[] }) {
  return (
    <ul className="flex max-w-measure list-disc flex-col gap-2 pl-5 marker:text-fg-muted">
      {items.map((item, index) => (
        <Text as="li" key={`${index}-${item}`}>
          {item}
        </Text>
      ))}
    </ul>
  );
}

type ExperienceItemProps = {
  entry: ExperienceEntry;
  /** `compact` for previews (homepage); `detailed` for the Experience page. */
  variant?: "compact" | "detailed";
  headingLevel?: HeadingLevel;
};

/**
 * One role: dates and employment details in the rail, role, company and
 * details in the main column. Render inside ExperienceList (an <ol>).
 */
export function ExperienceItem({
  entry,
  variant = "compact",
  headingLevel = 3,
}: ExperienceItemProps) {
  const org = [entry.company, entry.location].filter(Boolean).join(" · ");
  const detailed = variant === "detailed";

  return (
    <li className="grid-page gap-y-3 border-t border-border py-8 desktop:py-12">
      <GridItem span="rail" className="flex flex-col gap-1">
        <Label as="p">
          <DateValue value={entry.start} />
          {" – "}
          {entry.end ? <DateValue value={entry.end} /> : "Present"}
        </Label>
        {detailed && entry.employmentType && <Label as="p">{entry.employmentType}</Label>}
      </GridItem>

      <GridItem span="main" className="flex flex-col gap-6 desktop:col-end-12">
        <div className="flex flex-col gap-1">
          <Heading level={headingLevel} size="h3">
            {entry.role}
          </Heading>
          <Text tone="secondary">{org}</Text>
        </div>

        {detailed && entry.summary && (
          <Text size="lg" family="serif" measure>
            {entry.summary}
          </Text>
        )}

        {entry.responsibilities.length > 0 &&
          (detailed ? (
            <div className="flex flex-col gap-3">
              <Label as="h4">Responsibilities</Label>
              <BulletList items={entry.responsibilities} />
            </div>
          ) : (
            <BulletList items={entry.responsibilities.slice(0, 2)} />
          ))}

        {detailed && entry.accomplishments && entry.accomplishments.length > 0 && (
          <div className="flex flex-col gap-3">
            <Label as="h4">Accomplishments</Label>
            <BulletList items={entry.accomplishments} />
          </div>
        )}

        {detailed && entry.technologies && entry.technologies.length > 0 && (
          <div className="flex flex-col gap-3">
            <Label as="h4">Technologies</Label>
            <ul aria-label="Technologies" className="flex flex-wrap gap-x-3 gap-y-1">
              {entry.technologies.map((tech, index) => (
                <li key={`${index}-${tech}`} className="flex items-center gap-3">
                  {index > 0 && (
                    <span aria-hidden="true" className="text-fg-muted">
                      /
                    </span>
                  )}
                  <span className="text-small text-fg">{tech}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </GridItem>
    </li>
  );
}

/** Timeline of roles, newest first. */
export function ExperienceList({
  entries,
  variant = "compact",
  headingLevel = 3,
}: {
  entries: readonly ExperienceEntry[];
  variant?: "compact" | "detailed";
  headingLevel?: HeadingLevel;
}) {
  return (
    <ol className="border-b border-border">
      {entries.map((entry, index) => (
        <ExperienceItem
          key={`${index}-${entry.company}-${entry.start}`}
          entry={entry}
          variant={variant}
          headingLevel={headingLevel}
        />
      ))}
    </ol>
  );
}
