"use client";

import { useMemo } from "react";
import { MarkdownView } from "@/components/markdown/MarkdownView";
import { ReadingProgress } from "@/components/markdown/ReadingProgress";
import { TableOfContents } from "@/components/markdown/TableOfContents";
import { WarningBanner } from "@/components/document/WarningBanner";
import { useRequireDocument } from "@/components/document/ModeGuard";
import { Badge } from "@/components/ui/Badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { extractMarkdownHeadings } from "@/lib/markdown/headings";
import { useDocumentStore } from "@/lib/store/document";

export default function ReadPage() {
  const { hasHydrated, mode, parsed } = useRequireDocument();
  const warnings = useDocumentStore((state) => state.warnings);
  const fileName = useDocumentStore((state) => state.fileName);
  const frontmatter = useDocumentStore((state) => state.frontmatter);
  const readingContent =
    mode === "reading" && parsed && "content" in parsed ? parsed.content : "";
  const headings = useMemo(
    () => extractMarkdownHeadings(readingContent),
    [readingContent],
  );

  if (!hasHydrated || mode !== "reading" || !parsed || !("content" in parsed)) {
    return null;
  }

  return (
    <>
      <ReadingProgress />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="space-y-6">
            <Card className="overflow-hidden border-[var(--border-strong)] bg-[var(--surface-strong)]">
              <CardHeader className="space-y-4">
                <Badge className="w-fit" tone="accent">
                  Reading Mode
                </Badge>
                <div className="space-y-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--accent-strong)]">
                    Long-form markdown reader
                  </p>
                  <CardTitle className="max-w-4xl text-3xl sm:text-5xl">
                    {parsed.meta.title ?? fileName ?? "Untitled Reading Document"}
                  </CardTitle>
                  <CardDescription className="max-w-3xl text-base">
                    為長文、表格、圖片與程式碼區塊打造的閱讀介面。內容來自
                    document store，重新整理後仍會保留在 sessionStorage。
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 border-t border-[var(--border)] pt-5 sm:flex-row sm:flex-wrap sm:items-center">
                <p className="text-sm text-[var(--muted-foreground)]">
                  File:{" "}
                  <span className="font-semibold text-[var(--foreground)]">
                    {fileName ?? "Unknown"}
                  </span>
                </p>
                {frontmatter?.author ? (
                  <p className="text-sm text-[var(--muted-foreground)]">
                    Author:{" "}
                    <span className="font-semibold text-[var(--foreground)]">
                      {frontmatter.author}
                    </span>
                  </p>
                ) : null}
                {frontmatter?.date ? (
                  <p className="text-sm text-[var(--muted-foreground)]">
                    Date:{" "}
                    <span className="font-semibold text-[var(--foreground)]">
                      {frontmatter.date}
                    </span>
                  </p>
                ) : null}
                {frontmatter?.tags?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {frontmatter.tags.map((tag) => (
                      <Badge key={tag} tone="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                ) : null}
              </CardContent>
            </Card>

            <WarningBanner warnings={warnings} />

            <Card className="border-[var(--border-strong)] bg-[var(--surface-strong)] p-0">
              <CardContent className="mt-0 px-5 py-8 sm:px-8 lg:px-12">
                <MarkdownView headings={headings} markdown={parsed.content} />
              </CardContent>
            </Card>
          </div>

          <div className="xl:block">
            <TableOfContents headings={headings} />
          </div>
        </div>
      </main>
    </>
  );
}
