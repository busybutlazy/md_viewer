"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { getRouteByDocumentMode } from "@/lib/document-routes";
import {
  type FSAccessAdapter,
  chooseFSAccessDirectory,
  clearPersistedFSAccessDirectory,
  reauthorizeFSAccessDirectory,
  restoreFSAccessDirectory,
} from "@/lib/fs/fs-access-adapter";
import { notifyFSAccessChanged, subscribeToFSAccessChanged } from "@/lib/fs/fs-access-events";
import type { FileNode } from "@/lib/fs/types";
import { countFileNodes, filterFileNodes } from "@/lib/folder/tree";
import { useDocumentStore } from "@/lib/store/document";
import { useExamSessionStore } from "@/lib/store/exam-session";
import { useFolderSessionStore } from "@/lib/store/folder-session";
import { useSlidesSessionStore } from "@/lib/store/slides-session";
import { TEMPLATES } from "@/lib/templates";
import { useT } from "@/lib/i18n";

export function FolderTreeSidebar() {
  const t = useT();
  const [adapter, setAdapter] = useState<FSAccessAdapter | null>(null);
  const [folderName, setFolderName] = useState<string | null>(null);
  const [savedFolderName, setSavedFolderName] = useState<string | null>(null);
  const [needsReauth, setNeedsReauth] = useState(false);
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const [nodes, setNodes] = useState<FileNode[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const closeDrawer = useFolderSessionStore((state) => state.closeDrawer);
  const isDrawerOpen = useFolderSessionStore((state) => state.isDrawerOpen);
  const isSidebarCollapsed = useFolderSessionStore((state) => state.isSidebarCollapsed);
  const openDrawer = useFolderSessionStore((state) => state.openDrawer);
  const searchQuery = useFolderSessionStore((state) => state.searchQuery);
  const setSearchQuery = useFolderSessionStore((state) => state.setSearchQuery);
  const toggleSidebarCollapsed = useFolderSessionStore((state) => state.toggleSidebarCollapsed);
  const currentPath = useDocumentStore((state) => state.source?.path);
  const loadDocumentFromAdapter = useDocumentStore((state) => state.loadDocumentFromAdapter);
  const clearDocument = useDocumentStore((state) => state.clearDocument);
  const clearExamSession = useExamSessionStore((state) => state.clearSession);
  const resetSlidesSession = useSlidesSessionStore((state) => state.resetSession);
  const router = useRouter();
  const { pushToast } = useToast();

  useEffect(() => {
    let cancelled = false;

    async function restore() {
      const result = await restoreFSAccessDirectory();
      if (cancelled) return;

      if (result.status === "unavailable" && result.reason === "not-supported") {
        setIsSupported(false);
        setIsReady(true);
        return;
      }

      setIsSupported(true);

      if (result.status === "restored") {
        setAdapter(result.adapter);
        setFolderName(result.adapter.rootName);
        setSavedFolderName(null);
        setNeedsReauth(false);
        setNodes(await result.adapter.list());
        setIsReady(true);
        return;
      }

      if (result.reason === "needs-reauth") {
        setAdapter(null);
        setFolderName(null);
        setSavedFolderName(result.folderName);
        setNeedsReauth(true);
        setNodes([]);
        setIsReady(true);
        return;
      }

      setAdapter(null);
      setFolderName(null);
      setSavedFolderName(null);
      setNeedsReauth(false);
      setNodes([]);
      setIsReady(true);
    }

    void restore();
    const unsubscribe = subscribeToFSAccessChanged(() => void restore());

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  const visibleNodes = useMemo(
    () => filterFileNodes(nodes, searchQuery),
    [nodes, searchQuery],
  );
  const totalFiles = useMemo(() => countFileNodes(nodes), [nodes]);

  if (!isReady || !isSupported) {
    return null;
  }

  async function handleChooseFolder() {
    setIsLoading(true);
    try {
      const nextAdapter = await chooseFSAccessDirectory();
      if (!nextAdapter) {
        pushToast({ description: t.sidebar.toast.notOpened.desc, title: t.sidebar.toast.notOpened.title });
        return;
      }
      setAdapter(nextAdapter);
      setFolderName(nextAdapter.rootName);
      setSavedFolderName(null);
      setNeedsReauth(false);
      setNodes(await nextAdapter.list());
      notifyFSAccessChanged();
    } finally {
      setIsLoading(false);
    }
  }

  async function handleReauthorize() {
    setIsLoading(true);
    try {
      const nextAdapter = await reauthorizeFSAccessDirectory();
      if (!nextAdapter) {
        setSavedFolderName(null);
        setNeedsReauth(false);
        pushToast({ description: t.sidebar.toast.authFailed.desc, title: t.sidebar.toast.authFailed.title });
        notifyFSAccessChanged();
        return;
      }
      setAdapter(nextAdapter);
      setFolderName(nextAdapter.rootName);
      setSavedFolderName(null);
      setNeedsReauth(false);
      setNodes(await nextAdapter.list());
      notifyFSAccessChanged();
    } finally {
      setIsLoading(false);
    }
  }

  async function refreshTree() {
    if (!adapter) return;
    setIsLoading(true);
    try {
      await adapter.refresh();
      setNodes(await adapter.list());
    } finally {
      setIsLoading(false);
    }
  }

  async function createFile(path: string, markdown: string) {
    if (!adapter) return;
    await adapter.write(path, markdown);
    setNodes(await adapter.list());
    await openFile(path);
  }

  async function deleteFile(path: string) {
    if (!adapter) return;
    await adapter.delete(path);
    setNodes(await adapter.list());
    if (currentPath === path) {
      clearDocument();
      clearExamSession();
      resetSlidesSession();
      router.push("/");
    }
    pushToast({ description: t.sidebar.toast.deleted.desc(path), title: t.sidebar.toast.deleted.title });
  }

  async function unmountFolder() {
    await clearPersistedFSAccessDirectory();
    clearDocument();
    clearExamSession();
    resetSlidesSession();
    closeDrawer();
    notifyFSAccessChanged();
    router.push("/");
  }

  async function openFile(path: string) {
    if (!adapter) return;
    clearExamSession();
    resetSlidesSession();
    const nextMode = await loadDocumentFromAdapter(adapter, path);
    closeDrawer();
    router.push(getRouteByDocumentMode(nextMode));
  }

  const sidebarContent = adapter ? (
    <FolderTreeContent
      currentPath={currentPath}
      fileCount={totalFiles}
      folderName={folderName ?? adapter.rootName}
      isLoading={isLoading}
      nodes={visibleNodes}
      onFileCreate={(path, markdown) => void createFile(path, markdown)}
      onFileDelete={(path) => void deleteFile(path)}
      onFileOpen={(path) => void openFile(path)}
      onRefresh={() => void refreshTree()}
      onUnmount={() => void unmountFolder()}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
    />
  ) : (
    <NoFolderContent
      isLoading={isLoading}
      needsReauth={needsReauth}
      onChooseFolder={() => void handleChooseFolder()}
      onReauthorize={() => void handleReauthorize()}
      savedFolderName={savedFolderName}
    />
  );

  return (
    <>
      <button
        className="fixed bottom-4 left-4 z-30 inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--surface-strong)] px-4 text-sm font-semibold shadow-[var(--shadow-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] lg:hidden"
        onClick={openDrawer}
        type="button"
      >
        {adapter ? t.sidebar.files : t.sidebar.folder}
      </button>

      <aside
        className={[
          "hidden h-[calc(100vh-80px)] shrink-0 border-r border-[var(--border)] bg-[var(--surface)] transition-[width] duration-200 lg:sticky lg:top-[80px] lg:block",
          isSidebarCollapsed ? "w-10" : "w-80",
        ].join(" ")}
      >
        {isSidebarCollapsed ? (
          <div className="flex h-full flex-col items-center pt-3">
            <button
              aria-label={t.sidebar.expand}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--muted-foreground)] transition hover:bg-[var(--surface-strong)] hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
              onClick={toggleSidebarCollapsed}
              title={t.sidebar.expand}
              type="button"
            >
              ›
            </button>
          </div>
        ) : (
          <div className="relative flex h-full flex-col">
            <button
              aria-label={t.sidebar.collapse}
              className="absolute right-2 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-lg text-sm text-[var(--muted-foreground)] transition hover:bg-[var(--surface-strong)] hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
              onClick={toggleSidebarCollapsed}
              title={t.sidebar.collapse}
              type="button"
            >
              ‹
            </button>
            {sidebarContent}
          </div>
        )}
      </aside>

      {isDrawerOpen ? (
        <div className="fixed inset-0 z-50 bg-slate-950/45 lg:hidden" onClick={closeDrawer}>
          <div
            className="h-full w-[min(22rem,calc(100vw-2rem))] border-r border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-soft)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex justify-end border-b border-[var(--border)] p-3">
              <button
                aria-label={t.sidebar.close}
                className="rounded-xl px-3 py-2 text-sm font-semibold text-[var(--muted-foreground)] hover:bg-[var(--surface-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                onClick={closeDrawer}
                type="button"
              >
                {t.sidebar.close}
              </button>
            </div>
            {sidebarContent}
          </div>
        </div>
      ) : null}
    </>
  );
}

interface NoFolderContentProps {
  isLoading: boolean;
  needsReauth: boolean;
  onChooseFolder: () => void;
  onReauthorize: () => void;
  savedFolderName: string | null;
}

function NoFolderContent({
  isLoading,
  needsReauth,
  onChooseFolder,
  onReauthorize,
  savedFolderName,
}: NoFolderContentProps) {
  const t = useT();
  return (
    <div className="flex flex-col gap-2 p-4 pt-12">
      {needsReauth && savedFolderName ? (
        <>
          <p className="truncate text-sm font-semibold text-[var(--foreground)]">
            {savedFolderName}
          </p>
          <Button
            className="w-full justify-center"
            disabled={isLoading}
            onClick={onReauthorize}
            variant="secondary"
          >
            {t.sidebar.reauthorize}
          </Button>
          <Button
            className="w-full justify-center"
            disabled={isLoading}
            onClick={onChooseFolder}
            variant="ghost"
          >
            {t.sidebar.chooseDifferent}
          </Button>
        </>
      ) : (
        <Button
          className="w-full justify-center"
          disabled={isLoading}
          onClick={onChooseFolder}
        >
          {t.sidebar.chooseFolder}
        </Button>
      )}
    </div>
  );
}

interface FolderTreeContentProps {
  currentPath?: string;
  fileCount: number;
  folderName: string;
  isLoading: boolean;
  nodes: FileNode[];
  onFileCreate: (path: string, markdown: string) => void;
  onFileDelete: (path: string) => void;
  onFileOpen: (path: string) => void;
  onRefresh: () => void;
  onUnmount: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

function FolderTreeContent({
  currentPath,
  fileCount,
  folderName,
  isLoading,
  nodes,
  onFileCreate,
  onFileDelete,
  onFileOpen,
  onRefresh,
  onUnmount,
  searchQuery,
  setSearchQuery,
}: FolderTreeContentProps) {
  const t = useT();
  return (
    <div className="flex h-full flex-col">
      <div className="space-y-3 border-b border-[var(--border)] p-4 pr-9">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[var(--foreground)]">
              {folderName}
            </p>
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">
              {t.sidebar.fileCount(fileCount)}
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <NewFileDialog onCreate={onFileCreate} />
            <Button
              className="min-h-9 px-3 text-xs"
              disabled={isLoading}
              onClick={onRefresh}
              variant="secondary"
            >
              {t.sidebar.refresh}
            </Button>
          </div>
        </div>
        <EjectButton onUnmount={onUnmount} />
        <label className="block">
          <span className="sr-only">{t.sidebar.search}</span>
          <input
            className="min-h-10 w-full rounded-xl border border-[var(--border-strong)] bg-[var(--background)] px-3 text-sm outline-none transition placeholder:text-[var(--muted-foreground)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--ring)]"
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder={t.sidebar.search}
            type="search"
            value={searchQuery}
          />
        </label>
      </div>

      <nav aria-label="Folder tree" className="min-h-0 flex-1 overflow-auto py-2">
        {nodes.length > 0 ? (
          nodes.map((node) => (
            <FolderTreeNode
              currentPath={currentPath}
              key={node.path}
              node={node}
              onFileDelete={onFileDelete}
              onFileOpen={onFileOpen}
            />
          ))
        ) : (
          <p className="px-4 py-8 text-sm leading-6 text-[var(--muted-foreground)]">
            {t.sidebar.noResults}
          </p>
        )}
      </nav>
    </div>
  );
}

interface FolderTreeNodeProps {
  currentPath?: string;
  level?: number;
  node: FileNode;
  onFileDelete: (path: string) => void;
  onFileOpen: (path: string) => void;
}

function FolderTreeNode({
  currentPath,
  level = 0,
  node,
  onFileDelete,
  onFileOpen,
}: FolderTreeNodeProps) {
  const expandedPaths = useFolderSessionStore((state) => state.expandedPaths);
  const toggleExpanded = useFolderSessionStore((state) => state.toggleExpanded);
  const isExpanded = expandedPaths.includes(node.path);
  const paddingLeft = 12 + level * 14;

  if (node.kind === "file") {
    const isActive = currentPath === node.path;

    return (
      <div
        className={[
          "group flex min-h-9 w-full items-center gap-1 transition",
          isActive ? "bg-[var(--accent-soft)]" : "hover:bg-[var(--surface-strong)]",
        ].join(" ")}
        style={{ paddingLeft }}
      >
        <button
          aria-current={isActive ? "page" : undefined}
          className={[
            "flex min-h-9 min-w-0 flex-1 items-center gap-2 truncate py-1.5 text-left text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--ring)]",
            isActive
              ? "font-semibold text-[var(--accent-strong)]"
              : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]",
          ].join(" ")}
          onClick={() => onFileOpen(node.path)}
          type="button"
        >
          <span className="font-mono text-xs opacity-60">md</span>
          <span className="truncate">{node.name}</span>
        </button>
        <DeleteFileButton fileName={node.name} onDelete={() => onFileDelete(node.path)} />
      </div>
    );
  }

  return (
    <div>
      <button
        aria-expanded={isExpanded}
        className="flex min-h-9 w-full items-center gap-2 truncate px-3 py-1.5 text-left text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--surface-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--ring)]"
        onClick={() => toggleExpanded(node.path)}
        style={{ paddingLeft }}
        type="button"
      >
        <span className="font-mono text-xs text-[var(--muted-foreground)]">
          {isExpanded ? "-" : "+"}
        </span>
        <span className="truncate">{node.name}</span>
      </button>
      {isExpanded
        ? (node.children ?? []).map((child) => (
            <FolderTreeNode
              currentPath={currentPath}
              key={child.path}
              level={level + 1}
              node={child}
              onFileDelete={onFileDelete}
              onFileOpen={onFileOpen}
            />
          ))
        : null}
    </div>
  );
}

interface NewFileDialogProps {
  onCreate: (path: string, markdown: string) => void;
}

function NewFileDialog({ onCreate }: NewFileDialogProps) {
  const t = useT();
  const [isOpen, setIsOpen] = useState(false);
  const [fileName, setFileName] = useState("untitled.md");
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]?.fileName ?? "");
  const selected = TEMPLATES.find((template) => template.fileName === selectedTemplate) ?? TEMPLATES[0];

  function handleCreate() {
    if (!selected) return;
    onCreate(normalizeMarkdownPath(fileName), selected.markdown);
    setIsOpen(false);
  }

  return (
    <>
      <Button className="min-h-9 px-3 text-xs" onClick={() => setIsOpen(true)} variant="secondary">
        {t.sidebar.new}
      </Button>
      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
          <div className="w-full max-w-md rounded-2xl border border-[var(--border-strong)] bg-[var(--surface-strong)] p-5 shadow-[var(--shadow-soft)]">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">{t.sidebar.newFile.title}</h2>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                {t.sidebar.newFile.subtitle}
              </p>
            </div>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                {t.sidebar.newFile.fileNameLabel}
              </span>
              <input
                className="mt-2 min-h-10 w-full rounded-xl border border-[var(--border-strong)] bg-[var(--background)] px-3 text-sm outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--ring)]"
                onChange={(event) => setFileName(event.target.value)}
                value={fileName}
              />
            </label>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {TEMPLATES.map((template) => {
                const translated = t.templates[template.fileName];
                return (
                  <button
                    className={[
                      "rounded-xl border px-3 py-3 text-left text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
                      selectedTemplate === template.fileName
                        ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent-strong)]"
                        : "border-[var(--border-strong)] bg-[var(--surface)] hover:bg-[var(--background)]",
                    ].join(" ")}
                    key={template.fileName}
                    onClick={() => {
                      setSelectedTemplate(template.fileName);
                      setFileName(template.fileName);
                    }}
                    type="button"
                  >
                    <span className="font-semibold">{translated?.label ?? template.label}</span>
                    <span className="mt-1 block text-xs text-[var(--muted-foreground)]">
                      {translated?.description ?? template.description}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <Button onClick={() => setIsOpen(false)} variant="ghost">
                {t.sidebar.newFile.cancel}
              </Button>
              <Button onClick={handleCreate}>{t.sidebar.newFile.create}</Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

interface EjectButtonProps {
  onUnmount: () => void;
}

function EjectButton({ onUnmount }: EjectButtonProps) {
  const t = useT();
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-[var(--muted-foreground)]">{t.sidebar.unmount.confirm}</span>
        <button
          className="rounded-lg px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] dark:text-red-300 dark:hover:bg-red-950/30"
          onClick={() => { setConfirming(false); onUnmount(); }}
          type="button"
        >
          {t.sidebar.unmount.yes}
        </button>
        <button
          className="rounded-lg px-2 py-1 text-xs text-[var(--muted-foreground)] hover:bg-[var(--surface-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
          onClick={() => setConfirming(false)}
          type="button"
        >
          {t.sidebar.unmount.no}
        </button>
      </div>
    );
  }

  return (
    <button
      className="w-full rounded-lg px-2 py-1.5 text-left text-xs text-[var(--muted-foreground)] transition hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] dark:hover:bg-red-950/30 dark:hover:text-red-300"
      onClick={() => setConfirming(true)}
      type="button"
    >
      {t.sidebar.unmount.label}
    </button>
  );
}

interface DeleteFileButtonProps {
  fileName: string;
  onDelete: () => void;
}

function DeleteFileButton({ fileName, onDelete }: DeleteFileButtonProps) {
  const t = useT();
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <span className="flex shrink-0 items-center gap-1 pr-2">
        <button
          className="rounded-lg px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] dark:text-red-300 dark:hover:bg-red-950/30"
          onClick={() => { setConfirming(false); onDelete(); }}
          type="button"
        >
          {t.sidebar.delete.confirm}
        </button>
        <button
          className="rounded-lg px-2 py-1 text-xs text-[var(--muted-foreground)] hover:bg-[var(--surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
          onClick={() => setConfirming(false)}
          type="button"
        >
          {t.sidebar.delete.cancel}
        </button>
      </span>
    );
  }

  return (
    <button
      aria-label={t.sidebar.delete.label(fileName)}
      className="mr-2 shrink-0 rounded-lg px-2 py-1 text-xs text-[var(--muted-foreground)] opacity-0 transition hover:bg-red-50 hover:text-red-600 focus:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] group-hover:opacity-100 dark:hover:bg-red-950/30 dark:hover:text-red-300"
      onClick={() => setConfirming(true)}
      type="button"
    >
      {t.sidebar.delete.button}
    </button>
  );
}

function normalizeMarkdownPath(fileName: string): string {
  const trimmed = fileName.trim().replace(/^\/+/, "");
  if (!trimmed) return "untitled.md";
  return /\.(md|markdown)$/i.test(trimmed) ? trimmed : `${trimmed}.md`;
}
