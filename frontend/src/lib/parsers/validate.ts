import type { Quiz, SlideDeck, ValidationResult } from "@/lib/parsers/types";

export function validateQuiz(quiz: Quiz): ValidationResult {
  const warnings: string[] = [];
  const duplicateNumbers = new Map<number, number[]>();

  quiz.questions.forEach((question) => {
    const correctCount = question.options.filter((option) => option.correct).length;
    const declaredType = question.declaredType?.trim().toLowerCase();
    const declaredAnswerIds = question.declaredAnswerIds ?? [];
    const availableOptionIds = new Set(question.options.map((option) => option.id));
    const invalidAnswerIds = declaredAnswerIds.filter((id) => !availableOptionIds.has(id));

    if (!question.declaredType) {
      warnings.push(`第 ${question.number} 題缺少 type（需為 single 或 multi）`);
    } else if (declaredType !== "single" && declaredType !== "multi") {
      warnings.push(`第 ${question.number} 題的 type 必須為 single 或 multi`);
    }

    if (declaredAnswerIds.length === 0) {
      warnings.push(`第 ${question.number} 題缺少 answer`);
    }

    if (invalidAnswerIds.length > 0) {
      warnings.push(
        `第 ${question.number} 題的 answer 包含不存在的選項：${invalidAnswerIds.join(", ")}`,
      );
    }

    if (declaredType === "single" && declaredAnswerIds.length !== 1) {
      warnings.push(`第 ${question.number} 題為單選題，answer 必須且只能有一個選項`);
    }

    if (declaredType === "multi" && declaredAnswerIds.length < 2) {
      warnings.push(`第 ${question.number} 題為複選題，answer 至少需要兩個選項`);
    }

    if (correctCount === 0) {
      warnings.push(`第 ${question.number} 題沒有有效正確答案`);
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
