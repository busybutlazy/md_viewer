"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import {
  chooseFSAccessDirectory,
  clearPersistedFSAccessDirectory,
  restoreFSAccessDirectory,
} from "@/lib/fs/fs-access-adapter";
import {
  notifyFSAccessChanged,
  subscribeToFSAccessChanged,
} from "@/lib/fs/fs-access-events";
import { useDocumentStore } from "@/lib/store/document";
import { useExamSessionStore } from "@/lib/store/exam-session";
import { useFolderSessionStore } from "@/lib/store/folder-session";
import { useSlidesSessionStore } from "@/lib/store/slides-session";

export function FolderAccessStatus() {
  const [folderName, setFolderName] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const clearDocument = useDocumentStore((state) => state.clearDocument);
  const clearExamSession = useExamSessionStore((state) => state.clearSession);
  const closeDrawer = useFolderSessionStore((state) => state.closeDrawer);
  const resetSlidesSession = useSlidesSessionStore((state) => state.resetSession);
  const router = useRouter();
  const { pushToast } = useToast();

  useEffect(() => {
    let cancelled = false;

    async function refreshStatus() {
      const result = await restoreFSAccessDirectory();

      if (cancelled) {
        return;
      }

      setFolderName(result.status === "restored" ? result.adapter.rootName : null);
    }

    void refreshStatus();
    const unsubscribe = subscribeToFSAccessChanged(() => void refreshStatus());

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  if (!folderName) {
    return null;
  }

  async function handleSwitchFolder() {
    setIsBusy(true);
    try {
      const adapter = await chooseFSAccessDirectory();
      if (!adapter) {
        return;
      }

      setFolderName(adapter.rootName);
      setIsOpen(false);
      notifyFSAccessChanged();
      pushToast({
        description: `已切換到 ${adapter.rootName}。`,
        title: "Folder switched",
      });
      router.push("/");
    } finally {
      setIsBusy(false);
    }
  }

  async function handleClearFolder() {
    setIsBusy(true);
    try {
      await clearPersistedFSAccessDirectory();
      clearDocument();
      clearExamSession();
      resetSlidesSession();
      closeDrawer();
      setFolderName(null);
      setIsOpen(false);
      notifyFSAccessChanged();
      pushToast({
        description: "資料夾授權已清除；下次使用需要重新選擇資料夾。",
        title: "Folder permission cleared",
      });
      router.push("/");
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <div className="relative">
      <button
        aria-expanded={isOpen}
        className="inline-flex min-h-11 max-w-64 items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--surface-strong)] px-4 text-sm font-semibold transition hover:bg-[var(--surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
        onClick={() => setIsOpen((value) => !value)}
        type="button"
      >
        <span className="truncate">Folder: {folderName}</span>
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl border border-[var(--border-strong)] bg-[var(--surface-strong)] p-2 shadow-[var(--shadow-soft)]">
          <Button
            className="w-full justify-start rounded-xl"
            disabled={isBusy}
            onClick={() => void handleSwitchFolder()}
            variant="ghost"
          >
            Switch folder
          </Button>
          <Button
            className="mt-1 w-full justify-start rounded-xl text-red-600 dark:text-red-300"
            disabled={isBusy}
            onClick={() => void handleClearFolder()}
            variant="ghost"
          >
            Clear permission
          </Button>
        </div>
      ) : null}
    </div>
  );
}
