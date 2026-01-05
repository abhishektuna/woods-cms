export function formatDate(
  date: string | Date,
  locale = "en-IN"
): string {
  return new Intl.DateTimeFormat(locale).format(new Date(date));
}
