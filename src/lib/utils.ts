/** True for absolute http(s) URLs, which open in a new tab. mailto: links do not. */
export function isExternalHref(href: string): boolean {
  return /^(https?:)?\/\//.test(href);
}
