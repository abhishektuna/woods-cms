export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function truncate(text: string, length = 50): string {
  return text.length > length
    ? `${text.slice(0, length)}...`
    : text;
}
