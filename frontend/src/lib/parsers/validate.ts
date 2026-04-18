import type { Quiz, SlideDeck, ValidationResult } from "@/lib/parsers/types";

export function validateQuiz(quiz: Quiz): ValidationResult {
  const warnings: string[] = [];
  const duplicateNumbers = new Map<number, number[]>();

  quiz.questions.forEach((question) => {
    const correctCount = question.options.filter((option) => option.correct).length;

    if (correctCount === 0) {
      warnings.push(`第 ${question.number} 題沒有正確選項（缺少 [x]）`);
    }

    if (!question.explanation) {
      warnings.push(`第 ${question.number} 題沒有詳解`);
    }

    if (typeof question.sourceNumber === "number") {
      const current = duplicateNumbers.get(question.sourceNumber) ?? [];
      duplicateNumbers.set(question.sourceNumber, [...current, question.number]);
    }
  });

  duplicateNumbers.forEach((numbers, sourceNumber) => {
    if (numbers.length > 1) {
      const formatted = numbers.map((number) => `第 ${number} 題`).join(" 與 ");
      warnings.push(`${formatted} 題號皆為 Q${sourceNumber}（已依順序重新編號）`);
    }
  });

  return { warnings };
}

export function validateSlides(deck: SlideDeck): ValidationResult {
  const warnings: string[] = [];

  if (deck.slides.length === 0) {
    warnings.push("未偵測到任何投影片，請檢查是否有 --- 分頁符");
  }

  return { warnings };
}
