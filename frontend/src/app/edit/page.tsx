"use client";

import { useEffect, useMemo, useState } from "react";
import { MarkdownView } from "@/components/markdown/MarkdownView";
import { EditorPane } from "@/components/editor/EditorPane";
import { UploadPrompt } from "@/components/document/UploadPrompt";
import { extractMarkdownHeadings } from "@/lib/markdown/headings";
import { useDocumentStore } from "@/lib/store/document";

type ActiveTab = "editor" | "preview";

export default function EditPage() {
  const hasHydrated = useDocumentStore((state) => state.hasHydrated);
  const storedMarkdown = useDocumentStore((state) => state.markdown);

  const [content, setContent] = useState("");
  const [activeTab, setActiveTab] = useState<ActiveTab>("editor");

  useEffect(() => {
    if (hasHydrated && storedMarkdown) {
      setContent(storedMarkdown);
    }
  }, [hasHydrated, storedMarkdown]);

  const headings = useMemo(() => extractMarkdownHeadings(content), [content]);

  if (!hasHydrated) return null;
  if (!storedMarkdown) return <UploadPrompt />;

  return (
    <main className="flex h-[calc(100vh-64px)] flex-col">
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
