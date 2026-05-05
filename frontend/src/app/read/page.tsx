"use client";

import { useMemo } from "react";
import Link from "next/link";
import { MarkdownView } from "@/components/markdown/MarkdownView";
import { ReadingProgress } from "@/components/markdown/ReadingProgress";
import { TableOfContents } from "@/components/markdown/TableOfContents";
import { WarningBanner } from "@/components/document/WarningBanner";
import { useRequireDocument } from "@/components/document/ModeGuard";
import { Badge } from "@/components/ui/Badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { extractMarkdownHeadings } from "@/lib/markdown/headings";
import { UploadPrompt } from "@/components/document/UploadPrompt";
import { UploadTriggerButton } from "@/components/ui/UploadTriggerButton";
import { useDocumentStore } from "@/lib/store/document";
import { useT } from "@/lib/i18n";

export default function ReadPage() {
  const t = useT();
  const { hasHydrated, mode, parsed, shouldShowPrompt } = useRequireDocument("reading");
  const warnings = useDocumentStore((state) => state.warnings);
  const fileName = useDocumentStore((state) => state.fileName);
  const frontmatter = useDocumentStore((state) => state.frontmatter);
  const readingContent =
    mode === "reading" && parsed && "content" in parsed ? parsed.content : "";
  const headings = useMemo(
    () => extractMarkdownHeadings(readingContent),
    [readingContent],
  );

  if (!hasHydrated) return null;
  if (shouldShowPrompt) return <UploadPrompt />;
  if (mode !== "reading" || !parsed || !("content" in parsed)) return null;

  return (
    <>
      <ReadingProgress />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="space-y-6">
            <Card className="overflow-hidden border-[var(--border-strong)] bg-[var(--surface-strong)]">
              <CardHeader className="space-y-3">
                <Badge className="w-fit" tone="accent">
                  {t.read.badge}
                </Badge>
                <CardTitle className="max-w-4xl text-3xl sm:text-5xl">
                  {parsed.meta.title ?? fileName ?? t.read.untitled}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 border-t border-[var(--border)] pt-5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                {fileName ? (
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {t.read.file}{" "}
                    <span className="font-semibold text-[var(--foreground)]">
                      {fileName}
                    </span>
                  </p>
                ) : null}
                {frontmatter?.author ? (
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {t.read.author}{" "}
                    <span className="font-semibold text-[var(--foreground)]">
                      {frontmatter.author}
                    </span>
                  </p>
                ) : null}
                {frontmatter?.date ? (
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {t.read.date}{" "}
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
                <UploadTriggerButton />
                <Link
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--surface-strong)] px-5 text-sm font-semibold transition hover:bg-[var(--surface)]"
                  href="/edit"
                >
                  {t.read.edit}
                </Link>
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
