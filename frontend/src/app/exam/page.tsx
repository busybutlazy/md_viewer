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

export default function ExamPage() {
  const { mode, parsed } = useRequireDocument();
  const warnings = useDocumentStore((state) => state.warnings);

  if (mode !== "quiz" || !parsed || !("questions" in parsed)) {
    return null;
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <WarningBanner warnings={warnings} />
        <Card>
          <CardHeader>
            <Badge className="w-fit" tone="accent">
              Exam Mode
            </Badge>
            <CardTitle>{parsed.meta.title}</CardTitle>
            <CardDescription>
              P1.3 先確認 quiz 檔能正確導進 `/exam`。完整作答互動會在 P1.5 實作。
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {parsed.questions.map((question) => (
              <section
                className="rounded-3xl border border-[var(--border)] bg-[var(--surface-strong)] p-5"
                key={question.id}
              >
                <p className="text-sm font-semibold">
                  Q{question.number}. {question.text}
                </p>
                <ul className="mt-3 grid gap-2 text-sm leading-7 text-[var(--muted-foreground)]">
                  {question.options.map((option) => (
                    <li key={option.id}>
                      {option.id}. {option.text}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
