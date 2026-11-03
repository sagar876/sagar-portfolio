const monthFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

/** True for ISO months such as "2021-04". */
export function isIsoMonth(value: string): boolean {
  return /^\d{4}-(0[1-9]|1[0-2])$/.test(value);
}

/** "2021-04" → "Apr 2021". Any other text (e.g. a placeholder) is returned unchanged. */
export function formatMonth(value: string): string {
  return isIsoMonth(value) ? monthFormatter.format(new Date(`${value}-01T00:00:00Z`)) : value;
}
