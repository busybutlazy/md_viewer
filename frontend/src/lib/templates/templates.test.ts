import { describe, expect, it } from "vitest";
import { parseDocument } from "@/lib/parsers/parse-document";
import { TEMPLATES } from "./index";

describe("TEMPLATES", () => {
  it("blank template loads without crash", () => {
    const blank = TEMPLATES.find((t) => t.label === "空白");
    expect(blank).toBeDefined();
    const result = parseDocument(blank!.markdown);
    expect(result.warnings).toHaveLength(0);
  });

  it("reading template parses as reading mode", () => {
    const tpl = TEMPLATES.find((t) => t.label === "閱讀");
    expect(tpl).toBeDefined();
    const result = parseDocument(tpl!.markdown);
    expect(result.mode).toBe("reading");
    expect(result.warnings).toHaveLength(0);
  });

  it("quiz template parses as quiz mode with one question", () => {
    const tpl = TEMPLATES.find((t) => t.label === "考試");
    expect(tpl).toBeDefined();
    const result = parseDocument(tpl!.markdown);
    expect(result.mode).toBe("quiz");
    expect(result.warnings).toHaveLength(0);
    if (result.mode === "quiz" && result.parsed && "questions" in result.parsed) {
      expect(result.parsed.questions.length).toBe(1);
    }
  });

  it("slides template parses as slides mode with three slides", () => {
    const tpl = TEMPLATES.find((t) => t.label === "簡報");
    expect(tpl).toBeDefined();
    const result = parseDocument(tpl!.markdown);
    expect(result.mode).toBe("slides");
    expect(result.warnings).toHaveLength(0);
    if (result.mode === "slides" && result.parsed && "slides" in result.parsed) {
      expect(result.parsed.slides.length).toBe(3);
    }
  });
});
