"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { MarkdownView } from "@/components/markdown/MarkdownView";
import { UploadPrompt } from "@/components/document/UploadPrompt";
import { useToast } from "@/components/ui/Toast";
import { createDownloadAdapter } from "@/lib/fs/download-adapter";
import { restoreFSAccessDirectory } from "@/lib/fs/fs-access-adapter";
import { extractMarkdownHeadings } from "@/lib/markdown/headings";
import { getDownloadFilename } from "@/lib/editor/download";
import { useDocumentStore } from "@/lib/store/document";
import { useT } from "@/lib/i18n";

const EditorPane = dynamic(
  () => import("@/components/editor/EditorPane").then((m) => ({ default: m.EditorPane })),
  {
    loading: () => <div className="flex-1 animate-pulse bg-[var(--surface)]" />,
    ssr: false,
  },
);

type ActiveTab = "editor" | "preview";

export default function EditPage() {
  const t = useT();
  const [mounted, setMounted] = useState(false);
  const hasHydrated = useDocumentStore((state) => state.hasHydrated);
  const storedMarkdown = useDocumentStore((state) => state.markdown);
  const fileName = useDocumentStore((state) => state.fileName);
  const frontmatter = useDocumentStore((state) => state.frontmatter);
  const source = useDocumentStore((state) => state.source);
  const updateMarkdown = useDocumentStore((state) => state.updateMarkdown);
  const { pushToast } = useToast();

  const [content, setContent] = useState("");
  const [initialized, setInitialized] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>("editor");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (hasHydrated && storedMarkdown) {
      setContent(storedMarkdown);
      setInitialized(true);
    }
  }, [hasHydrated, storedMarkdown]);

  const isDirty = initialized && content !== storedMarkdown;

  useEffect(() => {
    const base = fileName ?? "Untitled";
    document.title = isDirty ? `● ${base} — Markdown Reader Pro` : `${base} — Markdown Reader Pro`;
    return () => {
      document.title = "Markdown Reader Pro";
    };
  }, [isDirty, fileName]);

  useEffect(() => {
    if (!isDirty) return;
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault();
    }
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const isFsAccessDocument = source?.adapterType === "fsaccess";
  const saveLabel = isFsAccessDocument ? t.edit.save : t.edit.download;
  const secondaryLabel = isFsAccessDocument ? t.edit.saveCopy : undefined;

  const handleDownload = useCallback(() => {
    const name = getDownloadFilename(frontmatter?.title, fileName);
    void createDownloadAdapter().write(name, content);
  }, [content, fileName, frontmatter?.title]);

  const handleSave = useCallback(async () => {
    if (!source || source.adapterType !== "fsaccess") {
      handleDownload();
      return;
    }

    setIsSaving(true);
    try {
      const result = await restoreFSAccessDirectory();

      if (result.status !== "restored") {
        pushToast({
          description: t.edit.toast.saveFailed.authExpired,
          title: t.edit.toast.saveFailed.title,
        });
        return;
      }

      await result.adapter.write(source.path, content);
      updateMarkdown(content);
      pushToast({
        description: t.edit.toast.saved.desc(source.path),
        title: t.edit.toast.saved.title,
      });
    } catch (error) {
      pushToast({
        description:
          error instanceof Error
            ? error.message
            : t.edit.toast.saveFailed.unknown,
        title: t.edit.toast.saveFailed.title,
      });
    } finally {
      setIsSaving(false);
    }
  }, [content, handleDownload, pushToast, source, t, updateMarkdown]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        void handleSave();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSave]);

  const headings = useMemo(() => extractMarkdownHeadings(content), [content]);

  if (!mounted) return null;
  if (!storedMarkdown) return <UploadPrompt />;

  const displayName = fileName ?? "Untitled";

  return (
    <main className="warmth-theme flex h-[calc(100vh-64px)] flex-col">
      <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-2">
        <p className="min-w-0 truncate text-sm font-medium text-[var(--foreground)]">
          {isDirty ? (
            <span className="mr-1.5 text-[var(--accent)]">●</span>
          ) : null}
          {displayName}
        </p>
        <button
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[var(--border-strong)] bg-[var(--surface-strong)] px-4 py-1.5 text-xs font-semibold transition hover:bg-[var(--surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
          disabled={isSaving}
          onClick={() => void handleSave()}
          title={`${saveLabel}  (⌘S / Ctrl+S)`}
          type="button"
        >
          <DownloadIcon />
          {isSaving ? t.edit.saving : saveLabel}
        </button>
        {secondaryLabel ? (
          <button
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[var(--border-strong)] px-4 py-1.5 text-xs font-semibold text-[var(--muted-foreground)] transition hover:bg-[var(--surface)] hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
            onClick={handleDownload}
            title="Download a copy"
            type="button"
          >
            <DownloadIcon />
            {secondaryLabel}
          </button>
        ) : null}
      </div>

      <div className="flex border-b border-[var(--border)] md:hidden">
        <TabButton
          active={activeTab === "editor"}
          onClick={() => setActiveTab("editor")}
        >
          {t.edit.tab.editor}
        </TabButton>
        <TabButton
          active={activeTab === "preview"}
          onClick={() => setActiveTab("preview")}
        >
          {t.edit.tab.preview}
        </TabButton>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div
          className={[
            "flex-1 overflow-auto border-r border-[var(--border)]",
            activeTab === "editor" ? "flex" : "hidden",
            "md:flex",
          ].join(" ")}
        >
          <div className="w-full [&_.cm-editor]:h-full [&_.cm-editor]:min-h-full [&_.cm-scroller]:flex-1">
            <EditorPane value={content} onChange={setContent} />
          </div>
        </div>

        <div
          className={[
            "flex-1 overflow-auto bg-[var(--background)]",
            activeTab === "preview" ? "flex" : "hidden",
            "md:flex",
          ].join(" ")}
        >
          <div className="mx-auto w-full max-w-3xl px-6 py-8">
            <MarkdownView headings={headings} markdown={content} />
          </div>
        </div>
      </div>
    </main>
  );
}

interface TabButtonProps {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}

function TabButton({ active, children, onClick }: TabButtonProps) {
  return (
    <button
      className={[
        "flex-1 py-3 text-sm font-semibold transition",
        active
          ? "border-b-2 border-[var(--accent)] text-[var(--accent)]"
          : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]",
      ].join(" ")}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

function DownloadIcon() {
  return (
    <svg
      className="h-3.5 w-3.5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 4v11" />
    </svg>
  );
}
