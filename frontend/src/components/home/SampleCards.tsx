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
import { getRouteByDocumentMode } from "@/components/home/UploadPanel";
import { useDocumentStore } from "@/lib/store/document";
import { useExamSessionStore } from "@/lib/store/exam-session";

interface SampleCard {
  badge: string;
  description: string;
  fileName: string;
  modeLabel: string;
  preview: string;
  title: string;
}

const SAMPLE_CARDS: SampleCard[] = [
  {
    badge: "Reading",
    description: "長文排版、圖片、表格與 code block 的完整閱讀示範。",
    fileName: "reading-sample.md",
    modeLabel: "閱讀模式",
    preview: "1500+ 字技術文章，適合驗證 TOC、progress 與 typography。",
    title: "React 19 閱讀深潛",
  },
  {
    badge: "Exam",
    description: "10 題選擇題，含複選與多種詳解格式。",
    fileName: "exam-sample.md",
    modeLabel: "考試模式",
    preview: "涵蓋單選、複選、長詳解與 Markdown explanation。",
    title: "JavaScript 與 React 小測",
  },
  {
    badge: "Slides",
    description: "12 頁簡報，驗證 theme、speaker notes 與 print deck。",
    fileName: "slides-sample.md",
    modeLabel: "簡報模式",
    preview: "展示 default / dark / minimal 風格與 code block 分頁。",
    title: "Product Narrative Deck",
  },
];

export function SampleCards() {
  const clearExamSession = useExamSessionStore((state) => state.clearSession);
  const router = useRouter();
  const loadDocument = useDocumentStore((state) => state.loadDocument);

  async function handleOpenSample(fileName: string) {
    const response = await fetch(`/samples/${fileName}`);
    const markdown = await response.text();
    clearExamSession();
    const nextMode = loadDocument({ fileName, markdown });

    router.push(getRouteByDocumentMode(nextMode));
  }

  return (
    <section className="grid gap-4 lg:grid-cols-3">
      {SAMPLE_CARDS.map((sample) => (
        <Card className="overflow-hidden border-[var(--border-strong)] bg-[var(--surface-strong)]" key={sample.fileName}>
          <CardHeader className="space-y-4">
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
            <Button onClick={() => void handleOpenSample(sample.fileName)} variant="secondary">
              Open Sample
            </Button>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
