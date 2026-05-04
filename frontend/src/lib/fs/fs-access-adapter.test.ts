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

  it("reads and writes files by slash-delimited path", async () => {
    const file = fileHandle("note.md", "# Nested");
    const adapter = new FSAccessAdapter(
      directoryHandle("vault", {
        nested: directoryHandle("nested", {
          "note.md": file,
        }),
      }),
    );

    await expect(adapter.read("nested/note.md")).resolves.toBe("# Nested");
    await adapter.write("nested/note.md", "# Saved");
    expect(file.writes).toEqual(["# Saved"]);
  });

  it("creates a new file before writing when needed", async () => {
    const entries: Record<string, MockHandle> = {};
    const adapter = new FSAccessAdapter(directoryHandle("vault", entries));

    await adapter.write("new.md", "# New");

    const created = entries["new.md"];
    expect(created?.kind).toBe("file");
    expect(created && "writes" in created ? created.writes : []).toEqual(["# New"]);
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

type MockFileHandle = FileSystemFileHandle & { writes: string[] };
type MockHandle = MockFileHandle | FileSystemDirectoryHandle;

function fileHandle(name: string, content: string): MockFileHandle {
  const writes: string[] = [];
  return {
    async createWritable() {
      return {
        async close() {
          return undefined;
        },
        async write(data: FileSystemWriteChunkType) {
          writes.push(String(data));
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
    writes,
  } as unknown as MockFileHandle;
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
      if (!handle) {
        const created = fileHandle(entryName, "");
        entriesByName[entryName] = created;
        return created;
      }

      if (handle.kind !== "file") {
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
