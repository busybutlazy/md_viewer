import { describe, expect, it } from "vitest";
import { getDownloadFilename, slugifyTitle } from "./download";

describe("slugifyTitle", () => {
  it("converts spaces to hyphens", () => {
    expect(slugifyTitle("Hello World")).toBe("hello-world");
  });

  it("handles Chinese characters", () => {
    expect(slugifyTitle("React 入門指南")).toBe("react-入門指南");
  });

  it("strips special characters", () => {
    expect(slugifyTitle("Hello! World? (2024)")).toBe("hello-world-2024");
  });

  it("collapses multiple hyphens", () => {
    expect(slugifyTitle("foo  --  bar")).toBe("foo-bar");
  });

  it("falls back to untitled for empty result", () => {
    expect(slugifyTitle("!!!")).toBe("untitled");
  });
});

describe("getDownloadFilename", () => {
  it("uses slugified title when available", () => {
    expect(getDownloadFilename("My Document")).toBe("my-document.md");
  });

  it("falls back to fileName if no title", () => {
    expect(getDownloadFilename(undefined, "notes.md")).toBe("notes.md");
  });

  it("appends .md to fileName without extension", () => {
    expect(getDownloadFilename(undefined, "notes")).toBe("notes.md");
  });

  it("falls back to untitled-<timestamp> with no args", () => {
    const name = getDownloadFilename();
    expect(name).toMatch(/^untitled-\d+\.md$/);
  });
});
