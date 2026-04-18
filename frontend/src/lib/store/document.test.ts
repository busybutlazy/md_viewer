"use client";

import { afterEach, beforeEach, describe, expect, it } from "vitest";
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

  it("parses uploaded markdown, stores mode-specific data, and persists to sessionStorage", () => {
    const mode = useDocumentStore.getState().loadDocument({
      fileName: "quiz.md",
      markdown: [
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
    });

    const state = useDocumentStore.getState();
    const persisted = sessionStorage.getItem(STORAGE_KEY);

    expect(mode).toBe("quiz");
    expect(state.fileName).toBe("quiz.md");
    expect(state.mode).toBe("quiz");
    expect(state.markdown).toContain("## Q1");
    expect(state.frontmatter?.title).toBe("Session Quiz");
    expect(state.parsed && "questions" in state.parsed).toBe(true);
    expect(persisted).toContain("\"mode\":\"quiz\"");
    expect(persisted).toContain("\"fileName\":\"quiz.md\"");
  });

  it("clears in-memory state and persisted storage", () => {
    useDocumentStore.getState().loadDocument({
      fileName: "reading.md",
      markdown: "# Reading doc",
    });

    useDocumentStore.getState().clearDocument();

    const state = useDocumentStore.getState();
    const persisted = sessionStorage.getItem(STORAGE_KEY);

    expect(state.fileName).toBeUndefined();
    expect(state.mode).toBeUndefined();
    expect(state.parsed).toBeUndefined();
    expect(state.warnings).toEqual([]);
    expect(persisted).toContain("\"state\":{\"warnings\":[]}");
  });
});
