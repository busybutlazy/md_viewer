import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { parseDocument } from "@/lib/parsers/parse-document";
import type { DocumentMode } from "@/lib/parsers/types";

interface AcceptanceFile {
  markdown: string;
  name: string;
}

const ACCEPTANCE_DIRECTORIES = [
  path.resolve(process.cwd(), "samples"),
  path.resolve(process.cwd(), "src/lib/parsers/__tests__/fixtures"),
  path.resolve(process.cwd(), "../docs"),
  path.resolve(process.cwd(), ".."),
];

function collectMarkdownFiles(): AcceptanceFile[] {
  const allowedRootFiles = new Set(["AGENTS.md", "README.md"]);
  const files: AcceptanceFile[] = [];

  for (const directory of ACCEPTANCE_DIRECTORIES) {
    if (!fs.existsSync(directory)) {
      continue;
    }

    const entries = fs.readdirSync(directory, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory()) {
        if (directory.endsWith("samples")) {
          const nestedDirectory = path.join(directory, entry.name);
          const nestedEntries = fs.readdirSync(nestedDirectory, {
            withFileTypes: true,
          });

          for (const nestedEntry of nestedEntries) {
            if (!nestedEntry.isFile() || !nestedEntry.name.endsWith(".md")) {
              continue;
            }

            const fullPath = path.join(nestedDirectory, nestedEntry.name);
            files.push({
              markdown: fs.readFileSync(fullPath, "utf8"),
              name: path.relative(process.cwd(), fullPath),
            });
          }
        }

        continue;
      }

      if (!entry.name.endsWith(".md")) {
        continue;
      }

      if (directory === path.resolve(process.cwd(), "..") && !allowedRootFiles.has(entry.name)) {
        continue;
      }

      const fullPath = path.join(directory, entry.name);
      files.push({
        markdown: fs.readFileSync(fullPath, "utf8"),
        name: path.relative(process.cwd(), fullPath),
      });
    }
  }

  return files.sort((left, right) => left.name.localeCompare(right.name));
}

describe("phase 1 acceptance corpus", () => {
  it("parses at least 20 markdown files without throwing", () => {
    const files = collectMarkdownFiles();
    const modes = new Set<DocumentMode>();

    expect(files.length).toBeGreaterThanOrEqual(20);

    for (const file of files) {
      const result = parseDocument(file.markdown);
      expect(result.mode).toBeTruthy();
      expect(result.parsed).toBeTruthy();
      modes.add(result.mode);
    }

    expect(modes).toEqual(new Set<DocumentMode>(["reading", "quiz", "slides"]));
  });

  it("keeps malformed quiz samples recoverable via warnings instead of crashes", () => {
    const markdown = fs.readFileSync(
      path.resolve(process.cwd(), "samples/acceptance/quiz-warning-case.md"),
      "utf8",
    );

    const result = parseDocument(markdown);

    expect(result.mode).toBe("quiz");
    expect(result.warnings.length).toBeGreaterThan(0);
  });
});
