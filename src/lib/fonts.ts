import { IBM_Plex_Mono, Newsreader, Schibsted_Grotesk } from "next/font/google";

/** Display and UI face. Preloaded: it renders above the fold on every page. */
export const fontSans = Schibsted_Grotesk({
  subsets: ["latin"],
  variable: "--font-schibsted",
  display: "swap",
});

/** Long-form prose (case studies, About). Not preloaded; downloads only where used. */
export const fontSerif = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-newsreader",
  display: "swap",
  preload: false,
});

/** Metadata, labels, colophon tables. */
export const fontMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
  preload: false,
});

/** Class list that exposes all font CSS variables. Apply to <html>. */
export const fontVariables = [fontSans.variable, fontSerif.variable, fontMono.variable].join(" ");
