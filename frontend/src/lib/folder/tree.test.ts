import { describe, expect, it } from "vitest";
import { countFileNodes, filterFileNodes } from "@/lib/folder/tree";
import type { FileNode } from "@/lib/fs/types";

describe("folder tree helpers", () => {
  it("filters nested file nodes by name or path", () => {
    const nodes: FileNode[] = [
      {
        children: [
          { kind: "file", name: "react.md", path: "notes/react.md" },
          { kind: "file", name: "vue.md", path: "notes/vue.md" },
        ],
        kind: "directory",
        name: "notes",
        path: "notes",
      },
    ];

    expect(filterFileNodes(nodes, "react")).toEqual([
      {
        children: [{ kind: "file", name: "react.md", path: "notes/react.md" }],
        kind: "directory",
        name: "notes",
        path: "notes",
      },
    ]);
  });

  it("counts 1000 files quickly", () => {
    const nodes: FileNode[] = [
      {
        children: Array.from({ length: 1000 }, (_, index) => ({
          kind: "file" as const,
          name: `note-${index}.md`,
          path: `vault/note-${index}.md`,
        })),
        kind: "directory",
        name: "vault",
        path: "vault",
      },
    ];
    const startedAt = performance.now();

    expect(countFileNodes(nodes)).toBe(1000);
    expect(performance.now() - startedAt).toBeLessThan(1000);
  });
});
