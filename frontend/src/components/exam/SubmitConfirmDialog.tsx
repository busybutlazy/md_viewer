"use client";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface SubmitConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  unansweredNumbers: number[];
}

export function SubmitConfirmDialog({
  isOpen,
  onClose,
  onSubmit,
  unansweredNumbers,
}: SubmitConfirmDialogProps) {
  return (
    <div
      aria-hidden={!isOpen}
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 transition",
        isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <div
        aria-describedby="submit-dialog-description"
        aria-labelledby="submit-dialog-title"
        aria-modal="true"
        className="w-full max-w-xl rounded-[2rem] border border-[var(--border-strong)] bg-[var(--surface-strong)] p-6 shadow-[var(--shadow-soft)]"
        role="dialog"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold" id="submit-dialog-title">
              Submit Exam
            </h2>
            <p
              className="text-sm leading-7 text-[var(--muted-foreground)]"
              id="submit-dialog-description"
            >
              {unansweredNumbers.length === 0
                ? "所有題目都已作答，提交後會直接進入結果頁。"
                : "以下題目尚未作答。你可以先跳轉檢查，也可以直接提交。"}
            </p>
          </div>
          <Button aria-label="Close dialog" className="px-4" onClick={onClose} variant="ghost">
            Close
          </Button>
        </div>
        {unansweredNumbers.length > 0 ? (
          <div className="mt-5 rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-4">
            <p className="text-sm font-semibold">未作答題號</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {unansweredNumbers.map((number) => (
                <a
                  className="rounded-full border border-[var(--border)] px-3 py-1 text-sm text-[var(--muted-foreground)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
                  href={`#question-${number}`}
                  key={number}
                  onClick={onClose}
                >
                  Q{number}
                </a>
              ))}
            </div>
          </div>
        ) : null}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button onClick={onClose} variant="secondary">
            Continue Editing
          </Button>
          <Button onClick={onSubmit}>Submit Now</Button>
        </div>
      </div>
    </div>
  );
}
