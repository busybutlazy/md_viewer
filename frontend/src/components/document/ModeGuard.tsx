"use client";

import { useEffect, useState } from "react";
import type { DocumentMode } from "@/lib/parsers/types";
import { useDocumentStore } from "@/lib/store/document";

export function useRequireDocument(expectedMode?: DocumentMode) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const hasHydrated = useDocumentStore((state) => state.hasHydrated);
  const mode = useDocumentStore((state) => state.mode);
  const parsed = useDocumentStore((state) => state.parsed);

  // Defer content until mounted to prevent SSR/CSR hydration mismatch
  const ready = mounted && hasHydrated;

  const shouldShowPrompt =
    ready &&
    (!mode || !parsed || (expectedMode !== undefined && mode !== expectedMode));

  return { hasHydrated: ready, mode, parsed, shouldShowPrompt };
}
