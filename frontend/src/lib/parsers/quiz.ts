import type { FrontmatterData, Option, Question, Quiz } from "@/lib/parsers/types";

const QUESTION_HEADING_RE = /^##\s*Q(\d+)\s*$/;
const QUESTION_TYPE_RE = /^\s*type\s*:\s*(.+)\s*$/i;
const ANSWER_RE = /^\s*answer\s*:\s*(.+)\s*$/i;
const OPTION_RE = /^\s*([A-Z]+)\.\s+(.*)$/;
const EXPLANATION_RE = /^\s*>\s*(解析|Explanation)\s*[:：]\s*(.*)$/;
const BLOCKQUOTE_RE = /^\s*>\s?(.*)$/;

function normalizeLines(markdown: string): string[] {
  return markdown.replace(/\r\n/g, "\n").split("\n");
}

function createQuestionId(text: string): string {
  return sha1(text.trim()).slice(0, 12);
}

function parseAnswerField(value: string): string[] {
  const normalized = value.trim();
  const body =
    normalized.startsWith("[") && normalized.endsWith("]")
      ? normalized.slice(1, -1)
      : normalized;

  return body
    .split(",")
    .map((part) => part.trim().toUpperCase())
    .filter(Boolean);
}

function leftRotate(value: number, bits: number): number {
  return ((value << bits) | (value >>> (32 - bits))) >>> 0;
}

function sha1(value: string): string {
  const encoded = new TextEncoder().encode(value);
  const originalBitLength = encoded.length * 8;
  const paddedLength = (((encoded.length + 9 + 63) >> 6) << 6);
  const bytes = new Uint8Array(paddedLength);

  bytes.set(encoded);
  bytes[encoded.length] = 0x80;

  const view = new DataView(bytes.buffer);
  view.setUint32(bytes.length - 4, originalBitLength >>> 0, false);
  view.setUint32(bytes.length - 8, Math.floor(originalBitLength / 0x100000000), false);

  let h0 = 0x67452301;
  let h1 = 0xefcdab89;
  let h2 = 0x98badcfe;
  let h3 = 0x10325476;
  let h4 = 0xc3d2e1f0;

  for (let offset = 0; offset < bytes.length; offset += 64) {
    const words = new Uint32Array(80);

    for (let index = 0; index < 16; index += 1) {
      words[index] = view.getUint32(offset + index * 4, false);
    }

    for (let index = 16; index < 80; index += 1) {
      words[index] = leftRotate(
        words[index - 3] ^ words[index - 8] ^ words[index - 14] ^ words[index - 16],
        1,
      );
    }

    let a = h0;
    let b = h1;
    let c = h2;
    let d = h3;
    let e = h4;

    for (let index = 0; index < 80; index += 1) {
      let f = 0;
      let k = 0;

      if (index < 20) {
        f = (b & c) | (~b & d);
        k = 0x5a827999;
      } else if (index < 40) {
        f = b ^ c ^ d;
        k = 0x6ed9eba1;
      } else if (index < 60) {
        f = (b & c) | (b & d) | (c & d);
        k = 0x8f1bbcdc;
      } else {
        f = b ^ c ^ d;
        k = 0xca62c1d6;
      }

      const temp = (leftRotate(a, 5) + f + e + k + words[index]) >>> 0;
      e = d;
      d = c;
      c = leftRotate(b, 30);
      b = a;
      a = temp;
    }

    h0 = (h0 + a) >>> 0;
    h1 = (h1 + b) >>> 0;
    h2 = (h2 + c) >>> 0;
    h3 = (h3 + d) >>> 0;
    h4 = (h4 + e) >>> 0;
  }

  return [h0, h1, h2, h3, h4]
    .map((part) => part.toString(16).padStart(8, "0"))
    .join("");
}

