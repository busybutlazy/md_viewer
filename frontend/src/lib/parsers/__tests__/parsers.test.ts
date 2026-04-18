import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { parseFrontmatter } from "@/lib/parsers/frontmatter";
import { parseQuiz } from "@/lib/parsers/quiz";
import { parseSlides } from "@/lib/parsers/slides";
import { validateQuiz, validateSlides } from "@/lib/parsers/validate";

function readFixture(name: string): string {
  return fs.readFileSync(path.join(__dirname, "fixtures", name), "utf8");
}

describe("parseQuiz", () => {
  it("parses quiz metadata, renumbers repeated headings, and detects multi-select", () => {
    const source = readFixture("quiz-edge.md");
    const { content, data } = parseFrontmatter(source);
    const quiz = parseQuiz(content, data);

    expect(quiz.meta.title).toBe("Parser Edge Cases");
    expect(quiz.meta.shuffle).toBe(true);
    expect(quiz.meta.passingScore).toBe(80);
    expect(quiz.questions).toHaveLength(3);
    expect(quiz.questions[0].number).toBe(1);
    expect(quiz.questions[0].text).toContain("https://example.com");
    expect(quiz.questions[1].number).toBe(2);
    expect(quiz.questions[1].isMulti).toBe(true);
    expect(quiz.questions[1].options[0].id).toBe("a");
    expect(quiz.questions[1].explanation).toContain("延伸閱讀：MDN");
    expect(quiz.questions[2].isMulti).toBe(false);
  });

  it("emits warnings for duplicate numbering, missing explanations, and no correct option", () => {
    const source = readFixture("quiz-edge.md");
    const { content, data } = parseFrontmatter(source);
    const quiz = parseQuiz(content, data);
    const result = validateQuiz(quiz);

    expect(result.warnings).toContain("第 3 題沒有正確選項（缺少 [x]）");
    expect(result.warnings).toContain("第 3 題沒有詳解");
    expect(result.warnings).toContain("第 1 題 與 第 2 題 題號皆為 Q1（已依順序重新編號）");
  });

  it("handles zero-question quizzes and option ids beyond j", () => {
    const emptyQuiz = parseQuiz("", {
      title: "Empty Quiz",
      type: "quiz",
    });
    const longQuiz = parseQuiz(
      `## Q9: 請選出正確答案\n\n${Array.from({ length: 11 }, (_, index) =>
        `- [${index === 10 ? "x" : " "}] option ${index + 1}`,
      ).join("\n")}`,
      { type: "quiz" },
    );

    expect(emptyQuiz.questions).toEqual([]);
    expect(longQuiz.questions[0].options[10].id).toBe("k");
    expect(longQuiz.questions[0].options[10].correct).toBe(true);
  });

  it("keeps explanation code blocks and nested blockquotes intact", () => {
    const quiz = parseQuiz(
      [
        "## Q1: 什麼情況下 --- 不應該出錯？",
        "",
        "- [x] 程式碼區塊內",
        "- [ ] 分頁符本身",
        "",
        "> 解析: 這裡要保留 code block",
        ">",
        "> ```yaml",
        "> ---",
        "> safe: true",
        "> ```",
        ">",
        "> > 延伸閱讀：parser spec",
      ].join("\n"),
      { type: "quiz" },
    );

    expect(quiz.questions[0].explanation).toContain("```yaml");
    expect(quiz.questions[0].explanation).toContain("---");
    expect(quiz.questions[0].explanation).toContain("> 延伸閱讀：parser spec");
  });
});

describe("parseSlides", () => {
  it("splits slides outside fenced code blocks and collects speaker notes", () => {
    const source = readFixture("slides-edge.md");
    const { content, data } = parseFrontmatter(source);
    const deck = parseSlides(content, data);

    expect(deck.meta.theme).toBe("minimal");
    expect(deck.meta.aspectRatio).toBe("4:3");
    expect(deck.slides).toHaveLength(2);
    expect(deck.slides[0].content).toContain("name: example");
    expect(deck.slides[0].speakerNotes).toContain("第二句話");
    expect(deck.slides[1].speakerNotes).toBe("備忘 A\n\n備忘 B");
    expect(deck.slides[1].content).toContain('const divider = "---";');
  });

  it("warns when no slides are detected", () => {
    const deck = parseSlides("", { type: "slides" });
    const result = validateSlides(deck);

    expect(result.warnings).toEqual([
      "未偵測到任何投影片，請檢查是否有 --- 分頁符",
    ]);
  });

  it("accepts spaced dividers, skips blank slides, and returns empty for frontmatter-only decks", () => {
    const deck = parseSlides(
      ["# 第一頁", "", " ---  ", "", "", "-----", "", "## 第二頁"].join("\n"),
      { type: "slides" },
    );
    const emptyDeck = parseSlides("", {
      aspectRatio: "16:9",
      theme: "default",
      title: "Frontmatter Only",
      type: "slides",
    });

    expect(deck.slides).toHaveLength(2);
    expect(deck.slides[0].content).toContain("# 第一頁");
    expect(deck.slides[1].content).toContain("## 第二頁");
    expect(emptyDeck.slides).toEqual([]);
  });
});
