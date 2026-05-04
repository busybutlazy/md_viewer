export type FileSystemAdapterType = "upload" | "fsaccess" | "node";

export type FileNodeKind = "file" | "directory";

export interface FileNode {
  children?: FileNode[];
  kind: FileNodeKind;
  name: string;
  path: string;
}

export type FileEventType = "created" | "updated" | "deleted";

export interface FileEvent {
  path: string;
  type: FileEventType;
}

export interface FileSystemAdapter {
  type: FileSystemAdapterType;
  list(): Promise<FileNode[]>;
  read(path: string): Promise<string>;
  write(path: string, content: string): Promise<void>;
  create(path: string): Promise<void>;
  delete(path: string): Promise<void>;
  watch?(callback: (events: FileEvent[]) => void): () => void;
  refresh(): Promise<void>;
}
