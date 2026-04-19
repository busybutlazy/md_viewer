"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDocumentStore } from "@/lib/store/document";

export function useRequireDocument() {
  const router = useRouter();
  const hasHydrated = useDocumentStore((state) => state.hasHydrated);
  const mode = useDocumentStore((state) => state.mode);
  const parsed = useDocumentStore((state) => state.parsed);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    if (!mode || !parsed) {
      router.replace("/?toast=missing-document");
    }
  }, [hasHydrated, mode, parsed, router]);

  return { hasHydrated, mode, parsed };
}
