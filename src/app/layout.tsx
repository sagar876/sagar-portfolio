import "./globals.css";

import { Analytics } from "@vercel/analytics/next";
import { type Metadata, type Viewport } from "next";
import { ViewTransition } from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SkipLink } from "@/components/layout/skip-link";
import { fontVariables } from "@/lib/fonts";
import { rootMetadata } from "@/lib/metadata";

export const metadata: Metadata = rootMetadata;

export const viewport: Viewport = {
  // Browser UI color. Matches --background in globals.css (light / dark).
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf7" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1011" },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={fontVariables}>
      <body className="flex min-h-dvh flex-col">
        <SkipLink />
        <SiteHeader />
        <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
          {/* Crossfades page content on navigation (no-op where unsupported). */}
          <ViewTransition>{children}</ViewTransition>
        </main>
        <SiteFooter />
        {/* Vercel Web Analytics: cookieless page views. Enable it in the Vercel dashboard; inactive locally. */}
        <Analytics />
      </body>
    </html>
  );
}
