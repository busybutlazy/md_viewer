import type { DocumentMode } from "@/lib/parsers/types";

export function getRouteByDocumentMode(mode: DocumentMode): string {
  if (mode === "quiz") {
    return "/exam";
  }

  if (mode === "slides") {
    return "/slides";
  }

  return "/read";
}
