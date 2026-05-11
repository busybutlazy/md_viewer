import type { FSAccessAdapter } from "@/lib/fs/fs-access-adapter";

let _adapter: FSAccessAdapter | undefined;
let _documentPath: string | undefined;
const _cache = new Map<string, string>();

export function setImageAdapter(
  adapter: FSAccessAdapter | undefined,
  documentPath: string | undefined,
): void {
  clearImageCache();
  _adapter = adapter;
  _documentPath = documentPath;
}

export function clearImageCache(): void {
  if (typeof URL !== "undefined" && typeof URL.revokeObjectURL === "function") {
    for (const url of _cache.values()) {
      URL.revokeObjectURL(url);
    }
  }
  _cache.clear();
}

export function isRelativeImageSrc(src: string): boolean {
  return (
    !src.startsWith("http://") &&
    !src.startsWith("https://") &&
    !src.startsWith("data:") &&
    !src.startsWith("/")
  );
}

export async function resolveImageUrl(src: string): Promise<string | null> {
  if (!_adapter || !isRelativeImageSrc(src)) return null;
  if (typeof URL === "undefined" || typeof URL.createObjectURL === "undefined") return null;

  if (_cache.has(src)) return _cache.get(src)!;

  const docDir = _documentPath
    ? _documentPath.split("/").slice(0, -1).join("/")
    : "";
  const resolvedPath = resolveRelativePath(docDir, src);

  try {
    const blob = await _adapter.readBlob(resolvedPath);
    const url = URL.createObjectURL(blob);
    _cache.set(src, url);
    return url;
  } catch {
    return null;
  }
}

function resolveRelativePath(docDir: string, src: string): string {
  const base = docDir ? docDir.split("/") : [];
  const parts = src.replace(/^\.\//, "").split("/");
  const segments = [...base];

  for (const part of parts) {
    if (part === "..") {
      segments.pop();
    } else if (part !== ".") {
      segments.push(part);
    }
  }

  return segments.join("/");
}
