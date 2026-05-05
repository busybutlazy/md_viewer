"use client";

import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { getRouteByDocumentMode } from "@/lib/document-routes";
import { createUploadAdapterFromMarkdown } from "@/lib/fs/upload-adapter";
import { useDocumentStore } from "@/lib/store/document";
import { useExamSessionStore } from "@/lib/store/exam-session";
import { useT } from "@/lib/i18n";

export function SampleCards() {
  const t = useT();
  const clearExamSession = useExamSessionStore((state) => state.clearSession);
  const router = useRouter();
  const loadDocumentFromAdapter = useDocumentStore((state) => state.loadDocumentFromAdapter);

  async function handleOpenSample(fileName: string) {
    const response = await fetch(`/samples/${fileName}`);
    const markdown = await response.text();
    const adapter = createUploadAdapterFromMarkdown(fileName, markdown);
    clearExamSession();
    const nextMode = await loadDocumentFromAdapter(adapter);
    router.push(getRouteByDocumentMode(nextMode));
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent-strong)]">
          {t.home.samples.label}
        </p>
        <h2 className="text-2xl font-semibold tracking-tight">{t.home.samples.heading}</h2>
      </div>
    <section className="grid gap-4 lg:grid-cols-3">
      {t.sampleCards.items.map((sample) => (
        <Card className="flex flex-col overflow-hidden border-[var(--border-strong)] bg-[var(--surface-strong)]" key={sample.fileName}>
          <CardHeader className="flex-1 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <Badge tone="accent">{sample.badge}</Badge>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                {sample.modeLabel}
              </span>
            </div>
            <div className="space-y-2">
              <CardTitle>{sample.title}</CardTitle>
              <CardDescription>{sample.description}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-4 text-sm leading-7 text-[var(--muted-foreground)]">
              {sample.preview}
            </div>
            <div className="flex gap-2">
              <Button onClick={() => void handleOpenSample(sample.fileName)}>
                {t.sampleCards.tryIt}
              </Button>
              <a
                className="inline-flex items-center gap-1.5 rounded-[1.25rem] border border-[var(--border-strong)] px-4 py-2 text-sm font-medium text-[var(--muted-foreground)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
                download={sample.fileName}
                href={`/samples/${sample.fileName}`}
              >
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 4v11" />
                </svg>
                {t.sampleCards.template}
              </a>
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
    </div>
  );
}
