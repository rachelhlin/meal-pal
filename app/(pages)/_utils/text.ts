// Turns a free-text block into clean list items, dropping blank lines and
// leading bullets/numbers ("- eggs", "1. Mix") so we can render real lists.
export function splitLines(text: string): string[] {
  return text
    .split('\n')
    .map((line) => line.replace(/^\s*([-*•]|\d+[.)])\s*/, '').trim())
    .filter(Boolean);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
