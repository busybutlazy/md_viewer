import type { DocumentMode, FrontmatterData } from "@/lib/parsers/types";

export function detectMode(data: FrontmatterData): DocumentMode {
  if (data.type === "quiz") {
    return "quiz";
  }

  if (data.type === "slides") {
    return "slides";
  }

  return "reading";
}