function finalizeQuestion(question: {
  declaredAnswerIds: string[];
  declaredType?: string;
  explanationLines: string[];
  optionLines: Array<{ id: string; text: string }>;
  sourceNumber: number;
  textLines: string[];
}): Question {
  const text = question.textLines.join("\n").trim();
  const options: Option[] = question.optionLines.map((option) => ({
    correct: question.declaredAnswerIds.includes(option.id),
    id: option.id,
    text: option.text.trim(),
  }));
  const explanation = question.explanationLines.join("\n").trim();
  const normalizedType = question.declaredType?.trim().toLowerCase();

  return {
    declaredAnswerIds: question.declaredAnswerIds,
    declaredType: question.declaredType,
    explanation: explanation.length > 0 ? explanation : undefined,
    id: createQuestionId(text),
    isMulti:
      normalizedType === "multi"
        ? true
        : normalizedType === "single"
          ? false
          : question.declaredAnswerIds.length >= 2,
    number: 0,
    options,
    sourceNumber: question.sourceNumber,
    text,
  };
}

export function parseQuiz(content: string, data: FrontmatterData): Quiz {
  const lines = normalizeLines(content);
  const questions: Question[] = [];
  let currentQuestion:
    | {
        declaredAnswerIds: string[];
        declaredType?: string;
        explanationLines: string[];
        optionLines: Array<{ id: string; text: string }>;
        sourceNumber: number;
        textLines: string[];
      }
    | null = null;
  let inExplanation = false;

  function pushCurrentQuestion(): void {
    if (!currentQuestion) {
      return;
    }

    questions.push(finalizeQuestion(currentQuestion));
    currentQuestion = null;
    inExplanation = false;
  }

  for (const line of lines) {
    const questionMatch = line.match(QUESTION_HEADING_RE);

    if (questionMatch) {
      pushCurrentQuestion();
      currentQuestion = {
        declaredAnswerIds: [],
        declaredType: undefined,
        explanationLines: [],
        optionLines: [],
        sourceNumber: Number(questionMatch[1]),
        textLines: [],
      };
      continue;
    }

    if (!currentQuestion) {
      continue;
    }

    if (currentQuestion.textLines.length === 0 && currentQuestion.optionLines.length === 0) {
      const typeMatch = line.match(QUESTION_TYPE_RE);
      if (typeMatch) {
        currentQuestion.declaredType = typeMatch[1].trim();
        continue;
      }

      const answerMatch = line.match(ANSWER_RE);
      if (answerMatch) {
        currentQuestion.declaredAnswerIds = parseAnswerField(answerMatch[1]);
        continue;
      }
    }

    const explanationMatch = line.match(EXPLANATION_RE);
    if (explanationMatch) {
      inExplanation = true;
      currentQuestion.explanationLines.push(explanationMatch[2]);
      continue;
    }

    if (inExplanation) {
      const blockquoteMatch = line.match(BLOCKQUOTE_RE);
      if (blockquoteMatch) {
        currentQuestion.explanationLines.push(blockquoteMatch[1]);
        continue;
      }

      if (line.trim() === "") {
        currentQuestion.explanationLines.push("");
        continue;
      }

      inExplanation = false;
    }

    const optionMatch = line.match(OPTION_RE);
    if (optionMatch) {
      currentQuestion.optionLines.push({
        id: optionMatch[1].toUpperCase(),
        text: optionMatch[2],
      });
      continue;
    }

    if (currentQuestion.optionLines.length === 0) {
      currentQuestion.textLines.push(line);
    }
  }

  pushCurrentQuestion();

  return {
    meta: {
      passingScore:
        typeof data.passingScore === "number" ? data.passingScore : undefined,
      shuffle: data.shuffle === true,
      shuffleOptions: data.shuffleOptions === true,
      timeLimit: typeof data.timeLimit === "number" ? data.timeLimit : undefined,
      title: typeof data.title === "string" ? data.title : "Untitled Quiz",
    },
    questions: questions.map((question, index) => ({
      ...question,
      number: index + 1,
    })),
  };
}
