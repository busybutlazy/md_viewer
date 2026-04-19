import { detectMode } from "@/lib/parsers/detect-mode";
import { parseFrontmatter } from "@/lib/parsers/frontmatter";
import { parseQuiz } from "@/lib/parsers/quiz";
import { parseSlides } from "@/lib/parsers/slides";
import type {
  DocumentMode,
  FrontmatterData,
  ParsedFrontmatter,
  Quiz,
  SlideDeck,
} from "@/lib/parsers/types";
import { validateQuiz, validateSlides } from "@/lib/parsers/validate";

export interface ReadingDocument {
  content: string;
  meta: FrontmatterData;
}

export interface ParsedDocumentResult {
  frontmatter: ParsedFrontmatter;
  mode: DocumentMode;
  parsed: Quiz | ReadingDocument | SlideDeck;
  warnings: string[];
}

export function parseDocument(markdown: string): ParsedDocumentResult {
  const frontmatter = parseFrontmatter(markdown);
  const mode = detectMode(frontmatter.data);

  if (mode === "quiz") {
    const parsed = parseQuiz(frontmatter.content, frontmatter.data);
    return {
      frontmatter,
      mode,
      parsed,
      warnings: validateQuiz(parsed).warnings,
    };
  }

  if (mode === "slides") {
    const parsed = parseSlides(frontmatter.content, frontmatter.data);
    return {
      frontmatter,
      mode,
      parsed,
      warnings: validateSlides(parsed).warnings,
    };
  }

  return {
    frontmatter,
    mode,
    parsed: {
      content: frontmatter.content,
      meta: frontmatter.data,
    },
    warnings: [],
  };
}
