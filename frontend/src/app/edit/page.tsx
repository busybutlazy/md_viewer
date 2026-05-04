"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { MarkdownView } from "@/components/markdown/MarkdownView";
import { EditorPane } from "@/components/editor/EditorPane";
import { UploadPrompt } from "@/components/document/UploadPrompt";
import { extractMarkdownHeadings } from "@/lib/markdown/headings";
import { downloadMarkdown, getDownloadFilename } from "@/lib/editor/download";
import { useDocumentStore } from "@/lib/store/document";

type ActiveTab = "editor" | "preview";

export default function EditPage() {
  const hasHydrated = useDocumentStore((state) => state.hasHydrated);
  const storedMarkdown = useDocumentStore((state) => state.markdown);
  const fileName = useDocumentStore((state) => state.fileName);
  const frontmatter = useDocumentStore((state) => state.frontmatter);

  const [content, setContent] = useState("");
  const [initialized, setInitialized] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>("editor");

  useEffect(() => {
    if (hasHydrated && storedMarkdown) {
      setContent(storedMarkdown);
      setInitialized(true);
    }
  }, [hasHydrated, storedMarkdown]);

  const isDirty = initialized && content !== storedMarkdown;

  // Update document.title with dirty indicator
  useEffect(() => {
    const base = fileName ?? "Untitled";
    document.title = isDirty ? `● ${base} — Markdown Reader Pro` : `${base} — Markdown Reader Pro`;
    return () => {
      document.title = "Markdown Reader Pro";
    };
  }, [isDirty, fileName]);

  // Warn before closing tab when dirty
  useEffect(() => {
    if (!isDirty) return;
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault();
    }
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const handleDownload = useCallback(() => {
    const name = getDownloadFilename(frontmatter?.title, fileName);
    downloadMarkdown(content, name);
  }, [content, fileName, frontmatter?.title]);

  // Cmd/Ctrl+S triggers download
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        handleDownload();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleDownload]);

  const headings = useMemo(() => extractMarkdownHeadings(content), [content]);

  if (!hasHydrated) return null;
  if (!storedMarkdown) return <UploadPrompt />;

  const displayName = fileName ?? "Untitled";

  return (
    <main className="flex h-[calc(100vh-64px)] flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-2">
        <p className="min-w-0 truncate text-sm font-medium text-[var(--foreground)]">
          {isDirty ? (
            <span className="mr-1.5 text-[var(--accent)]">●</span>
          ) : null}
          {displayName}
        </p>
        <button
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[var(--border-strong)] bg-[var(--surface-strong)] px-4 py-1.5 text-xs font-semibold transition hover:bg-[var(--surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
          onClick={handleDownload}
          title="Download .md  (⌘S / Ctrl+S)"
          type="button"
        >
          <DownloadIcon />
          Download .md
        </button>
      </div>

      {/* Mobile tabs */}
      <div className="flex border-b border-[var(--border)] md:hidden">
        <TabButton
          active={activeTab === "editor"}
          onClick={() => setActiveTab("editor")}
        >
          Editor
        </TabButton>
        <TabButton
          active={activeTab === "preview"}
          onClick={() => setActiveTab("preview")}
        >
          Preview
        </TabButton>
      </div>

      {/* Desktop: side-by-side / Mobile: single panel */}
      <div className="flex flex-1 overflow-hidden">
        {/* Editor panel */}
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

        {/* Preview panel */}
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
