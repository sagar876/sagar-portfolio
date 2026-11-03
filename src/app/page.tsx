import { type Metadata } from "next";

import { AboutPreview } from "@/components/sections/home/about-preview";
import { Capabilities } from "@/components/sections/home/capabilities";
import { ContactCta } from "@/components/sections/home/contact-cta";
import { Experience } from "@/components/sections/home/experience";
import { Hero } from "@/components/sections/home/hero";
import { SelectedWork } from "@/components/sections/home/selected-work";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({ path: "/" });

export default function HomePage() {
  return (
    <>
      <Hero />
      <SelectedWork />
      <Experience />
      <Capabilities />
      <AboutPreview />
      <ContactCta />
    </>
  );
}
