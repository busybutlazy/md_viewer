import { describe, expect, it } from "vitest";
import {
  extractMarkdownHeadings,
  slugifyHeading,
} from "@/lib/markdown/headings";

describe("slugifyHeading", () => {
  it("keeps CJK text, strips punctuation, and normalizes whitespace", () => {
    expect(slugifyHeading("React 19 新特性！")).toBe("react-19-新特性");
    expect(slugifyHeading("  深入   閱讀模式  ")).toBe("深入-閱讀模式");
  });
});

describe("extractMarkdownHeadings", () => {
  it("extracts ordered headings and ignores fenced code blocks", () => {
    const headings = extractMarkdownHeadings(
      [
        "# Intro",
        "",
        "## Setup",
        "",
        "```md",
        "## Not a heading",
        "```",
        "",
        "### Details",
        "",
        "## Setup",
      ].join("\n"),
    );

    expect(headings).toEqual([
      { depth: 1, id: "intro", text: "Intro" },
      { depth: 2, id: "setup", text: "Setup" },
      { depth: 3, id: "details", text: "Details" },
      { depth: 2, id: "setup-2", text: "Setup" },
    ]);
  });
});
