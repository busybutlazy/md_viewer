import { createDownloadAdapter, type DownloadAdapter } from "@/lib/fs/download-adapter";
import type { FileNode, FileSystemAdapter } from "@/lib/fs/types";

interface UploadAdapterOptions {
  content?: string;
  file?: File;
  fileName: string;
  writeAdapter?: DownloadAdapter;
}

export class UploadAdapter implements FileSystemAdapter {
  readonly type = "upload" as const;

  private content?: string;
  private readonly file?: File;
  private readonly fileName: string;
  private readonly writeAdapter: DownloadAdapter;

  constructor({ content, file, fileName, writeAdapter = createDownloadAdapter() }: UploadAdapterOptions) {
    this.content = content;
    this.file = file;
    this.fileName = fileName;
    this.writeAdapter = writeAdapter;
  }

  async list(): Promise<FileNode[]> {
    return [
      {
        kind: "file",
        name: this.fileName,
        path: this.fileName,
      },
    ];
  }

  async read(path: string): Promise<string> {
    this.assertKnownPath(path);

    if (this.content !== undefined) {
      return this.content;
    }

    if (!this.file) {
      return "";
    }

    this.content = await this.file.text();
    return this.content;
  }

  async write(path: string, content: string): Promise<void> {
    this.assertKnownPath(path);
    await this.writeAdapter.write(path, content);
  }

  async create(path: string): Promise<void> {
    this.assertKnownPath(path);
  }

  async delete(path: string): Promise<void> {
    this.assertKnownPath(path);
    this.content = "";
  }

  async refresh(): Promise<void> {
    return Promise.resolve();
  }

  private assertKnownPath(path: string): void {
    if (path !== this.fileName) {
      throw new Error(`UploadAdapter cannot access "${path}".`);
    }
  }
}

export function createUploadAdapterFromFile(file: File): UploadAdapter {
  return new UploadAdapter({ file, fileName: file.name });
}

export function createUploadAdapterFromMarkdown(fileName: string, content: string): UploadAdapter {
  return new UploadAdapter({ content, fileName });
}
