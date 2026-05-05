import { getFileSystemAccessWindow } from "@/lib/fs/fs-access-support";
import {
  clearDirectoryHandle,
  loadDirectoryHandle,
  saveDirectoryHandle,
} from "@/lib/fs/fs-access-idb";
import type { FileNode, FileSystemAdapter } from "@/lib/fs/types";

const MARKDOWN_EXTENSIONS = [".md", ".markdown"];
const IGNORED_DIRECTORY_NAMES = new Set(["node_modules"]);

type PermissionStateResult = "granted" | "denied" | "prompt";
type IterableDirectoryHandle = FileSystemDirectoryHandle & {
  entries(): AsyncIterableIterator<[string, FileSystemHandle]>;
};

interface PermissionHandle {
  queryPermission?: (descriptor?: { mode?: "read" | "readwrite" }) => Promise<PermissionStateResult>;
  requestPermission?: (descriptor?: { mode?: "read" | "readwrite" }) => Promise<PermissionStateResult>;
}

export type RestoreFSAccessResult =
  | { adapter: FSAccessAdapter; status: "restored" }
  | { reason: "not-supported" | "missing-handle" | "permission-denied"; status: "unavailable" }
  | { folderName: string; reason: "needs-reauth"; status: "unavailable" };

export class FSAccessAdapter implements FileSystemAdapter {
  readonly type = "fsaccess" as const;

  constructor(private readonly rootHandle: FileSystemDirectoryHandle) {}

  get rootName(): string {
    return this.rootHandle.name;
  }

  async list(): Promise<FileNode[]> {
    return this.listDirectory(this.rootHandle, "");
  }

  async read(path: string): Promise<string> {
    const fileHandle = await this.getFileHandle(path);
    const file = await fileHandle.getFile();
    return file.text();
  }

  async write(path: string, content: string): Promise<void> {
    const fileHandle = await this.getFileHandle(path, { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(content);
    await writable.close();
  }

  async create(path: string): Promise<void> {
    const fileHandle = await this.getFileHandle(path, { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write("");
    await writable.close();
  }

  async delete(path: string): Promise<void> {
    const { fileName, parent } = await this.getParentDirectory(path);
    await parent.removeEntry(fileName);
  }

  async refresh(): Promise<void> {
    return Promise.resolve();
  }

  async ensureReadWritePermission(): Promise<boolean> {
    return ensureReadWritePermission(this.rootHandle);
  }

  private async listDirectory(
    directory: FileSystemDirectoryHandle,
    basePath: string,
  ): Promise<FileNode[]> {
    const nodes: FileNode[] = [];

    const iterableDirectory = directory as IterableDirectoryHandle;

    for await (const [name, handle] of iterableDirectory.entries()) {
      if (shouldIgnoreEntry(name)) {
        continue;
      }

      const path = basePath ? `${basePath}/${name}` : name;

      if (handle.kind === "file") {
        if (isMarkdownFile(name)) {
          nodes.push({ kind: "file", name, path });
        }
        continue;
      }

      if (IGNORED_DIRECTORY_NAMES.has(name)) {
        continue;
      }

      const children = await this.listDirectory(
        handle as FileSystemDirectoryHandle,
        path,
      );
      if (children.length > 0) {
        nodes.push({ children, kind: "directory", name, path });
      }
    }

    return nodes.sort(compareFileNodes);
  }

  private async getFileHandle(
    path: string,
    options?: { create?: boolean },
  ): Promise<FileSystemFileHandle> {
    const { fileName, parent } = await this.getParentDirectory(path, options);
    return parent.getFileHandle(fileName, options);
  }

  private async getParentDirectory(
    path: string,
    options?: { create?: boolean },
  ): Promise<{ fileName: string; parent: FileSystemDirectoryHandle }> {
    const parts = path.split("/").filter(Boolean);
    const fileName = parts.pop();

    if (!fileName) {
      throw new Error("Path must include a file name.");
    }

    let parent = this.rootHandle;
    for (const part of parts) {
      parent = await parent.getDirectoryHandle(part, options);
    }

    return { fileName, parent };
  }
}

export async function chooseFSAccessDirectory(): Promise<FSAccessAdapter | undefined> {
  const fsWindow = getFileSystemAccessWindow();
  if (!fsWindow?.showDirectoryPicker) {
    return undefined;
  }

  const handle = await fsWindow.showDirectoryPicker({ mode: "readwrite" });
  const permitted = await ensureReadWritePermission(handle);

  if (!permitted) {
    return undefined;
  }

  await saveDirectoryHandle(handle);
  return new FSAccessAdapter(handle);
}

export async function restoreFSAccessDirectory(): Promise<RestoreFSAccessResult> {
  if (!getFileSystemAccessWindow()) {
    return { reason: "not-supported", status: "unavailable" };
  }

  const handle = await loadDirectoryHandle();
  if (!handle) {
    return { reason: "missing-handle", status: "unavailable" };
  }

  const permissionHandle = handle as PermissionHandle;
  const descriptor = { mode: "readwrite" as const };
  const current = await permissionHandle.queryPermission?.(descriptor);

  if (current === "granted") {
    return { adapter: new FSAccessAdapter(handle), status: "restored" };
  }

  if (current === "denied") {
    await clearDirectoryHandle();
    return { reason: "permission-denied", status: "unavailable" };
  }

  // "prompt" — handle is still valid but requestPermission needs a user gesture
  return { folderName: handle.name, reason: "needs-reauth", status: "unavailable" };
}

export async function reauthorizeFSAccessDirectory(): Promise<FSAccessAdapter | undefined> {
  const handle = await loadDirectoryHandle();
  if (!handle) {
    return undefined;
  }

  const permitted = await ensureReadWritePermission(handle);
  if (!permitted) {
    await clearDirectoryHandle();
    return undefined;
  }

  return new FSAccessAdapter(handle);
}

export async function clearPersistedFSAccessDirectory(): Promise<void> {
  await clearDirectoryHandle();
}

export function findFirstMarkdownFile(nodes: FileNode[]): FileNode | undefined {
  for (const node of nodes) {
    if (node.kind === "file") {
      return node;
    }

    const child = findFirstMarkdownFile(node.children ?? []);
    if (child) {
      return child;
    }
  }

  return undefined;
}

async function ensureReadWritePermission(handle: FileSystemDirectoryHandle): Promise<boolean> {
  const permissionHandle = handle as PermissionHandle;
  const descriptor = { mode: "readwrite" as const };
  const current = await permissionHandle.queryPermission?.(descriptor);

  if (current === "granted") {
    return true;
  }

  const next = await permissionHandle.requestPermission?.(descriptor);
  return next === "granted";
}

function isMarkdownFile(name: string): boolean {
  const lowerName = name.toLowerCase();
  return MARKDOWN_EXTENSIONS.some((extension) => lowerName.endsWith(extension));
}

function shouldIgnoreEntry(name: string): boolean {
  return name.startsWith(".");
}

function compareFileNodes(a: FileNode, b: FileNode): number {
  if (a.kind !== b.kind) {
    return a.kind === "directory" ? -1 : 1;
  }

  return a.name.localeCompare(b.name);
}
