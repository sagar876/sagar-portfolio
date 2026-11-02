import type { MDXComponents } from "mdx/types";
import { type ComponentPropsWithoutRef } from "react";

import { Divider } from "@/components/ui/divider";
import { TextLink } from "@/components/ui/text-link";
import { Heading, Mono } from "@/components/ui/typography";

/*
 * Maps Markdown elements in articles (src/content/writing/*.mdx) to the
 * design system. Required by @next/mdx in the App Router.
 */

const components: MDXComponents = {
  h2: ({ children, id }) => (
    <Heading level={2} size="h2" id={id} className="scroll-mt-24 pt-8">
      {children}
    </Heading>
  ),
  h3: ({ children, id }) => (
    <Heading level={3} size="h4" id={id} className="scroll-mt-24 pt-4">
      {children}
    </Heading>
  ),
  p: ({ children }) => <p className="max-w-measure font-serif text-body-lg text-fg">{children}</p>,
  ul: ({ children }) => (
    <ul className="flex max-w-measure list-disc flex-col gap-2 pl-6 font-serif text-body-lg text-fg marker:text-fg-muted">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="flex max-w-measure list-decimal flex-col gap-2 pl-6 font-serif text-body-lg text-fg marker:font-sans marker:text-small marker:text-fg-muted">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="pl-1">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  a: ({ href = "", children }) => <TextLink href={href}>{children}</TextLink>,
  blockquote: ({ children }) => (
    <blockquote className="max-w-measure border-y border-fg py-6 font-serif text-h3 [&_p]:text-h3">
      {children}
    </blockquote>
  ),
  hr: () => <Divider className="my-4" />,
  // Inline code. Code blocks are styled through `pre` below.
  code: ({ children }) => <Mono className="bg-surface px-1 text-[0.85em]">{children}</Mono>,
  pre: ({ children, ...props }: ComponentPropsWithoutRef<"pre">) => (
    <pre
      {...props}
      tabIndex={0}
      aria-label="Code example"
      className="overflow-x-auto border border-border bg-surface p-4 font-mono text-mono text-fg tablet:p-6 [&>code]:bg-transparent [&>code]:p-0 [&>code]:text-mono"
    >
      {children}
    </pre>
  ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
