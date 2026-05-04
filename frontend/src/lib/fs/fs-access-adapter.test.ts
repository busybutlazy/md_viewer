import { describe, expect, it, vi } from "vitest";
import {
  findFirstMarkdownFile,
  FSAccessAdapter,
} from "@/lib/fs/fs-access-adapter";
import { isFileSystemAccessSupported } from "@/lib/fs/fs-access-support";

describe("FSAccessAdapter", () => {
  it("lists markdown files and ignores unsupported entries", async () => {
    const adapter = new FSAccessAdapter(
      directoryHandle("vault", {
        ".hidden.md": fileHandle(".hidden.md", "# Hidden"),
        "notes.md": fileHandle("notes.md", "# Notes"),
        "plain.txt": fileHandle("plain.txt", "Nope"),
        drafts: directoryHandle("drafts", {
          "deck.markdown": fileHandle("deck.markdown", "# Deck"),
        }),
        node_modules: directoryHandle("node_modules", {
          "ignored.md": fileHandle("ignored.md", "# Ignored"),
        }),
      }),
    );

    await expect(adapter.list()).resolves.toEqual([
      {
        children: [
          {
            kind: "file",
            name: "deck.markdown",
            path: "drafts/deck.markdown",
          },
        ],
        kind: "directory",
        name: "drafts",
        path: "drafts",
      },
      {
        kind: "file",
        name: "notes.md",
        path: "notes.md",
      },
    ]);
  });

  it("reads files by slash-delimited path", async () => {
    const adapter = new FSAccessAdapter(
      directoryHandle("vault", {
        nested: directoryHandle("nested", {
          "note.md": fileHandle("note.md", "# Nested"),
        }),
      }),
    );

    await expect(adapter.read("nested/note.md")).resolves.toBe("# Nested");
  });

  it("finds the first markdown file in a tree", () => {
    expect(
      findFirstMarkdownFile([
        {
          children: [{ kind: "file", name: "a.md", path: "folder/a.md" }],
          kind: "directory",
          name: "folder",
          path: "folder",
        },
      ]),
    ).toEqual({ kind: "file", name: "a.md", path: "folder/a.md" });
  });

  it("detects browser support from showDirectoryPicker", () => {
    const supportedWindow = { showDirectoryPicker: vi.fn() } as unknown as Window;

    expect(isFileSystemAccessSupported(supportedWindow)).toBe(true);
    expect(isFileSystemAccessSupported({} as Window)).toBe(false);
  });
});

type MockHandle = FileSystemFileHandle | FileSystemDirectoryHandle;

function fileHandle(name: string, content: string): FileSystemFileHandle {
  return {
    async createWritable() {
      return {
        async close() {
          return undefined;
        },
        async write() {
          return undefined;
        },
      } as unknown as FileSystemWritableFileStream;
    },
    async getFile() {
      return {
        name,
        async text() {
          return content;
        },
      } as File;
    },
    kind: "file",
    name,
  } as unknown as FileSystemFileHandle;
}

function directoryHandle(
  name: string,
  entriesByName: Record<string, MockHandle>,
): FileSystemDirectoryHandle {
  return {
    async *entries() {
      for (const [entryName, handle] of Object.entries(entriesByName)) {
        yield [entryName, handle] as [string, MockHandle];
      }
    },
    async getDirectoryHandle(entryName: string) {
      const handle = entriesByName[entryName];
      if (!handle || handle.kind !== "directory") {
        throw new Error(`Missing directory: ${entryName}`);
      }
      return handle;
    },
    async getFileHandle(entryName: string) {
      const handle = entriesByName[entryName];
      if (!handle || handle.kind !== "file") {
        throw new Error(`Missing file: ${entryName}`);
      }
      return handle;
    },
    kind: "directory",
    name,
    async removeEntry() {
      return undefined;
    },
  } as unknown as FileSystemDirectoryHandle;
}
