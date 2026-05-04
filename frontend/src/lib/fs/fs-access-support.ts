interface FSAccessWindow extends Window {
  showDirectoryPicker?: (options?: { mode?: "read" | "readwrite" }) => Promise<FileSystemDirectoryHandle>;
}

export function isFileSystemAccessSupported(win: Window | undefined = globalThis.window): boolean {
  return Boolean(win && "showDirectoryPicker" in win);
}

export function getFileSystemAccessWindow(
  win: Window | undefined = globalThis.window,
): FSAccessWindow | undefined {
  if (!win || !isFileSystemAccessSupported(win)) {
    return undefined;
  }

  return win as FSAccessWindow;
}
