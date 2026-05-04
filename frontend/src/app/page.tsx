import { Suspense } from "react";
import { NewDocumentDialog } from "@/components/home/NewDocumentDialog";
import { SampleCards } from "@/components/home/SampleCards";
import { UploadPanel } from "@/components/home/UploadPanel";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <section className="mb-14">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.32em] text-[var(--accent-strong)]">
          Read · Exam · Slides
        </p>
        <h1 className="mb-5 text-5xl font-semibold tracking-tight text-balance sm:text-6xl">
          Markdown Reader Pro
        </h1>
        <p className="max-w-md text-base leading-8 text-[var(--muted-foreground)]">
          一份 markdown，上傳後依 frontmatter 自動切換成閱讀、考試或簡報模式。
        </p>
      </section>

      <section className="mb-14 space-y-4">
        <Suspense fallback={null}>
          <UploadPanel />
        </Suspense>
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-[var(--border)]" />
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-foreground)]">
            or start from scratch
          </p>
          <div className="h-px flex-1 bg-[var(--border)]" />
        </div>
        <div className="flex justify-center">
          <NewDocumentDialog />
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent-strong)]">
            Sample Files
          </p>
          <h2 className="text-2xl font-semibold tracking-tight">
            三種模式的正式範例
          </h2>
        </div>
        <SampleCards />
      </section>

      <footer className="mt-16 border-t border-[var(--border)] pt-8 text-xs text-[var(--muted-foreground)]">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p>Markdown Reader Pro · Phase 1</p>
          <p className="font-mono opacity-50">docker compose up</p>
        </div>
      </footer>
    </main>
  );
}
