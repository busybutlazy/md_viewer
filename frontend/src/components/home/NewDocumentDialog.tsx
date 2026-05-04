"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { createUploadAdapterFromMarkdown } from "@/lib/fs/upload-adapter";
import { TEMPLATES } from "@/lib/templates";
import { useDocumentStore } from "@/lib/store/document";
import { useExamSessionStore } from "@/lib/store/exam-session";

export function NewDocumentDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const titleId = useId();
  const router = useRouter();
  const loadDocumentFromAdapter = useDocumentStore((state) => state.loadDocumentFromAdapter);
  const clearExamSession = useExamSessionStore((state) => state.clearSession);

  async function handleSelect(fileName: string, markdown: string) {
    const adapter = createUploadAdapterFromMarkdown(fileName, markdown);
    clearExamSession();
    await loadDocumentFromAdapter(adapter);
    setIsOpen(false);
    router.push("/edit");
  }

  return (
    <>
      <button
        className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--surface-strong)] px-5 text-sm font-semibold transition hover:bg-[var(--surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
        onClick={() => setIsOpen(true)}
        type="button"
      >
        <PlusIcon />
        <span className="ml-1.5">New .md</span>
      </button>

      {isOpen ? (
        <div
          aria-hidden={false}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <div
            aria-labelledby={titleId}
            aria-modal="true"
            className="w-full max-w-lg rounded-[2rem] border border-[var(--border-strong)] bg-[var(--surface-strong)] p-6 shadow-[var(--shadow-soft)]"
            role="dialog"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold" id={titleId}>
                  新建 Markdown 檔
                </h2>
                <p className="mt-1 text-sm leading-7 text-[var(--muted-foreground)]">
                  選擇範本，直接進入編輯器。
                </p>
              </div>
              <button
                aria-label="Close dialog"
                className="rounded-xl p-2 text-[var(--muted-foreground)] transition hover:bg-[var(--surface)] hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                onClick={() => setIsOpen(false)}
                type="button"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {TEMPLATES.map((t) => (
                <button
                  className="flex flex-col items-start rounded-2xl border border-[var(--border-strong)] bg-[var(--surface)] px-4 py-4 text-left transition hover:border-[var(--accent)] hover:bg-[var(--background)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                  key={t.fileName}
                  onClick={() => void handleSelect(t.fileName, t.markdown)}
                  type="button"
                >
                  <p className="text-sm font-semibold text-[var(--foreground)]">
                    {t.label}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-[var(--muted-foreground)]">
                    {t.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function PlusIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}
