"use client";

import "./globals.css";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { fontVariables } from "@/lib/fonts";

type GlobalErrorProps = {
  error: unknown;
  retry: () => void;
};

/**
 * Last-resort boundary for errors in the root layout itself. It replaces the
 * whole document, so it renders its own <html> and <body> and avoids any
 * component that depends on the layout (header, nav, Motion).
 */
export default function GlobalError({ error, retry }: GlobalErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en" className={fontVariables}>
      <body>
        <title>Something went wrong — Sagar Dixit</title>
        <main className="mx-auto flex min-h-dvh max-w-page flex-col justify-center gap-8 px-page-margin py-24">
          <p className="font-mono text-label text-fg-muted uppercase">Error</p>
          <h1 className="text-display text-fg">Something went wrong</h1>
          <p className="max-w-measure text-body-lg text-fg-secondary">
            The site failed to load. Try again in a moment.
          </p>
          <div>
            <Button onClick={retry}>Try again</Button>
          </div>
        </main>
      </body>
    </html>
  );
}
