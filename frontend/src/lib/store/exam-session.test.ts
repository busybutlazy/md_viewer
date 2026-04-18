"use client";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Quiz } from "@/lib/parsers/types";
import { useExamSessionStore } from "@/lib/store/exam-session";

const quizFixture: Quiz = {
  meta: {
    shuffle: false,
    shuffleOptions: false,
    timeLimit: 120,
    title: "Exam Session Test",
  },
  questions: [
    {
      id: "q1",
      isMulti: false,
      number: 1,
      options: [
        { correct: true, id: "a", text: "A" },
        { correct: false, id: "b", text: "B" },
      ],
      text: "Question 1",
    },
    {
      id: "q2",
      isMulti: true,
      number: 2,
      options: [
        { correct: true, id: "a", text: "A" },
        { correct: true, id: "b", text: "B" },
      ],
      text: "Question 2",
    },
  ],
};

function resetExamSessionStore() {
  useExamSessionStore.getState().clearSession();
  sessionStorage.clear();
}

describe("useExamSessionStore", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-19T12:00:00Z"));
    resetExamSessionStore();
  });

  afterEach(() => {
    resetExamSessionStore();
    vi.useRealTimers();
  });

  it("initializes question order and deadline once per quiz", () => {
    useExamSessionStore.getState().initializeSession(quizFixture);
    const firstState = useExamSessionStore.getState();

    useExamSessionStore.getState().initializeSession(quizFixture);
    const secondState = useExamSessionStore.getState();

    expect(firstState.questionOrder).toEqual(["q1", "q2"]);
    expect(firstState.optionOrder.q1).toEqual(["a", "b"]);
    expect(firstState.deadlineAt).toBe(Date.parse("2026-04-19T12:02:00Z"));
    expect(secondState.startedAt).toBe(firstState.startedAt);
  });

  it("stores single-select and multi-select answers, then marks submission", () => {
    useExamSessionStore.getState().initializeSession(quizFixture);

    useExamSessionStore.getState().selectOption({
      isMulti: false,
      optionId: "b",
      questionId: "q1",
    });
    useExamSessionStore.getState().selectOption({
      isMulti: true,
      optionId: "a",
      questionId: "q2",
    });
    useExamSessionStore.getState().selectOption({
      isMulti: true,
      optionId: "b",
      questionId: "q2",
    });
    useExamSessionStore.getState().submitSession({ autoSubmitted: true });

    const state = useExamSessionStore.getState();

    expect(state.answers.q1).toEqual(["b"]);
    expect(state.answers.q2).toEqual(["a", "b"]);
    expect(state.autoSubmitted).toBe(true);
    expect(state.submittedAt).toBe(Date.parse("2026-04-19T12:00:00Z"));
  });
});
