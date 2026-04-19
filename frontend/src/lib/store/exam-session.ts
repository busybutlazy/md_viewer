"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Quiz } from "@/lib/parsers/types";

export interface ExamSessionSnapshot {
  answers: Record<string, string[]>;
  autoSubmitted: boolean;
  deadlineAt?: number;
  optionOrder: Record<string, string[]>;
  questionOrder: string[];
  quizId?: string;
  startedAt?: number;
  submittedAt?: number;
}

interface ExamSessionState extends ExamSessionSnapshot {
  clearSession: () => void;
  hasHydrated: boolean;
  initializeSession: (quiz: Quiz) => void;
  selectOption: (input: {
    isMulti: boolean;
    optionId: string;
    questionId: string;
  }) => void;
  submitSession: (input?: { autoSubmitted?: boolean }) => void;
}

const INITIAL_STATE: ExamSessionSnapshot = {
  answers: {},
  autoSubmitted: false,
  deadlineAt: undefined,
  optionOrder: {},
  questionOrder: [],
  quizId: undefined,
  startedAt: undefined,
  submittedAt: undefined,
};

function shuffleArray<T>(items: T[]): T[] {
  const nextItems = [...items];

  for (let index = nextItems.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [nextItems[index], nextItems[swapIndex]] = [nextItems[swapIndex], nextItems[index]];
  }

  return nextItems;
}

function createQuizId(quiz: Quiz): string {
  return [
    quiz.meta.title,
    ...quiz.questions.map((question) => question.id),
  ].join(":");
}

function buildSessionSnapshot(quiz: Quiz): ExamSessionSnapshot {
  const startedAt = Date.now();
  const orderedQuestions = quiz.meta.shuffle
    ? shuffleArray(quiz.questions)
    : quiz.questions;
  const questionOrder = orderedQuestions.map((question) => question.id);
  const optionOrder = Object.fromEntries(
    orderedQuestions.map((question) => [
      question.id,
      (quiz.meta.shuffleOptions
        ? shuffleArray(question.options)
        : question.options
      ).map((option) => option.id),
    ]),
  );

  return {
    answers: {},
    autoSubmitted: false,
    deadlineAt:
      typeof quiz.meta.timeLimit === "number" && quiz.meta.timeLimit > 0
        ? startedAt + quiz.meta.timeLimit * 1000
        : undefined,
    optionOrder,
    questionOrder,
    quizId: createQuizId(quiz),
    startedAt,
    submittedAt: undefined,
  };
}

export const useExamSessionStore = create<ExamSessionState>()(
  persist(
    (set, get) => ({
      hasHydrated: false,
      ...INITIAL_STATE,
      clearSession: () => set({ ...INITIAL_STATE, hasHydrated: true }),
      initializeSession: (quiz) => {
        const quizId = createQuizId(quiz);
        const currentSession = get();

        if (
          currentSession.quizId === quizId &&
          !currentSession.submittedAt &&
          currentSession.questionOrder.length > 0
        ) {
          return;
        }

        set({
          ...buildSessionSnapshot(quiz),
          hasHydrated: true,
        });
      },
      selectOption: ({ isMulti, optionId, questionId }) => {
        const currentAnswers = get().answers[questionId] ?? [];
        const nextAnswers = isMulti
          ? currentAnswers.includes(optionId)
            ? currentAnswers.filter((id) => id !== optionId)
            : [...currentAnswers, optionId]
          : [optionId];

        set((state) => ({
          answers: {
            ...state.answers,
            [questionId]: nextAnswers,
          },
          hasHydrated: true,
        }));
      },
      submitSession: ({ autoSubmitted = false } = {}) => {
        if (get().submittedAt) {
          return;
        }

        set({
          autoSubmitted,
          hasHydrated: true,
          submittedAt: Date.now(),
        });
      },
    }),
    {
      name: "mrp-exam-session",
      onRehydrateStorage: () => () => {
        useExamSessionStore.setState({ hasHydrated: true });
      },
      partialize: (state) => ({
        answers: state.answers,
        autoSubmitted: state.autoSubmitted,
        deadlineAt: state.deadlineAt,
        optionOrder: state.optionOrder,
        questionOrder: state.questionOrder,
        quizId: state.quizId,
        startedAt: state.startedAt,
        submittedAt: state.submittedAt,
      }),
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
