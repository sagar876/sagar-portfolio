import { type Metadata } from "next";

import { Cluster } from "@/components/layout/stack";
import { PageIntro } from "@/components/sections/page-intro";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <PageIntro
      eyebrow="404"
      title="This page doesn't exist"
      lead="The link may be out of date, or the page may have moved."
    >
      <Cluster gap="lg">
        <ButtonLink href="/">Go to the home page</ButtonLink>
        <ButtonLink href="/work" variant="secondary" icon="none">
          See selected work
        </ButtonLink>
      </Cluster>
    </PageIntro>
  );
}
