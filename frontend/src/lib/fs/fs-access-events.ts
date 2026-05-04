export const FS_ACCESS_CHANGED_EVENT = "mrp:fs-access-changed";

export function notifyFSAccessChanged(): void {
  window.dispatchEvent(new Event(FS_ACCESS_CHANGED_EVENT));
}

export function subscribeToFSAccessChanged(callback: () => void): () => void {
  window.addEventListener(FS_ACCESS_CHANGED_EVENT, callback);
  return () => window.removeEventListener(FS_ACCESS_CHANGED_EVENT, callback);
}
