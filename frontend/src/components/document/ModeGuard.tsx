"use client";

import { useEffect, useState } from "react";
import type { DocumentMode } from "@/lib/parsers/types";
import { useDocumentStore } from "@/lib/store/document";

export function useRequireDocument(expectedMode?: DocumentMode) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const storeHydrated = useDocumentStore((state) => state.hasHydrated);
  const mode = useDocumentStore((state) => state.mode);
  const parsed = useDocumentStore((state) => state.parsed);

  // Once mounted, show UploadPrompt for any of: store not yet hydrated,
  // no document loaded, or document mode doesn't match expected mode.
  // This prevents a permanent blank page if store hydration is delayed.
  const shouldShowPrompt =
    mounted &&
    (!storeHydrated || !mode || !parsed || (expectedMode !== undefined && mode !== expectedMode));

  // hasHydrated: false during SSR/initial render (returns null in pages), true after mount
  return { hasHydrated: mounted, mode, parsed, shouldShowPrompt };
}
