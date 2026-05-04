"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { getRouteByDocumentMode } from "@/lib/document-routes";
import {
  chooseFSAccessDirectory,
  findFirstMarkdownFile,
  type FSAccessAdapter,
  restoreFSAccessDirectory,
} from "@/lib/fs/fs-access-adapter";
import {
  notifyFSAccessChanged,
  subscribeToFSAccessChanged,
} from "@/lib/fs/fs-access-events";
import { isFileSystemAccessSupported } from "@/lib/fs/fs-access-support";
import { useDocumentStore } from "@/lib/store/document";
import { useExamSessionStore } from "@/lib/store/exam-session";

export function FolderAccessPanel() {
  const [adapter, setAdapter] = useState<FSAccessAdapter | null>(null);
  const [folderName, setFolderName] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const clearExamSession = useExamSessionStore((state) => state.clearSession);
  const loadDocumentFromAdapter = useDocumentStore((state) => state.loadDocumentFromAdapter);
  const router = useRouter();
  const { pushToast } = useToast();

  useEffect(() => {
    if (!isFileSystemAccessSupported()) {
      setIsSupported(false);
      return;
    }

    let cancelled = false;
    setIsSupported(true);

    async function restore() {
      const result = await restoreFSAccessDirectory();

      if (cancelled) {
        return;
      }

      if (result.status === "restored") {
        setAdapter(result.adapter);
        setFolderName(result.adapter.rootName);
        return;
      }

      if (result.reason === "permission-denied") {
        pushToast({
          description: "資料夾授權已失效，請重新選擇資料夾。",
          title: "Folder permission expired",
        });
      }
    }

    void restore();
    const unsubscribe = subscribeToFSAccessChanged(() => void restore());

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [pushToast]);

  if (isSupported === null) {
    return null;
  }

  if (!isSupported) {
    return (
      <div className="mb-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <p className="text-sm font-semibold text-[var(--foreground)]">
          Upload a single markdown file
        </p>
        <p className="mt-1 text-xs leading-5 text-[var(--muted-foreground)]">
          想要瀏覽整個資料夾？請使用 Chrome 或 Edge。
        </p>
      </div>
    );
  }

  async function handleChooseFolder() {
    setIsLoading(true);

    try {
      const nextAdapter = await chooseFSAccessDirectory();

      if (!nextAdapter) {
        pushToast({
          description: "未取得資料夾讀寫授權。",
          title: "Folder not opened",
        });
        return;
      }

      setAdapter(nextAdapter);
      setFolderName(nextAdapter.rootName);
      notifyFSAccessChanged();
      await openFirstMarkdown(nextAdapter);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleOpenRestoredFolder() {
    if (!adapter) {
      return;
    }

    setIsLoading(true);
    try {
      await openFirstMarkdown(adapter);
    } finally {
      setIsLoading(false);
    }
  }

  async function openFirstMarkdown(nextAdapter: FSAccessAdapter) {
    const nodes = await nextAdapter.list();
    const firstFile = findFirstMarkdownFile(nodes);

    if (!firstFile) {
      pushToast({
        description: "這個資料夾裡沒有 .md 或 .markdown 檔案。",
        title: "No markdown files",
      });
      return;
    }

    clearExamSession();
    const nextMode = await loadDocumentFromAdapter(nextAdapter, firstFile.path);

    pushToast({
      description: `已載入 ${firstFile.path}。`,
      title: "Folder opened",
    });
    router.push(getRouteByDocumentMode(nextMode));
  }

  return (
    <div className="mb-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-[var(--foreground)]">
            {folderName ? `Folder: ${folderName}` : "Open a local folder"}
          </p>
          <p className="mt-1 text-xs leading-5 text-[var(--muted-foreground)]">
            Chrome / Edge can keep folder permission for the next session.
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          {adapter ? (
            <Button
              disabled={isLoading}
              onClick={() => void handleOpenRestoredFolder()}
              variant="secondary"
            >
              Continue
            </Button>
          ) : null}
          <Button disabled={isLoading} onClick={() => void handleChooseFolder()}>
            Choose Folder
          </Button>
        </div>
      </div>
    </div>
  );
}
