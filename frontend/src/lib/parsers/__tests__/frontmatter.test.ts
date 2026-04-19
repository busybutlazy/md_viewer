import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { detectMode } from "@/lib/parsers/detect-mode";
import { parseFrontmatter } from "@/lib/parsers/frontmatter";

function readFixture(name: string): string {
  return fs.readFileSync(path.join(__dirname, "fixtures", name), "utf8");
}

describe("parseFrontmatter", () => {
  it("parses reading frontmatter and preserves body content", () => {
    const parsed = parseFrontmatter(readFixture("frontmatter-reading.md"));

    expect(parsed.data.title).toBe("React 19 新特性");
    expect(parsed.data.author).toBe("小明");
    expect(parsed.data.tags).toEqual(["react", "frontend"]);
    expect(parsed.content).toContain("# React 19 新特性概覽");
    expect(parsed.isEmpty).toBe(false);
  });

  it("parses quiz metadata", () => {
    const parsed = parseFrontmatter(readFixture("frontmatter-quiz.md"));

    expect(parsed.data.type).toBe("quiz");
    expect(parsed.data.shuffle).toBe(true);
    expect(parsed.data.shuffleOptions).toBe(true);
    expect(parsed.data.passingScore).toBe(60);
    expect(parsed.data.timeLimit).toBe(600);
  });

  it("accepts CRLF content and empty documents", () => {
    const slidesSource = readFixture("frontmatter-slides.md").replace(/\n/g, "\r\n");
    const parsedSlides = parseFrontmatter(slidesSource);
    const parsedEmpty = parseFrontmatter("");

    expect(parsedSlides.data.type).toBe("slides");
    expect(parsedSlides.content).toContain("# 封面");
    expect(parsedEmpty.data).toEqual({});
    expect(parsedEmpty.content).toBe("");
    expect(parsedEmpty.isEmpty).toBe(true);
  });
});

describe("detectMode", () => {
  it("defaults to reading when type is missing or unknown", () => {
    expect(detectMode({})).toBe("reading");
    expect(detectMode({ type: "unknown" })).toBe("reading");
  });

  it("detects quiz and slides from frontmatter type", () => {
    expect(detectMode({ type: "quiz" })).toBe("quiz");
    expect(detectMode({ type: "slides" })).toBe("slides");
  });
});
