"use client";

import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createUploadAdapterFromMarkdown } from "@/lib/fs/upload-adapter";
import { useDocumentStore } from "@/lib/store/document";

const STORAGE_KEY = "mrp-document";

function resetDocumentStore() {
  useDocumentStore.getState().clearDocument();
  sessionStorage.clear();
}

describe("useDocumentStore", () => {
  beforeEach(() => {
    resetDocumentStore();
  });

  afterEach(() => {
    resetDocumentStore();
  });

  it("parses adapter-loaded markdown, stores mode-specific data, and persists to sessionStorage", async () => {
    const adapter = createUploadAdapterFromMarkdown(
      "quiz.md",
      [
        "---",
        "type: quiz",
        "title: Session Quiz",
        "---",
        "",
        "## Q1: Which option is correct?",
        "",
        "- [x] A",
        "- [ ] B",
        "",
        "> 解析: Because A is marked correct.",
      ].join("\n"),
    );
    const mode = await useDocumentStore.getState().loadDocumentFromAdapter(adapter);

    const state = useDocumentStore.getState();
    const persisted = sessionStorage.getItem(STORAGE_KEY);

    expect(mode).toBe("quiz");
    expect(state.fileName).toBe("quiz.md");
    expect(state.mode).toBe("quiz");
    expect(state.markdown).toContain("## Q1");
    expect(state.frontmatter?.title).toBe("Session Quiz");
    expect(state.parsed && "questions" in state.parsed).toBe(true);
    expect(state.source).toEqual({ adapterType: "upload", path: "quiz.md" });
    expect(persisted).toContain("\"mode\":\"quiz\"");
    expect(persisted).toContain("\"fileName\":\"quiz.md\"");
  });

  it("clears in-memory state and persisted storage", async () => {
    const adapter = createUploadAdapterFromMarkdown("reading.md", "# Reading doc");
    await useDocumentStore.getState().loadDocumentFromAdapter(adapter);

    useDocumentStore.getState().clearDocument();

    const state = useDocumentStore.getState();
    const persisted = sessionStorage.getItem(STORAGE_KEY);

    expect(state.fileName).toBeUndefined();
    expect(state.mode).toBeUndefined();
    expect(state.parsed).toBeUndefined();
    expect(state.source).toBeUndefined();
    expect(state.warnings).toEqual([]);
    expect(persisted).toContain("\"state\":{\"warnings\":[]}");
  });
});
