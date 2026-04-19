import matter from "gray-matter";
import type { FrontmatterData, ParsedFrontmatter } from "@/lib/parsers/types";

function normalizeFrontmatterValue(value: unknown): unknown {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  if (Array.isArray(value)) {
    return value.map((item) => normalizeFrontmatterValue(item));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [
        key,
        normalizeFrontmatterValue(nestedValue),
      ]),
    );
  }

  return value;
}

export function parseFrontmatter(markdown: string): ParsedFrontmatter {
  const source = markdown ?? "";
  const parsed = matter(source);

  return {
    content: parsed.content,
    data: normalizeFrontmatterValue(parsed.data) as FrontmatterData,
    isEmpty: source.trim().length === 0,
  };
}
