"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ExamMarkdown } from "@/components/exam/ExamMarkdown";
import { MarkdownView } from "@/components/markdown/MarkdownView";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { extractMarkdownHeadings } from "@/lib/markdown/headings";
import { evaluateExamAnswers } from "@/lib/exam/score";
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
  const [showCorrectAnswers, setShowCorrectAnswers] = useState(false);
  const quiz =
    parsed && "questions" in parsed ? parsed : undefined;

  useEffect(() => {
    if (!quiz || !submittedAt) {
      router.replace("/exam");
    }
  }, [quiz, router, submittedAt]);

  const evaluation = useMemo(
    () => (quiz ? evaluateExamAnswers(quiz, answers) : undefined),
    [answers, quiz],
  );

  if (!quiz || !submittedAt || !evaluation) {
    return null;
  }

  const answeredCount = Object.values(answers).filter((value) => value.length > 0).length;
  const elapsedSeconds =
    typeof startedAt === "number"
      ? Math.max(0, Math.round((submittedAt - startedAt) / 1000))
      : 0;
  const passed =
    typeof quiz.meta.passingScore === "number"
      ? evaluation.percentage >= quiz.meta.passingScore
      : undefined;
  const correctQuestions = evaluation.questions.filter((question) => question.isCorrect);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <Card className="overflow-hidden border-[var(--border-strong)] bg-[var(--surface-strong)]">
          <CardHeader className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="w-fit" tone="accent">
                Exam Result
              </Badge>
              {typeof passed === "boolean" ? (
                <Badge tone={passed ? "accent" : "outline"}>
                  {passed ? "Pass" : "Fail"}
                </Badge>
              ) : null}
            </div>
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--accent-strong)]">
                {autoSubmitted ? "Auto submitted" : "Submitted"}
              </p>
              <CardTitle className="text-4xl sm:text-5xl">
                {evaluation.percentage}
              </CardTitle>
              <CardDescription className="text-base">
                {quiz.meta.title}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                Correct
              </p>
              <p className="mt-2 text-lg font-semibold">{evaluation.correctCount}</p>
            </div>
            <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                Answered
              </p>
              <p className="mt-2 text-lg font-semibold">
                {answeredCount} / {quiz.questions.length}
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

        <section aria-live="polite" className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">錯題 ({evaluation.wrongQuestions.length})</h2>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                預設展開，優先處理沒答對或未作答的題目。
              </p>
            </div>
          </div>
          {evaluation.wrongQuestions.map((item) => {
            const explanationHeadings = extractMarkdownHeadings(item.question.explanation ?? "");

            return (
              <Card
                className="border-red-400/25 bg-[var(--surface-strong)]"
                key={item.question.id}
              >
                <CardHeader>
                  <Badge className="w-fit" tone="outline">
                    Q{item.question.number}
                  </Badge>
                  <CardTitle className="text-2xl">
                    <ExamMarkdown content={item.question.text} />
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                        你答
                      </p>
                      <div className="mt-3 space-y-2">
                        {item.selectedOptions.length > 0 ? (
                          item.selectedOptions.map((option) => (
                            <p key={option.id}>
                              {option.id}. <ExamMarkdown content={option.text} />
                            </p>
                          ))
                        ) : (
                          <p className="text-sm text-[var(--muted-foreground)]">未作答</p>
                        )}
                      </div>
                    </div>
                    <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                        正解
                      </p>
                      <div className="mt-3 space-y-2">
                        {item.correctOptions.map((option) => (
                          <p key={option.id}>
                            {option.id}. <ExamMarkdown content={option.text} />
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                      Explanation
                    </p>
                    {item.question.explanation ? (
                      <div className="mt-4">
                        <MarkdownView
                          className="text-sm"
                          headings={explanationHeadings}
                          markdown={item.question.explanation}
                        />
                      </div>
                    ) : (
                      <p className="mt-3 text-sm text-[var(--muted-foreground)]">（無詳解）</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
          {evaluation.wrongQuestions.length === 0 ? (
            <Card className="border-[var(--border)] bg-[var(--surface-strong)]">
              <CardContent className="mt-0 py-6 text-sm text-[var(--muted-foreground)]">
                這次沒有錯題，所有題目都答對了。
              </CardContent>
            </Card>
          ) : null}
        </section>

        <section className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">已答對 ({correctQuestions.length})</h2>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                預設收合，避免結果頁被已答對題目淹沒。
              </p>
            </div>
            <Button
              onClick={() => setShowCorrectAnswers((value) => !value)}
              variant="secondary"
            >
              {showCorrectAnswers ? "Hide Correct Answers" : "Show Correct Answers"}
            </Button>
          </div>
          {showCorrectAnswers ? (
            <div className="grid gap-4">
              {correctQuestions.map((item) => (
                <Card className="bg-[var(--surface-strong)]" key={item.question.id}>
                  <CardHeader>
                    <Badge className="w-fit" tone="accent">
                      Q{item.question.number}
                    </Badge>
                    <CardTitle className="text-xl">
                      <ExamMarkdown content={item.question.text} />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      你的答案與正解完全一致。
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : null}
        </section>

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
