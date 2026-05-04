"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { getRouteByDocumentMode } from "@/components/home/UploadPanel";
import {
  createUploadAdapterFromFile,
  createUploadAdapterFromMarkdown,
} from "@/lib/fs/upload-adapter";
import { useDocumentStore } from "@/lib/store/document";
import { useExamSessionStore } from "@/lib/store/exam-session";

const SAMPLES = [
  { fileName: "reading-sample.md", label: "React 19 閱讀深潛", mode: "Read" },
  { fileName: "exam-sample.md", label: "JavaScript 小測", mode: "Exam" },
  { fileName: "slides-sample.md", label: "Product Deck", mode: "Slides" },
];

export function UploadPrompt() {
  const router = useRouter();
  const { pushToast } = useToast();
  const loadDocumentFromAdapter = useDocumentStore((state) => state.loadDocumentFromAdapter);
  const clearExamSession = useExamSessionStore((state) => state.clearSession);
  const [loadingSample, setLoadingSample] = useState<string | null>(null);

  async function handleMarkdown(fileName: string, markdown: string) {
    const adapter = createUploadAdapterFromMarkdown(fileName, markdown);
    clearExamSession();
    const nextMode = await loadDocumentFromAdapter(adapter);
    router.push(getRouteByDocumentMode(nextMode));
  }

  const dropzone = useDropzone({
    accept: {
      "text/markdown": [".md", ".markdown"],
      "text/plain": [".txt"],
    },
    maxFiles: 1,
    multiple: false,
    onDropAccepted: async (files) => {
      const [file] = files;
      if (!file) return;
      const adapter = createUploadAdapterFromFile(file);
      clearExamSession();
      const nextMode = await loadDocumentFromAdapter(adapter);
      router.push(getRouteByDocumentMode(nextMode));
    },
    onDropRejected: () => {
      pushToast({
        description: "只接受 .md、.markdown、.txt 檔案。",
        title: "Unsupported file type",
      });
    },
  });

  async function handleSample(fileName: string) {
    setLoadingSample(fileName);
    try {
      const res = await fetch(`/samples/${fileName}`);
      const markdown = await res.text();
      await handleMarkdown(fileName, markdown);
    } finally {
      setLoadingSample(null);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg space-y-10">

        {/* Heading */}
        <div className="space-y-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--accent-strong)]">
            No document loaded
          </p>
          <h2 className="text-3xl font-semibold tracking-tight">
            Upload a markdown file
          </h2>
          <p className="text-sm leading-7 text-[var(--muted-foreground)]">
            Drop a .md file and the app will automatically route you to Reading,
            Exam, or Slides based on the frontmatter.
          </p>
        </div>

        {/* Drop zone */}
        <div
          {...dropzone.getRootProps()}
          className="cursor-pointer rounded-[2rem] border border-dashed border-[var(--border-strong)] bg-[var(--surface)] p-10 text-center transition hover:border-[var(--accent)] hover:bg-[var(--surface-strong)] focus-within:border-[var(--accent)]"
        >
          <input {...dropzone.getInputProps()} />
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
              <svg
                className="h-7 w-7"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.75}
                viewBox="0 0 24 24"
              >
                <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M16 12l-4-4-4 4M12 8v8" />
              </svg>
            </div>
            <div>
              <p className="font-semibold">
                {dropzone.isDragActive
                  ? "Release to upload"
                  : "Drag & drop your file here"}
              </p>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                Accepts .md · .markdown · .txt
              </p>
            </div>
            <Button variant="secondary">Choose File</Button>
          </div>
        </div>

        {/* Sample shortcuts */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-[var(--border)]" />
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-foreground)]">
              or try a sample
            </p>
            <div className="h-px flex-1 bg-[var(--border)]" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {SAMPLES.map((sample) => (
              <div className="group relative" key={sample.fileName}>
                <button
                  className="w-full rounded-2xl border border-[var(--border-strong)] bg-[var(--surface)] px-3 pb-4 pt-4 text-center transition hover:border-[var(--accent)] hover:bg-[var(--surface-strong)] disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={loadingSample !== null}
                  onClick={() => void handleSample(sample.fileName)}
                  type="button"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent-strong)]">
                    {sample.mode}
                  </p>
                  <p className="mt-1.5 text-sm font-medium text-[var(--foreground)]">
                    {sample.label}
                  </p>
                </button>
                <a
                  className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-lg text-[var(--muted-foreground)] opacity-0 transition hover:text-[var(--foreground)] group-hover:opacity-100"
                  download={sample.fileName}
                  href={`/samples/${sample.fileName}`}
                  onClick={(e) => e.stopPropagation()}
                  title="Download sample file"
                >
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} viewBox="0 0 24 24">
                    <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 4v11" />
                  </svg>
                </a>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
