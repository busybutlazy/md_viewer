import matter from "gray-matter";
import type { ParsedFrontmatter } from "@/lib/parsers/types";

export function parseFrontmatter(markdown: string): ParsedFrontmatter {
  const source = markdown ?? "";
  const parsed = matter(source);

  return {
    content: parsed.content,
    data: parsed.data,
    isEmpty: source.trim().length === 0,
  };
}
