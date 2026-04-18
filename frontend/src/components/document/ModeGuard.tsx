"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDocumentStore } from "@/lib/store/document";

export function useRequireDocument() {
  const router = useRouter();
  const mode = useDocumentStore((state) => state.mode);
  const parsed = useDocumentStore((state) => state.parsed);

  useEffect(() => {
    if (!mode || !parsed) {
      router.replace("/?toast=missing-document");
    }
  }, [mode, parsed, router]);

  return { mode, parsed };
}
