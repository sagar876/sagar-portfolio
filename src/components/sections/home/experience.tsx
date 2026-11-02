import { ExperienceList } from "@/components/content/experience-item";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { experienceContent } from "@/content/home";
import { experience } from "@/content/experience";

export function Experience() {
  if (experience.length === 0) return null;

  return (
    <Section id="experience" labelledBy="experience-title" divider>
      <SectionHeading
        id="experience-title"
        label="Experience"
        title={experienceContent.title}
        description={experienceContent.resumeNote}
        action={{ label: "Full experience", href: "/experience" }}
      />
      <ExperienceList entries={experience} />
    </Section>
  );
}
