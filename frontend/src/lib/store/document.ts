"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { FSAccessAdapter } from "@/lib/fs/fs-access-adapter";
import { clearImageCache, setImageAdapter } from "@/lib/fs/image-resolver";
import type { FileSystemAdapter, FileSystemAdapterType } from "@/lib/fs/types";
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

interface DocumentSource {
  adapterType: FileSystemAdapterType;
  path: string;
}

interface DocumentState {
  fileName?: string;
  frontmatter?: FrontmatterData;
  hasHydrated: boolean;
  loadDocumentFromAdapter: (
    adapter: FileSystemAdapter,
    path?: string,
  ) => Promise<DocumentMode>;
  markdown?: string;
  mode?: DocumentMode;
  parsed?: ParsedDocument;
  source?: DocumentSource;
  clearDocument: () => void;
  updateMarkdown: (markdown: string) => void;
  warnings: string[];
}

interface LoadedDocumentState {
  fileName: string;
  frontmatter: FrontmatterData;
  markdown: string;
  mode: DocumentMode;
  parsed: ParsedDocument;
  source: DocumentSource;
  warnings: string[];
}

const INITIAL_STATE = {
  fileName: undefined,
  frontmatter: undefined,
  hasHydrated: false,
  markdown: undefined,
  mode: undefined,
  parsed: undefined,
  source: undefined,
  warnings: [],
} satisfies Omit<
  DocumentState,
  "clearDocument" | "loadDocumentFromAdapter" | "updateMarkdown"
>;

function parseLoadedDocument(input: {
  adapterType: FileSystemAdapterType;
  fileName: string;
  markdown: string;
}): LoadedDocumentState {
  const parsed = parseDocument(input.markdown);

  return {
    fileName: input.fileName,
    frontmatter: parsed.frontmatter.data,
    markdown: input.markdown,
    mode: parsed.mode,
    parsed: parsed.parsed,
    source: {
      adapterType: input.adapterType,
      path: input.fileName,
    },
    warnings: parsed.warnings,
  };
}

export const useDocumentStore = create<DocumentState>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,
      clearDocument: () => {
        clearImageCache();
        set({ ...INITIAL_STATE, hasHydrated: true });
      },
      loadDocumentFromAdapter: async (adapter, path) => {
        const nodes = await adapter.list();
        const fileName = path ?? nodes.find((node) => node.kind === "file")?.path;

        if (!fileName) {
          throw new Error("FileSystemAdapter did not provide a readable file.");
        }

        const markdown = await adapter.read(fileName);
        const parsedState = parseLoadedDocument({
          adapterType: adapter.type,
          fileName,
          markdown,
        });

        if (adapter instanceof FSAccessAdapter) {
          setImageAdapter(adapter, fileName);
        } else {
          setImageAdapter(undefined, undefined);
        }

        set({
          ...parsedState,
          hasHydrated: true,
        });

        return parsedState.mode;
      },
      updateMarkdown: (markdown) => {
        const parsed = parseDocument(markdown);

        set({
          frontmatter: parsed.frontmatter.data,
          hasHydrated: true,
          markdown,
          mode: parsed.mode,
          parsed: parsed.parsed,
          warnings: parsed.warnings,
        });
      },
      warnings: [],
    }),
    {
      name: "mrp-document",
      onRehydrateStorage: () => () => {
        useDocumentStore.setState({ hasHydrated: true });
      },
      partialize: (state) => ({
        fileName: state.fileName,
        frontmatter: state.frontmatter,
        markdown: state.markdown,
        mode: state.mode,
        parsed: state.parsed,
        source: state.source,
        warnings: state.warnings,
      }),
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
