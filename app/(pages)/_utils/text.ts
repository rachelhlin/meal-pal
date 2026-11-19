// strips "- " / "1. " so people can paste lists however they want
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
