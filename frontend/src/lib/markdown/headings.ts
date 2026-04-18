export interface MarkdownHeading {
  depth: number;
  id: string;
  text: string;
}

const FENCE_PATTERN = /^(\s*)(`{3,}|~{3,})/;
const ATX_HEADING_PATTERN = /^(#{1,6})\s+(.+?)\s*#*\s*$/;

function normalizeHeadingText(text: string): string {
  return text
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[`*_~]/g, "")
    .replace(/<[^>]+>/g, "")
    .trim();
}

export function slugifyHeading(text: string): string {
  const normalized = normalizeHeadingText(text)
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return normalized || "section";
}

export function extractMarkdownHeadings(markdown: string): MarkdownHeading[] {
  const headings: MarkdownHeading[] = [];
  const slugCounts = new Map<string, number>();
  const fenceStack: Array<{ indent: string; marker: string }> = [];

  for (const line of markdown.split(/\r?\n/)) {
    const fenceMatch = line.match(FENCE_PATTERN);

    if (fenceMatch) {
      const [, indent, marker] = fenceMatch;
      const currentFence = fenceStack[fenceStack.length - 1];

      if (
        currentFence &&
        currentFence.indent === indent &&
        currentFence.marker[0] === marker[0] &&
        marker.length >= currentFence.marker.length
      ) {
        fenceStack.pop();
      } else if (!currentFence) {
        fenceStack.push({ indent, marker });
      }

      continue;
    }

    if (fenceStack.length > 0) {
      continue;
    }

    const headingMatch = line.match(ATX_HEADING_PATTERN);

    if (!headingMatch) {
      continue;
    }

    const [, hashes, rawText] = headingMatch;
    const text = normalizeHeadingText(rawText);

    if (!text) {
      continue;
    }

    const baseSlug = slugifyHeading(text);
    const count = slugCounts.get(baseSlug) ?? 0;
    slugCounts.set(baseSlug, count + 1);

    headings.push({
      depth: hashes.length,
      id: count === 0 ? baseSlug : `${baseSlug}-${count + 1}`,
      text,
    });
  }

  return headings;
}
