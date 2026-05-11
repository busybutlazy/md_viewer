"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { useToast } from "@/components/ui/Toast";
import { getRouteByDocumentMode } from "@/lib/document-routes";
import { createUploadAdapterFromFile } from "@/lib/fs/upload-adapter";
import { useDocumentStore } from "@/lib/store/document";
import { useExamSessionStore } from "@/lib/store/exam-session";
import { useT } from "@/lib/i18n";

const ACCEPTED_EXTENSIONS = [".md", ".markdown", ".txt"];

export function UploadPanel() {
  const t = useT();
  const clearExamSession = useExamSessionStore((state) => state.clearSession);
  const loadDocumentFromAdapter = useDocumentStore((state) => state.loadDocumentFromAdapter);
  const { pushToast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const toast = searchParams.get("toast");
    if (toast !== "missing-document") return;
    pushToast({ description: t.upload.toast.notFound.desc, title: t.upload.toast.notFound.title });
    router.replace("/");
  }, [pushToast, router, searchParams, t]);

  const dropzone = useDropzone({
    accept: {
      "text/markdown": ACCEPTED_EXTENSIONS,
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
      pushToast({ description: t.upload.toast.success.desc(file.name), title: t.upload.toast.success.title });
      router.push(getRouteByDocumentMode(nextMode));
    },
    onDropRejected: () => {
      pushToast({ description: t.upload.toast.rejected.desc, title: t.upload.toast.rejected.title });
    },
  });

  return (
    <div
      {...dropzone.getRootProps()}
      className="relative overflow-hidden"
      style={{
        aspectRatio: "4 / 3.4",
        borderRadius: "var(--radius-xl)",
        border: "1.5px dashed var(--border-strong)",
        background: `
          radial-gradient(ellipse 80% 50% at 50% 100%, var(--accent-soft), transparent 70%),
          repeating-linear-gradient(135deg, var(--accent-soft) 0 12px, transparent 12px 24px),
          var(--surface-warm)
        `,
        cursor: "pointer",
      }}
    >
      <input {...dropzone.getInputProps()} />

      {/* Stage label */}
      <div className="absolute left-6 top-6 flex items-center gap-2">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.5" className="text-[var(--muted-foreground)]" />
          <path d="M6 3v3l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-[var(--muted-foreground)]" />
        </svg>
        <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--muted-foreground)]">
          {dropzone.isDragActive ? t.upload.release : t.upload.formats}
        </span>
      </div>

      {/* Stacked preview cards */}
      <div className="absolute inset-6 top-16">
        {/* Card 1 */}
        <div
          className="absolute"
          style={{
            top: "6%", left: "0%", width: "78%",
            transform: "rotate(-3deg)",
          }}
        >
          <div
            className="border border-[var(--border)] bg-[var(--surface)] p-4"
            style={{
              borderRadius: "var(--radius-lg)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <div className="mb-2 flex items-center gap-2 font-mono text-[11px] text-[var(--muted-foreground)]">
              <span className="rounded bg-[var(--accent-soft)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--accent-strong)]">.md</span>
              reading-sample.md
            </div>
            <h4 className="mb-1 font-serif text-[17px] font-medium leading-tight">深度閱讀指南</h4>
            <p className="text-[11px] leading-[1.55] text-[var(--ink-soft)]">以連貫方式閱讀長篇文件...</p>
          </div>
        </div>

        {/* Card 2 */}
        <div
          className="absolute"
          style={{
            top: "32%", left: "18%", width: "78%",
            transform: "rotate(1.5deg)",
          }}
        >
          <div
            className="border border-[var(--border)] bg-[var(--surface)] p-4"
            style={{
              borderRadius: "var(--radius-lg)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <div className="mb-2 flex items-center gap-2 font-mono text-[11px] text-[var(--muted-foreground)]">
              <span className="rounded bg-[var(--accent-soft)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--accent-strong)]">.md</span>
              exam-sample.md
            </div>
            <h4 className="mb-1 font-serif text-[17px] font-medium leading-tight">JavaScript 考題精選</h4>
            <p className="text-[11px] leading-[1.55] text-[var(--ink-soft)]">25 道單/多選自動批改...</p>
          </div>
        </div>

        {/* Card 3 */}
        <div
          className="absolute"
          style={{
            top: "58%", left: "5%", width: "78%",
            transform: "rotate(-1deg)",
          }}
        >
          <div
            className="border border-[var(--border)] bg-[var(--surface)] p-4"
            style={{
              borderRadius: "var(--radius-lg)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <div className="mb-2 flex items-center gap-2 font-mono text-[11px] text-[var(--muted-foreground)]">
              <span className="rounded bg-[var(--accent-soft)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--accent-strong)]">.md</span>
              slides-sample.md
            </div>
            <h4 className="mb-1 font-serif text-[17px] font-medium leading-tight">產品發布簡報</h4>
            <p className="text-[11px] leading-[1.55] text-[var(--ink-soft)]">8 張投影片含講者備忘...</p>
          </div>
        </div>
      </div>

      {/* Drop instruction pill */}
      <div
        className="absolute bottom-5 right-5 flex items-center gap-2 font-semibold"
        style={{
          padding: "8px 14px",
          borderRadius: "999px",
          background: "var(--foreground)",
          color: "var(--background)",
          fontSize: "12px",
          boxShadow: "0 12px 30px rgba(26,23,18,0.2)",
        }}
      >
        <UploadArrow />
        {t.upload.drag}
      </div>
    </div>
  );
}

function UploadArrow() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  );
}
