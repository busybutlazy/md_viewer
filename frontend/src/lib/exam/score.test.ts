import { describe, expect, it } from "vitest";
import type { Quiz } from "@/lib/parsers/types";
import { evaluateExamAnswers } from "@/lib/exam/score";

const quizFixture: Quiz = {
  meta: {
    shuffle: false,
    shuffleOptions: false,
    title: "Scoring Test",
  },
  questions: [
    {
      id: "single",
      isMulti: false,
      number: 1,
      options: [
        { correct: true, id: "a", text: "A" },
        { correct: false, id: "b", text: "B" },
      ],
      text: "Single select",
    },
    {
      id: "multi",
      isMulti: true,
      number: 2,
      options: [
        { correct: true, id: "a", text: "A" },
        { correct: true, id: "b", text: "B" },
        { correct: false, id: "c", text: "C" },
      ],
      text: "Multi select",
    },
  ],
};

describe("evaluateExamAnswers", () => {
  it("scores only exact matches as correct", () => {
    const result = evaluateExamAnswers(quizFixture, {
      multi: ["a", "c"],
      single: ["a"],
    });

    expect(result.correctCount).toBe(1);
    expect(result.incorrectCount).toBe(1);
    expect(result.percentage).toBe(50);
    expect(result.wrongQuestions[0]?.question.id).toBe("multi");
  });

  it("treats unanswered questions as incorrect", () => {
    const result = evaluateExamAnswers(quizFixture, {});

    expect(result.correctCount).toBe(0);
    expect(result.percentage).toBe(0);
    expect(result.questions.every((question) => question.unanswered)).toBe(true);
  });
});
