import { downloadMarkdown } from "@/lib/editor/download";

export class DownloadAdapter {
  async write(path: string, content: string): Promise<void> {
    downloadMarkdown(content, path);
  }
}

export function createDownloadAdapter(): DownloadAdapter {
  return new DownloadAdapter();
}
