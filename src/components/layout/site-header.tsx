import { Container } from "@/components/layout/container";
import { MainNav } from "@/components/navigation/main-nav";
import { MobileMenu } from "@/components/navigation/mobile-menu";
import { StickyHeader } from "@/components/navigation/sticky-header";
import { Wordmark } from "@/components/navigation/wordmark";

export function SiteHeader() {
  return (
    <StickyHeader>
      <Container className="flex min-h-16 items-center justify-between gap-8 py-2">
        <Wordmark withRole />
        <MainNav />
        <MobileMenu />
      </Container>
    </StickyHeader>
  );
}
