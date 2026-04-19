"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ExamProgressBar } from "@/components/exam/ExamProgressBar";
import { ExamTimer } from "@/components/exam/ExamTimer";
import { QuestionCard } from "@/components/exam/QuestionCard";
import { SubmitConfirmDialog } from "@/components/exam/SubmitConfirmDialog";
import { WarningBanner } from "@/components/document/WarningBanner";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { useRequireDocument } from "@/components/document/ModeGuard";
import { getQuestionDisplayNumbers } from "@/lib/exam/display";
import { useDocumentStore } from "@/lib/store/document";
import { useExamSessionStore } from "@/lib/store/exam-session";

export default function ExamPage() {
  const router = useRouter();
  const { hasHydrated, mode, parsed } = useRequireDocument();
  const warnings = useDocumentStore((state) => state.warnings);
  const initializeSession = useExamSessionStore((state) => state.initializeSession);
  const selectOption = useExamSessionStore((state) => state.selectOption);
  const submitSession = useExamSessionStore((state) => state.submitSession);
  const answers = useExamSessionStore((state) => state.answers);
  const optionOrder = useExamSessionStore((state) => state.optionOrder);
  const questionOrder = useExamSessionStore((state) => state.questionOrder);
  const deadlineAt = useExamSessionStore((state) => state.deadlineAt);
  const submittedAt = useExamSessionStore((state) => state.submittedAt);
  const [remainingSeconds, setRemainingSeconds] = useState<number>();
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const quiz =
    mode === "quiz" && parsed && "questions" in parsed ? parsed : undefined;

  useEffect(() => {
    if (!hasHydrated || !quiz) {
      return;
    }

    initializeSession(quiz);
  }, [hasHydrated, initializeSession, quiz]);

  useEffect(() => {
    if (submittedAt) {
      router.replace("/exam/result");
    }
  }, [router, submittedAt]);

  useEffect(() => {
    if (typeof deadlineAt !== "number") {
      setRemainingSeconds(undefined);
      return;
    }

    const activeDeadlineAt = deadlineAt;

    function syncRemainingTime() {
      const nextRemainingSeconds = Math.max(
        0,
        Math.ceil((activeDeadlineAt - Date.now()) / 1000),
      );
      setRemainingSeconds(nextRemainingSeconds);

      if (nextRemainingSeconds === 0) {
        submitSession({ autoSubmitted: true });
      }
    }

    syncRemainingTime();
    const intervalId = window.setInterval(syncRemainingTime, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [deadlineAt, submitSession]);

  const orderedQuestions = useMemo(() => {
    if (!quiz) {
      return [];
    }

    const questionMap = new Map(quiz.questions.map((question) => [question.id, question]));

    const orderedIds =
      questionOrder.length > 0
        ? questionOrder
        : quiz.questions.map((question) => question.id);

    return orderedIds
      .map((questionId) => questionMap.get(questionId))
      .filter((question): question is typeof quiz.questions[number] => Boolean(question));
  }, [quiz, questionOrder]);
  const questionDisplayNumbers = useMemo(
    () => getQuestionDisplayNumbers(orderedQuestions),
    [orderedQuestions],
  );

  if (!hasHydrated || !quiz) {
    return null;
  }

  const answeredCount = orderedQuestions.filter((question) => {
    const selectedOptionIds = answers[question.id] ?? [];
    return selectedOptionIds.length > 0;
  }).length;
  const unansweredNumbers = orderedQuestions
    .filter((question) => (answers[question.id] ?? []).length === 0)
    .map((question) => questionDisplayNumbers[question.id]);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <ExamProgressBar
          answeredCount={answeredCount}
          totalCount={quiz.questions.length}
        />
        <WarningBanner warnings={warnings} />
        <Card className="border-[var(--border-strong)] bg-[var(--surface-strong)]">
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-3">
              <Badge className="w-fit" tone="accent">
                Exam Mode
              </Badge>
              <div className="space-y-2">
                <CardTitle>{quiz.meta.title}</CardTitle>
                <CardDescription>
                  單選與複選都採單頁卷軸作答。答案與倒數時間會保存在
                  sessionStorage，重新整理後不會遺失。
                </CardDescription>
              </div>
            </div>
            <ExamTimer remainingSeconds={remainingSeconds} />
          </CardHeader>
          <CardContent className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] pt-5">
            <p className="text-sm text-[var(--muted-foreground)]">
              未作答 {unansweredNumbers.length} 題，已作答 {answeredCount} 題。
            </p>
            <Button onClick={() => setIsSubmitDialogOpen(true)}>Submit Exam</Button>
          </CardContent>
        </Card>

        <div className="grid gap-5">
          {orderedQuestions.map((question) => {
            const selectedOptionIds = answers[question.id] ?? [];
            const orderedOptions = (optionOrder[question.id] ?? question.options.map((option) => option.id))
              .map((optionId) => question.options.find((option) => option.id === optionId))
              .filter((option): option is typeof question.options[number] => Boolean(option));

            return (
              <QuestionCard
                answerCount={selectedOptionIds.length}
                displayNumber={questionDisplayNumbers[question.id]}
                key={question.id}
                onSelect={(optionId) =>
                  selectOption({
                    isMulti: question.isMulti,
                    optionId,
                    questionId: question.id,
                  })
                }
                orderedOptions={orderedOptions}
                question={question}
                selectedOptionIds={selectedOptionIds}
              />
            );
          })}
        </div>
      </div>

      <SubmitConfirmDialog
        isOpen={isSubmitDialogOpen}
        onClose={() => setIsSubmitDialogOpen(false)}
        onSubmit={() => {
          submitSession();
          setIsSubmitDialogOpen(false);
        }}
        unansweredNumbers={unansweredNumbers}
      />
    </main>
  );
}
