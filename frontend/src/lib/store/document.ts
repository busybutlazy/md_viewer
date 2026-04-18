"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { parseDocument } from "@/lib/parsers/parse-document";
import type {
  DocumentMode,
  FrontmatterData,
  Quiz,
  SlideDeck,
} from "@/lib/parsers/types";

interface ReadingDocument {
  content: string;
  meta: FrontmatterData;
}

type ParsedDocument = Quiz | ReadingDocument | SlideDeck;

interface DocumentState {
  fileName?: string;
  frontmatter?: FrontmatterData;
  loadDocument: (input: { fileName: string; markdown: string }) => DocumentMode;
  markdown?: string;
  mode?: DocumentMode;
  parsed?: ParsedDocument;
  clearDocument: () => void;
  warnings: string[];
}

const INITIAL_STATE = {
  fileName: undefined,
  frontmatter: undefined,
  markdown: undefined,
  mode: undefined,
  parsed: undefined,
  warnings: [],
} satisfies Omit<
  DocumentState,
  "clearDocument" | "loadDocument"
>;

export const useDocumentStore = create<DocumentState>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,
      clearDocument: () => set({ ...INITIAL_STATE }),
      loadDocument: ({ fileName, markdown }) => {
        const parsed = parseDocument(markdown);

        set({
          fileName,
          frontmatter: parsed.frontmatter.data,
          markdown,
          mode: parsed.mode,
          parsed: parsed.parsed,
          warnings: parsed.warnings,
        });

        return parsed.mode;
      },
      warnings: [],
    }),
    {
      name: "mrp-document",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
