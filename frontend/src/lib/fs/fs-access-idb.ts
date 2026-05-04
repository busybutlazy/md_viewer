const DB_NAME = "markdown-reader-pro-fs-access";
const STORE_NAME = "handles";
const DIRECTORY_HANDLE_KEY = "directory";

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE_NAME);
    };
  });
}

async function withStore<T>(
  mode: IDBTransactionMode,
  action: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, mode);
    const request = action(tx.objectStore(STORE_NAME));

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    tx.oncomplete = () => db.close();
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}

export async function saveDirectoryHandle(handle: FileSystemDirectoryHandle): Promise<void> {
  await withStore("readwrite", (store) => store.put(handle, DIRECTORY_HANDLE_KEY));
}

export async function loadDirectoryHandle(): Promise<FileSystemDirectoryHandle | undefined> {
  return withStore("readonly", (store) => store.get(DIRECTORY_HANDLE_KEY));
}

export async function clearDirectoryHandle(): Promise<void> {
  await withStore("readwrite", (store) => store.delete(DIRECTORY_HANDLE_KEY));
}
