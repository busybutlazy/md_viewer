import type { Option, Question, Quiz } from "@/lib/parsers/types";

export interface EvaluatedQuestion {
  correctOptions: Option[];
  isCorrect: boolean;
  question: Question;
  selectedOptions: Option[];
  unanswered: boolean;
}

export interface ExamEvaluation {
  correctCount: number;
  incorrectCount: number;
  percentage: number;
  questions: EvaluatedQuestion[];
  wrongQuestions: EvaluatedQuestion[];
}

function compareAnswerSets(selectedIds: string[], correctIds: string[]): boolean {
  if (selectedIds.length !== correctIds.length) {
    return false;
  }

  const selectedSet = new Set(selectedIds);
  return correctIds.every((id) => selectedSet.has(id));
}

export function evaluateExamAnswers(
  quiz: Quiz,
  answers: Record<string, string[]>,
): ExamEvaluation {
  const questions = quiz.questions.map((question) => {
    const selectedIds = answers[question.id] ?? [];
    const selectedOptions = question.options.filter((option) =>
      selectedIds.includes(option.id),
    );
    const correctOptions = question.options.filter((option) => option.correct);
    const correctIds = correctOptions.map((option) => option.id);
    const unanswered = selectedIds.length === 0;
    const isCorrect = compareAnswerSets(selectedIds, correctIds);

    return {
      correctOptions,
      isCorrect,
      question,
      selectedOptions,
      unanswered,
    };
  });
  const correctCount = questions.filter((question) => question.isCorrect).length;
  const totalCount = quiz.questions.length;

  return {
    correctCount,
    incorrectCount: totalCount - correctCount,
    percentage: totalCount === 0 ? 0 : Math.round((correctCount / totalCount) * 100),
    questions,
    wrongQuestions: questions.filter((question) => !question.isCorrect),
  };
}
