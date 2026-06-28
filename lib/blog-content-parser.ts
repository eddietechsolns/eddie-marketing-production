// ─── Blog content parsing utilities ───────────────────────────────────────────

/**
 * Extract key takeaways from the first <ul> in blog content HTML.
 * Returns up to 6 bullet points stripped of HTML tags.
 */
export function extractKeyTakeaways(html: string | null): string[] {
  if (!html) return [];
  const ulMatch = html.match(/<ul[^>]*>([\s\S]*?)<\/ul>/i);
  if (!ulMatch) return [];
  const liMatches = [...ulMatch[1].matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)];
  return liMatches
    .map((m) => m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim())
    .filter((s) => s.length > 15 && s.length < 250)
    .slice(0, 6);
}

/**
 * Split HTML content at the midpoint H2 boundary.
 * Returns [firstHalf, secondHalf]. If the content is too short to split
 * (fewer than 3 H2 sections) or the first half is very short, returns [html, ''].
 */
export function splitAtMidpointH2(html: string | null): [string, string] {
  if (!html) return ['', ''];
  // Split on H2 boundaries, keeping the delimiter in the later part
  const parts = html.split(/(?=<h2[\s>])/i);
  if (parts.length < 3) return [html, ''];
  const midIdx = Math.ceil(parts.length / 2);
  const first = parts.slice(0, midIdx).join('');
  const second = parts.slice(midIdx).join('');
  // Only split if both halves are substantial
  if (first.length < 300 || second.length < 200) return [html, ''];
  return [first, second];
}
