"use client";

import type { DocumentMode } from "@/lib/parsers/types";
import { useDocumentStore } from "@/lib/store/document";

export function useRequireDocument(expectedMode?: DocumentMode) {
  const hasHydrated = useDocumentStore((state) => state.hasHydrated);
  const mode = useDocumentStore((state) => state.mode);
  const parsed = useDocumentStore((state) => state.parsed);

  const shouldShowPrompt =
    hasHydrated &&
    (!mode || !parsed || (expectedMode !== undefined && mode !== expectedMode));

  return { hasHydrated, mode, parsed, shouldShowPrompt };
}
