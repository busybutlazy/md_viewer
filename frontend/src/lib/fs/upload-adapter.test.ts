import { describe, expect, it, vi } from "vitest";
import { UploadAdapter } from "@/lib/fs/upload-adapter";
import type { FileSystemAdapter } from "@/lib/fs/types";

describe("UploadAdapter", () => {
  it("implements FileSystemAdapter for a single uploaded document", async () => {
    const adapter: FileSystemAdapter = new UploadAdapter({
      content: "# Hello",
      fileName: "hello.md",
    });

    await expect(adapter.list()).resolves.toEqual([
      {
        kind: "file",
        name: "hello.md",
        path: "hello.md",
      },
    ]);
    await expect(adapter.read("hello.md")).resolves.toBe("# Hello");
    await expect(adapter.refresh()).resolves.toBeUndefined();
  });

  it("delegates writes to the download adapter", async () => {
    const write = vi.fn(() => Promise.resolve());
    const adapter = new UploadAdapter({
      content: "# Draft",
      fileName: "draft.md",
      writeAdapter: { write },
    });

    await adapter.write("draft.md", "# Updated");

    expect(write).toHaveBeenCalledWith("draft.md", "# Updated");
  });

  it("rejects paths outside the uploaded document", async () => {
    const adapter = new UploadAdapter({
      content: "# Hello",
      fileName: "hello.md",
    });

    await expect(adapter.read("other.md")).rejects.toThrow(
      'UploadAdapter cannot access "other.md".',
    );
  });
});
