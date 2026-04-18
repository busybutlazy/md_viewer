import type { FrontmatterData, Slide, SlideDeck } from "@/lib/parsers/types";

const DIVIDER_RE = /^\s*-{3,}\s*$/;
const SPEAKER_RE = /<!--\s*speaker:\s*([\s\S]*?)-->/g;
const FENCE_RE = /^(\s*)(`{3,}|~{3,})(.*)$/;

function normalizeLines(markdown: string): string[] {
  return markdown.replace(/\r\n/g, "\n").split("\n");
}

function stripSpeakerNotes(source: string): Omit<Slide, "index"> {
  const notes = Array.from(source.matchAll(SPEAKER_RE))
    .map((match) => match[1].trim())
    .filter(Boolean);
  const content = source.replaceAll(SPEAKER_RE, "").trim();

  return {
    content,
    speakerNotes: notes.length > 0 ? notes.join("\n\n") : undefined,
  };
}

export function parseSlides(content: string, data: FrontmatterData): SlideDeck {
  const slides: Slide[] = [];
  const lines = normalizeLines(content);
  const currentLines: string[] = [];
  let currentFence: { indent: string; token: string } | null = null;

  function flushSlide(): void {
    const raw = currentLines.join("\n").trim();
    currentLines.length = 0;

    if (raw.length === 0) {
      return;
    }

    const slide = stripSpeakerNotes(raw);
    if (slide.content.length === 0 && !slide.speakerNotes) {
      return;
    }

    slides.push({
      ...slide,
      index: slides.length,
    });
  }

  for (const line of lines) {
    const fenceMatch = line.match(FENCE_RE);

    if (fenceMatch) {
      const token = fenceMatch[2];
      const indent = fenceMatch[1];

      if (!currentFence) {
        currentFence = { indent, token };
      } else if (currentFence.indent === indent && currentFence.token === token) {
        currentFence = null;
      }
    }

    if (!currentFence && DIVIDER_RE.test(line)) {
      flushSlide();
      continue;
    }

    currentLines.push(line);
  }

  flushSlide();

  return {
    meta: {
      aspectRatio: data.aspectRatio === "4:3" ? "4:3" : "16:9",
      theme:
        data.theme === "dark" || data.theme === "minimal" ? data.theme : "default",
      title: typeof data.title === "string" ? data.title : "Untitled Deck",
    },
    slides,
  };
}
