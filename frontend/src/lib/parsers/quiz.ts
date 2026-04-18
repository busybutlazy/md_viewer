import type { FrontmatterData, Option, Question, Quiz } from "@/lib/parsers/types";

const QUESTION_HEADING_RE = /^##\s*Q(\d+)\s*[:：]\s*(.*)$/;
const OPTION_RE = /^\s*-\s*\[([xX ])\]\s+(.*)$/;
const EXPLANATION_RE = /^\s*>\s*(解析|Explanation)\s*[:：]\s*(.*)$/;
const BLOCKQUOTE_RE = /^\s*>\s?(.*)$/;

function normalizeLines(markdown: string): string[] {
  return markdown.replace(/\r\n/g, "\n").split("\n");
}

function createQuestionId(text: string): string {
  return sha1(text.trim()).slice(0, 12);
}

function createOptionId(index: number): string {
  let current = index;
  let id = "";

  do {
    id = String.fromCharCode(97 + (current % 26)) + id;
    current = Math.floor(current / 26) - 1;
  } while (current >= 0);

  return id;
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
  explanationLines: string[];
  optionLines: Array<{ correct: boolean; text: string }>;
  sourceNumber: number;
  textLines: string[];
}): Question {
  const text = question.textLines.join("\n").trim();
  const options: Option[] = question.optionLines.map((option, index) => ({
    correct: option.correct,
    id: createOptionId(index),
    text: option.text.trim(),
  }));
  const correctCount = options.filter((option) => option.correct).length;
  const explanation = question.explanationLines.join("\n").trim();

  return {
    explanation: explanation.length > 0 ? explanation : undefined,
    id: createQuestionId(text),
    isMulti: correctCount >= 2,
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
        explanationLines: string[];
        optionLines: Array<{ correct: boolean; text: string }>;
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
        explanationLines: [],
        optionLines: [],
        sourceNumber: Number(questionMatch[1]),
        textLines: questionMatch[2] ? [questionMatch[2]] : [],
      };
      continue;
    }

    if (!currentQuestion) {
      continue;
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
        correct: optionMatch[1].toLowerCase() === "x",
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
