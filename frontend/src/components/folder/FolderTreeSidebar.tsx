"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { getRouteByDocumentMode } from "@/lib/document-routes";
import {
  type FSAccessAdapter,
  restoreFSAccessDirectory,
} from "@/lib/fs/fs-access-adapter";
import { subscribeToFSAccessChanged } from "@/lib/fs/fs-access-events";
import type { FileNode } from "@/lib/fs/types";
import { countFileNodes, filterFileNodes } from "@/lib/folder/tree";
import { useDocumentStore } from "@/lib/store/document";
import { useExamSessionStore } from "@/lib/store/exam-session";
import { useFolderSessionStore } from "@/lib/store/folder-session";
import { useSlidesSessionStore } from "@/lib/store/slides-session";

export function FolderTreeSidebar() {
  const [adapter, setAdapter] = useState<FSAccessAdapter | null>(null);
  const [folderName, setFolderName] = useState<string | null>(null);
  const [nodes, setNodes] = useState<FileNode[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const closeDrawer = useFolderSessionStore((state) => state.closeDrawer);
  const isDrawerOpen = useFolderSessionStore((state) => state.isDrawerOpen);
  const openDrawer = useFolderSessionStore((state) => state.openDrawer);
  const searchQuery = useFolderSessionStore((state) => state.searchQuery);
  const setSearchQuery = useFolderSessionStore((state) => state.setSearchQuery);
  const currentPath = useDocumentStore((state) => state.source?.path);
  const loadDocumentFromAdapter = useDocumentStore((state) => state.loadDocumentFromAdapter);
  const clearExamSession = useExamSessionStore((state) => state.clearSession);
  const resetSlidesSession = useSlidesSessionStore((state) => state.resetSession);
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    async function restore() {
      const result = await restoreFSAccessDirectory();

      if (cancelled) {
        return;
      }

      if (result.status !== "restored") {
        setAdapter(null);
        setFolderName(null);
        setNodes([]);
        setIsReady(true);
        return;
      }

      setAdapter(result.adapter);
      setFolderName(result.adapter.rootName);
      setNodes(await result.adapter.list());
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

  if (!isReady || !adapter) {
    return null;
  }

  async function refreshTree() {
    if (!adapter) {
      return;
    }

    setIsLoading(true);
    try {
      await adapter.refresh();
      setNodes(await adapter.list());
    } finally {
      setIsLoading(false);
    }
  }

  async function openFile(path: string) {
    if (!adapter) {
      return;
    }

    clearExamSession();
    resetSlidesSession();
    const nextMode = await loadDocumentFromAdapter(adapter, path);
    closeDrawer();
    router.push(getRouteByDocumentMode(nextMode));
  }

  const content = (
    <FolderTreeContent
      currentPath={currentPath}
      fileCount={totalFiles}
      folderName={folderName ?? adapter.rootName}
      isLoading={isLoading}
      nodes={visibleNodes}
      onFileOpen={(path) => void openFile(path)}
      onRefresh={() => void refreshTree()}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
    />
  );

  return (
    <>
      <button
        className="fixed bottom-4 left-4 z-30 inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--surface-strong)] px-4 text-sm font-semibold shadow-[var(--shadow-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] lg:hidden"
        onClick={openDrawer}
        type="button"
      >
        Files
      </button>

      <aside className="hidden h-[calc(100vh-80px)] w-80 shrink-0 border-r border-[var(--border)] bg-[var(--surface)] lg:sticky lg:top-[80px] lg:block">
        {content}
      </aside>

      {isDrawerOpen ? (
        <div className="fixed inset-0 z-50 bg-slate-950/45 lg:hidden" onClick={closeDrawer}>
          <div
            className="h-full w-[min(22rem,calc(100vw-2rem))] border-r border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-soft)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex justify-end border-b border-[var(--border)] p-3">
              <button
                aria-label="Close folder drawer"
                className="rounded-xl px-3 py-2 text-sm font-semibold text-[var(--muted-foreground)] hover:bg-[var(--surface-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                onClick={closeDrawer}
                type="button"
              >
                Close
              </button>
            </div>
            {content}
          </div>
        </div>
      ) : null}
    </>
  );
}

interface FolderTreeContentProps {
  currentPath?: string;
  fileCount: number;
  folderName: string;
  isLoading: boolean;
  nodes: FileNode[];
  onFileOpen: (path: string) => void;
  onRefresh: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

function FolderTreeContent({
  currentPath,
  fileCount,
  folderName,
  isLoading,
  nodes,
  onFileOpen,
  onRefresh,
  searchQuery,
  setSearchQuery,
}: FolderTreeContentProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="space-y-3 border-b border-[var(--border)] p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[var(--foreground)]">
              {folderName}
            </p>
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">
              {fileCount} markdown files
            </p>
          </div>
          <Button
            className="min-h-9 px-3 text-xs"
            disabled={isLoading}
            onClick={onRefresh}
            variant="secondary"
          >
            Refresh
          </Button>
        </div>
        <label className="block">
          <span className="sr-only">Search markdown files</span>
          <input
            className="min-h-10 w-full rounded-xl border border-[var(--border-strong)] bg-[var(--background)] px-3 text-sm outline-none transition placeholder:text-[var(--muted-foreground)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--ring)]"
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search files"
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
              onFileOpen={onFileOpen}
            />
          ))
        ) : (
          <p className="px-4 py-8 text-sm leading-6 text-[var(--muted-foreground)]">
            No markdown files match the current search.
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
  onFileOpen: (path: string) => void;
}

function FolderTreeNode({
  currentPath,
  level = 0,
  node,
  onFileOpen,
}: FolderTreeNodeProps) {
  const expandedPaths = useFolderSessionStore((state) => state.expandedPaths);
  const toggleExpanded = useFolderSessionStore((state) => state.toggleExpanded);
  const isExpanded = expandedPaths.includes(node.path);
  const paddingLeft = 12 + level * 14;

  if (node.kind === "file") {
    const isActive = currentPath === node.path;

    return (
      <button
        aria-current={isActive ? "page" : undefined}
        className={[
          "flex min-h-9 w-full items-center gap-2 truncate px-3 py-1.5 text-left text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--ring)]",
          isActive
            ? "bg-[var(--accent-soft)] font-semibold text-[var(--accent-strong)]"
            : "text-[var(--muted-foreground)] hover:bg-[var(--surface-strong)] hover:text-[var(--foreground)]",
        ].join(" ")}
        onClick={() => onFileOpen(node.path)}
        style={{ paddingLeft }}
        type="button"
      >
        <span className="font-mono text-xs opacity-60">md</span>
        <span className="truncate">{node.name}</span>
      </button>
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
              onFileOpen={onFileOpen}
            />
          ))
        : null}
    </div>
  );
}
