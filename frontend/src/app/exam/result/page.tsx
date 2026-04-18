"use client";

import { useEffect } from "react";
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
import { useDocumentStore } from "@/lib/store/document";
import { useExamSessionStore } from "@/lib/store/exam-session";

export default function ExamResultPage() {
  const router = useRouter();
  const parsed = useDocumentStore((state) => state.parsed);
  const clearDocument = useDocumentStore((state) => state.clearDocument);
  const clearSession = useExamSessionStore((state) => state.clearSession);
  const answers = useExamSessionStore((state) => state.answers);
  const startedAt = useExamSessionStore((state) => state.startedAt);
  const submittedAt = useExamSessionStore((state) => state.submittedAt);
  const autoSubmitted = useExamSessionStore((state) => state.autoSubmitted);

  useEffect(() => {
    if (!parsed || !("questions" in parsed) || !submittedAt) {
      router.replace("/exam");
    }
  }, [parsed, router, submittedAt]);

  if (!parsed || !("questions" in parsed) || !submittedAt) {
    return null;
  }

  const answeredCount = Object.values(answers).filter((value) => value.length > 0).length;
  const elapsedSeconds =
    typeof startedAt === "number"
      ? Math.max(0, Math.round((submittedAt - startedAt) / 1000))
      : 0;

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <Card className="border-[var(--border-strong)] bg-[var(--surface-strong)]">
          <CardHeader>
            <Badge className="w-fit" tone="accent">
              Exam Submitted
            </Badge>
            <CardTitle>{parsed.meta.title}</CardTitle>
            <CardDescription>
              P1.5 先完成提交與導頁流程。完整計分、錯題整理與詳解會在 P1.6 補齊。
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                Status
              </p>
              <p className="mt-2 text-lg font-semibold">
                {autoSubmitted ? "Auto submitted" : "Submitted"}
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                Answered
              </p>
              <p className="mt-2 text-lg font-semibold">
                {answeredCount} / {parsed.questions.length}
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                Time Used
              </p>
              <p className="mt-2 text-lg font-semibold">{elapsedSeconds}s</p>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            onClick={() => {
              clearSession();
              router.push("/exam");
            }}
          >
            Retry Exam
          </Button>
          <Button
            onClick={() => {
              clearSession();
              clearDocument();
              router.push("/");
            }}
            variant="secondary"
          >
            Back Home
          </Button>
        </div>
      </div>
    </main>
  );
}
