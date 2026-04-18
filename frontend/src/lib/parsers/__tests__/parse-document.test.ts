import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { parseDocument } from "@/lib/parsers/parse-document";

function readFixture(name: string): string {
  return fs.readFileSync(path.join(__dirname, "fixtures", name), "utf8");
}

describe("parseDocument", () => {
  it("routes reading markdown to reading mode with frontmatter metadata", () => {
    const result = parseDocument(readFixture("frontmatter-reading.md"));

    expect(result.mode).toBe("reading");
    expect(result.frontmatter.data.title).toBe("React 19 新特性");
    expect("content" in result.parsed).toBe(true);

    if ("content" in result.parsed) {
      expect(result.parsed.meta.author).toBe("小明");
      expect(result.parsed.content).toContain("# React 19 新特性概覽");
    }

    expect(result.warnings).toEqual([]);
  });

  it("routes quiz markdown to quiz mode and forwards validation warnings", () => {
    const result = parseDocument(readFixture("quiz-edge.md"));

    expect(result.mode).toBe("quiz");
    expect("questions" in result.parsed).toBe(true);

    if ("questions" in result.parsed) {
      expect(result.parsed.questions).toHaveLength(3);
      expect(result.parsed.meta.shuffle).toBe(true);
    }

    expect(result.warnings).toContain("第 3 題沒有詳解");
  });

  it("routes slides markdown to slides mode and preserves parsed slide deck", () => {
    const result = parseDocument(readFixture("slides-edge.md"));

    expect(result.mode).toBe("slides");
    expect("slides" in result.parsed).toBe(true);

    if ("slides" in result.parsed) {
      expect(result.parsed.meta.theme).toBe("minimal");
      expect(result.parsed.slides).toHaveLength(2);
      expect(result.parsed.slides[0].speakerNotes).toContain("第二句話");
    }
  });
});
