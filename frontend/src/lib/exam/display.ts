import type { Question } from "@/lib/parsers/types";

export function getDisplayOptionLabel(index: number): string {
  let current = index;
  let label = "";

  do {
    label = String.fromCharCode(65 + (current % 26)) + label;
    current = Math.floor(current / 26) - 1;
  } while (current >= 0);

  return label;
}

export function getQuestionDisplayNumbers(
  questions: Question[],
): Record<string, number> {
  return Object.fromEntries(
    questions.map((question, index) => [question.id, index + 1]),
  );
}
