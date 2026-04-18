"use client";

import { WarningBanner } from "@/components/document/WarningBanner";
import { Badge } from "@/components/ui/Badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { useRequireDocument } from "@/components/document/ModeGuard";
import { useDocumentStore } from "@/lib/store/document";

export default function SlidesPage() {
  const { mode, parsed } = useRequireDocument();
  const warnings = useDocumentStore((state) => state.warnings);

  if (mode !== "slides" || !parsed || !("slides" in parsed)) {
    return null;
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <WarningBanner warnings={warnings} />
        <Card>
          <CardHeader>
            <Badge className="w-fit" tone="accent">
              Slides Mode
            </Badge>
            <CardTitle>{parsed.meta.title}</CardTitle>
            <CardDescription>
              P1.3 先確認 slides 檔能正確導進 `/slides`。完整投影片體驗會在 P1.7 實作。
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {parsed.slides.map((slide) => (
              <section
                className="rounded-3xl border border-[var(--border)] bg-[var(--surface-strong)] p-5"
                key={slide.index}
              >
                <p className="text-sm font-semibold">Slide {slide.index + 1}</p>
                <pre className="mt-3 overflow-auto whitespace-pre-wrap text-sm leading-7 text-[var(--muted-foreground)]">
                  {slide.content}
                </pre>
              </section>
            ))}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
