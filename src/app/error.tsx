"use client";

import { useEffect } from "react";

import { Cluster } from "@/components/layout/stack";
import { PageIntro } from "@/components/sections/page-intro";
import { Button, ButtonLink } from "@/components/ui/button";

type ErrorPageProps = {
  error: unknown;
  retry: () => void;
};

/** Catches runtime errors in any route below the root layout. */
export default function ErrorPage({ error, retry }: ErrorPageProps) {
  useEffect(() => {
    // Replace with an error-reporting service when one is added.
    console.error(error);
  }, [error]);

  return (
    <PageIntro
      eyebrow="Error"
      title="Something went wrong"
      lead="This page failed to load. Try again, or go back to the home page."
    >
      <Cluster gap="lg">
        <Button onClick={retry}>Try again</Button>
        <ButtonLink href="/" variant="secondary" icon="none">
          Go to the home page
        </ButtonLink>
      </Cluster>
    </PageIntro>
  );
}
