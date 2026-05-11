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
import { useT } from "@/lib/i18n";

export function FolderAccessStatus() {
  const t = useT();
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
      if (cancelled) return;
      setFolderName(result.status === "restored" ? result.adapter.rootName : null);
    }
    void refreshStatus();
    const unsubscribe = subscribeToFSAccessChanged(() => void refreshStatus());
    return () => { cancelled = true; unsubscribe(); };
  }, []);

  if (!folderName) return null;

  async function handleSwitchFolder() {
    setIsBusy(true);
    try {
      const adapter = await chooseFSAccessDirectory();
      if (!adapter) return;
      setFolderName(adapter.rootName);
      setIsOpen(false);
      notifyFSAccessChanged();
      pushToast({ description: t.folderStatus.toast.switched.desc(adapter.rootName), title: t.folderStatus.toast.switched.title });
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
      pushToast({ description: t.folderStatus.toast.cleared.desc, title: t.folderStatus.toast.cleared.title });
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
        onClick={() => setIsOpen((v) => !v)}
        type="button"
      >
        <span className="truncate">{t.folderStatus.label(folderName)}</span>
      </button>
      {isOpen ? (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-[var(--radius-xl)] border border-[var(--border-strong)] bg-[var(--surface-strong)] p-2 shadow-[var(--shadow-soft)]">
          <Button className="w-full justify-start rounded-[var(--radius-md)]" disabled={isBusy} onClick={() => void handleSwitchFolder()} variant="ghost">
            {t.folderStatus.switch}
          </Button>
          <Button className="mt-1 w-full justify-start rounded-[var(--radius-md)] text-red-600 dark:text-red-300" disabled={isBusy} onClick={() => void handleClearFolder()} variant="ghost">
            {t.folderStatus.clear}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
