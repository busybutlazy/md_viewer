export type DocumentMode = "reading" | "quiz" | "slides";

export interface FrontmatterData {
  author?: string;
  aspectRatio?: "16:9" | "4:3" | string;
  date?: string;
  passingScore?: number;
  shuffle?: boolean;
  shuffleOptions?: boolean;
  tags?: string[];
  theme?: "default" | "dark" | "minimal" | string;
  timeLimit?: number;
  title?: string;
  type?: string;
  [key: string]: unknown;
}

export interface ParsedFrontmatter {
  content: string;
  data: FrontmatterData;
  isEmpty: boolean;
}

export interface Quiz {
  meta: {
    passingScore?: number;
    shuffle: boolean;
    shuffleOptions: boolean;
    timeLimit?: number;
    title: string;
  };
  questions: Question[];
}

export interface Question {
  declaredAnswerIds?: string[];
  declaredType?: string;
  explanation?: string;
  id: string;
  isMulti: boolean;
  number: number;
  options: Option[];
  sourceNumber?: number;
  text: string;
}

export interface Option {
  correct: boolean;
  id: string;
  text: string;
}

export interface SlideDeck {
  meta: {
    aspectRatio: "16:9" | "4:3";
    theme: "default" | "dark" | "minimal";
    title: string;
  };
  slides: Slide[];
}

export interface Slide {
  content: string;
  index: number;
  speakerNotes?: string;
}

export interface ValidationResult {
  warnings: string[];
}
