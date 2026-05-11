"use client";

import { useMemo } from "react";
import Link from "next/link";
import { MarkdownView } from "@/components/markdown/MarkdownView";
import { ReadingProgress } from "@/components/markdown/ReadingProgress";
import { TableOfContents } from "@/components/markdown/TableOfContents";
import { WarningBanner } from "@/components/document/WarningBanner";
import { useRequireDocument } from "@/components/document/ModeGuard";
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

  const title = parsed.meta.title ?? fileName ?? t.read.untitled;
  const author = frontmatter?.author;
  const date = frontmatter?.date;
  const tags = frontmatter?.tags ?? [];

  return (
    <>
      <ReadingProgress />
      <main className="mx-auto w-full max-w-[1280px] px-6 py-12 lg:px-8">
        <div className="grid gap-12 xl:grid-cols-[minmax(0,1fr)_14rem]">

          {/* Main article area */}
          <article>
            {/* Masthead — editorial header */}
            <header className="mb-10">
              {/* Kicker */}
              <p className="mb-4 font-mono text-[10px] font-semibold uppercase tracking-[0.32em] text-[var(--accent-strong)]">
                {t.read.badge} · {fileName}
              </p>

              {/* Title */}
              <h1
                className="mb-6 font-serif font-medium leading-[1.05] tracking-[-0.02em]"
                style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
              >
                {title}
              </h1>

              {/* Horizontal rule — print masthead vibe */}
              <div className="mb-5 border-t-[1.5px] border-[var(--foreground)]" />

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-4 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                {author ? (
                  <span>
                    {t.read.author} <strong className="text-[var(--foreground)]">{author}</strong>
                  </span>
                ) : null}
                {date ? (
                  <span>
                    {t.read.date} <strong className="text-[var(--foreground)]">{date}</strong>
                  </span>
                ) : null}
                {tags.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-block border border-[var(--border-strong)] px-2 py-0.5 text-[10px]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}
                <div className="ml-auto flex gap-2">
                  <UploadTriggerButton />
                  <Link
                    className="inline-flex min-h-8 items-center border border-[var(--border-strong)] px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--muted-foreground)] transition hover:text-[var(--foreground)]"
                    href="/edit"
                  >
                    {t.read.edit}
                  </Link>
                </div>
              </div>

              {/* Second rule */}
              <div className="mt-5 border-t border-[var(--border-strong)]" />
            </header>

            <WarningBanner warnings={warnings} />

            {/* Reading content — serif prose */}
            <div className="mrp-prose mrp-prose-magazine">
              <MarkdownView headings={headings} markdown={parsed.content} />
            </div>
          </article>

          {/* TOC sidebar */}
          <aside className="hidden xl:block">
            <TableOfContents headings={headings} />
          </aside>
        </div>
      </main>
    </>
  );
}
