"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ExamMarkdown } from "@/components/exam/ExamMarkdown";
import { MarkdownView } from "@/components/markdown/MarkdownView";
import {
  getQuestionDisplayNumbers,
} from "@/lib/exam/display";
import { extractMarkdownHeadings } from "@/lib/markdown/headings";
import { evaluateExamAnswers } from "@/lib/exam/score";
import { useDocumentStore } from "@/lib/store/document";
import { useExamSessionStore } from "@/lib/store/exam-session";
import type { ReactNode } from "react";

export default function ExamResultPage() {
  const router = useRouter();
  const hasDocumentHydrated = useDocumentStore((state) => state.hasHydrated);
  const parsed = useDocumentStore((state) => state.parsed);
  const clearDocument = useDocumentStore((state) => state.clearDocument);
  const hasExamSessionHydrated = useExamSessionStore((state) => state.hasHydrated);
  const clearSession = useExamSessionStore((state) => state.clearSession);
  const startRetrySession = useExamSessionStore((state) => state.startRetrySession);
  const answers = useExamSessionStore((state) => state.answers);
  const optionOrder = useExamSessionStore((state) => state.optionOrder);
  const questionOrder = useExamSessionStore((state) => state.questionOrder);
  const startedAt = useExamSessionStore((state) => state.startedAt);
  const submittedAt = useExamSessionStore((state) => state.submittedAt);
  const autoSubmitted = useExamSessionStore((state) => state.autoSubmitted);
  const [showCorrectAnswers, setShowCorrectAnswers] = useState(false);
  const quiz =
    parsed && "questions" in parsed ? parsed : undefined;

  useEffect(() => {
    if (!hasDocumentHydrated || !hasExamSessionHydrated) {
      return;
    }

    if (!quiz || !submittedAt) {
      router.replace("/exam");
    }
  }, [hasDocumentHydrated, hasExamSessionHydrated, quiz, router, submittedAt]);

  const evaluation = useMemo(
    () => (quiz ? evaluateExamAnswers(quiz, answers) : undefined),
    [answers, quiz],
  );
  const orderedQuestions = useMemo(() => {
    if (!quiz) {
      return [];
    }

    const questionMap = new Map(
      quiz.questions.map((question) => [question.id, question]),
    );
    const orderedIds =
      questionOrder.length > 0
        ? questionOrder
        : quiz.questions.map((question) => question.id);

    return orderedIds
      .map((questionId) => questionMap.get(questionId))
      .filter((question): question is typeof quiz.questions[number] =>
        Boolean(question),
      );
  }, [questionOrder, quiz]);
  const questionDisplayNumbers = useMemo(
    () => getQuestionDisplayNumbers(orderedQuestions),
    [orderedQuestions],
  );

  if (
    !hasDocumentHydrated ||
    !hasExamSessionHydrated ||
    !quiz ||
    !submittedAt ||
    !evaluation
  ) {
    return null;
  }

  const totalCount = quiz.questions.length;
  const answeredCount = Object.values(answers).filter((value) => value.length > 0).length;
  const skippedCount = totalCount - answeredCount;
  const wrongCount = evaluation.wrongQuestions.length;
  const incorrectAnsweredCount = Math.max(0, wrongCount - skippedCount);
  const elapsedSeconds =
    typeof startedAt === "number"
      ? Math.max(0, Math.round((submittedAt - startedAt) / 1000))
      : 0;
  const passed =
    typeof quiz.meta.passingScore === "number"
      ? evaluation.percentage >= quiz.meta.passingScore
      : undefined;
  const correctQuestions = evaluation.questions.filter((question) => question.isCorrect);

  const circumference = 2 * Math.PI * 86;
  const fillDash = (evaluation.percentage / 100) * circumference;

  const activeQuiz = quiz;

  function getOrderedOptionsByQuestionId(questionId: string) {
    const question = activeQuiz.questions.find((item) => item.id === questionId);

    if (!question) {
      return [];
    }

    return (optionOrder[questionId] ?? question.options.map((option) => option.id))
      .map((optionId) => question.options.find((option) => option.id === optionId))
      .filter((option): option is typeof question.options[number] => Boolean(option));
  }

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    if (m === 0) return `${s}s`;
    return `${m}:${String(s).padStart(2, "0")}`;
  }

  const wrongQIdsSet = new Set(evaluation.wrongQuestions.map((q) => q.question.id));
  const skippedQIds = new Set(
    orderedQuestions
      .filter((q) => (answers[q.id] ?? []).length === 0)
      .map((q) => q.id),
  );

  function scrollToQuestion(questionId: string, isWrong: boolean) {
    if (!isWrong) {
      setShowCorrectAnswers(true);
    }
    setTimeout(() => {
      document.getElementById(`q-${questionId}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, isWrong ? 0 : 80);
  }

  return (
    <main className="warmth-theme mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Score hero */}
      <section
        className="relative mb-8 overflow-hidden"
        style={{
          padding: "48px 52px 52px",
          borderRadius: "var(--radius-xl)",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 0% 0%, var(--accent-soft), transparent 60%), radial-gradient(ellipse 50% 40% at 100% 100%, rgba(184,152,106,0.08), transparent 60%)",
          }}
        />

        <div
          className="relative grid items-center gap-12"
          style={{ gridTemplateColumns: "280px 1fr" }}
        >
          {/* Score ring */}
          <div className="relative" style={{ width: 280, height: 280 }}>
            <svg
              aria-label={`Score ${evaluation.percentage}%`}
              height="280"
              viewBox="0 0 200 200"
              width="280"
              style={{ transform: "rotate(-90deg)" }}
            >
              <circle cx="100" cy="100" r="86" fill="none" stroke="var(--border)" strokeWidth="12" />
              <circle
                cx="100" cy="100" r="86"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${fillDash} ${circumference}`}
                style={{ transition: "stroke-dasharray 1s ease" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div
                className="font-serif font-medium leading-none tracking-tight"
                style={{ fontSize: "72px", letterSpacing: "-0.04em" }}
              >
                {evaluation.percentage}
                <sup
                  className="font-serif"
                  style={{ fontSize: "28px", verticalAlign: "32px", color: "var(--muted-foreground)" }}
                >
                  %
                </sup>
              </div>
              <div
                className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em]"
                style={{ color: "var(--muted-foreground)" }}
              >
                {evaluation.correctCount} / {totalCount}
              </div>
            </div>
          </div>

          {/* Verdict */}
          <div className="flex flex-col gap-4">
            {typeof passed === "boolean" ? (
              <span
                className="inline-flex w-fit items-center gap-2.5 font-semibold tracking-[0.04em]"
                style={{
                  padding: "7px 16px 7px 10px",
                  borderRadius: "999px",
                  background: passed ? "var(--accent)" : "var(--border-strong)",
                  color: passed ? "#fff" : "var(--muted-foreground)",
                  fontSize: "13px",
                }}
              >
                <span
                  className="inline-grid place-items-center"
                  style={{ width: 22, height: 22, borderRadius: "999px", background: "rgba(255,255,255,0.2)" }}
                >
                  {passed ? (
                    <svg fill="none" height="12" stroke="currentColor" strokeLinecap="round" strokeWidth="3" viewBox="0 0 24 24" width="12">
                      <path d="M5 12l5 5L20 7" />
                    </svg>
                  ) : (
                    <svg fill="none" height="12" stroke="currentColor" strokeLinecap="round" strokeWidth="3" viewBox="0 0 24 24" width="12">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  )}
                </span>
                {passed ? "PASSED" : "FAILED"}
              </span>
            ) : (
              <span
                className="inline-flex w-fit items-center font-mono text-[10px] uppercase tracking-[0.2em]"
                style={{ color: "var(--muted-foreground)" }}
              >
                {autoSubmitted ? "Auto Submitted" : "Submitted"}
              </span>
            )}

            <h1
              className="font-serif font-medium leading-[1.05]"
              style={{ fontSize: "clamp(2rem, 3.5vw, 3.2rem)", letterSpacing: "-0.02em", margin: 0 }}
            >
              {quiz.meta.title ? (
                <>結果：<em className="italic" style={{ color: "var(--accent-strong)" }}>{quiz.meta.title}</em></>
              ) : (
                <>考試完成，共 <em className="italic" style={{ color: "var(--accent-strong)" }}>{totalCount} 題</em>。</>
              )}
            </h1>

            {/* Stat strip */}
            <div
              className="mt-2 grid gap-0 border-t"
              style={{ gridTemplateColumns: "repeat(4, 1fr)", borderColor: "var(--border)", paddingTop: "20px" }}
            >
              {[
                { label: "Correct", value: evaluation.correctCount, sub: `/ ${totalCount}` },
                { label: "Wrong", value: incorrectAnsweredCount, color: incorrectAnsweredCount > 0 ? "var(--danger, #9b2228)" : undefined },
                { label: "Skipped", value: skippedCount, color: skippedCount > 0 ? "var(--warn, #8a4a1f)" : undefined },
                { label: "Time", value: formatTime(elapsedSeconds) },
              ].map((stat, i) => (
                <div
                  key={stat.label}
                  style={{
                    paddingRight: i < 3 ? "20px" : 0,
                    borderRight: i < 3 ? "1px solid var(--border)" : "none",
                    paddingLeft: i > 0 ? "20px" : 0,
                  }}
                >
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: "var(--muted-foreground)" }}>
                    {stat.label}
                  </p>
                  <p
                    className="mt-1 font-serif font-medium leading-none"
                    style={{ fontSize: "28px", letterSpacing: "-0.01em", color: stat.color ?? "var(--foreground)" }}
                  >
                    {stat.value}
                  </p>
                  {stat.sub ? (
                    <p className="mt-1 text-[12px]" style={{ color: "var(--muted-foreground)" }}>{stat.sub}</p>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Action cards */}
      <div className="mb-10 flex flex-col gap-3 sm:flex-row">
        {evaluation.wrongQuestions.length > 0 ? (
          <button
            className="flex flex-1 items-center gap-4 text-left transition-all hover:-translate-y-0.5"
            style={{
              minWidth: 220, padding: "18px 20px",
              borderRadius: "var(--radius-lg)",
              background: "var(--foreground)", color: "var(--background)",
              border: "1px solid var(--foreground)",
            }}
            onClick={() => {
              startRetrySession(quiz, evaluation.wrongQuestions.map((q) => q.question.id));
              router.push("/exam");
            }}
            type="button"
          >
            <span className="inline-grid flex-shrink-0 place-items-center" style={{ width: 44, height: 44, borderRadius: "10px", background: "rgba(242,236,224,0.12)" }}>
              <svg fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeWidth="2" viewBox="0 0 24 24" width="20">
                <path d="M3 12a9 9 0 1117.94-3M21 4v6h-6" />
              </svg>
            </span>
            <span className="flex-1 min-w-0">
              <span className="block text-sm font-semibold">只練錯題（{wrongCount} 題）</span>
              <span className="mt-0.5 block text-xs opacity-70 leading-relaxed">把答錯或跳過的題目重新洗牌再做一輪。</span>
            </span>
            <span className="inline-grid flex-shrink-0 place-items-center" style={{ width: 30, height: 30, borderRadius: "999px", background: "rgba(242,236,224,0.12)" }}>
              <svg fill="none" height="14" stroke="currentColor" strokeLinecap="round" strokeWidth="2.4" viewBox="0 0 24 24" width="14">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </span>
          </button>
        ) : null}

        <button
          className="flex flex-1 items-center gap-4 text-left transition-all hover:-translate-y-0.5"
          style={{
            minWidth: 220, padding: "18px 20px",
            borderRadius: "var(--radius-lg)",
            background: "var(--surface)", border: "1px solid var(--border)",
          }}
          onClick={() => { clearSession(); router.push("/exam"); }}
          type="button"
        >
          <span className="inline-grid flex-shrink-0 place-items-center" style={{ width: 44, height: 44, borderRadius: "10px", background: "var(--accent-soft)", color: "var(--accent-strong)" }}>
            <svg fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeWidth="2" viewBox="0 0 24 24" width="20">
              <path d="M3 12a9 9 0 1017.94-3" /><path d="M3 4v8h8" />
            </svg>
          </span>
          <span className="flex-1 min-w-0">
            <span className="block text-sm font-semibold" style={{ color: "var(--foreground)" }}>重新作答全部</span>
            <span className="mt-0.5 block text-xs leading-relaxed" style={{ color: "var(--muted-foreground)" }}>{totalCount} 題重洗、計時器歸零。</span>
          </span>
          <span className="inline-grid flex-shrink-0 place-items-center" style={{ width: 30, height: 30, borderRadius: "999px", background: "var(--background)" }}>
            <svg fill="none" height="14" stroke="currentColor" strokeLinecap="round" strokeWidth="2.4" viewBox="0 0 24 24" width="14">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </span>
        </button>

        <button
          className="flex flex-1 items-center gap-4 text-left transition-all hover:-translate-y-0.5"
          style={{
            minWidth: 220, padding: "18px 20px",
            borderRadius: "var(--radius-lg)",
            background: "var(--surface)", border: "1px solid var(--border)",
          }}
          onClick={() => { clearSession(); clearDocument(); router.push("/"); }}
          type="button"
        >
          <span className="inline-grid flex-shrink-0 place-items-center" style={{ width: 44, height: 44, borderRadius: "10px", background: "var(--accent-soft)", color: "var(--accent-strong)" }}>
            <svg fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeWidth="2" viewBox="0 0 24 24" width="20">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </span>
          <span className="flex-1 min-w-0">
            <span className="block text-sm font-semibold" style={{ color: "var(--foreground)" }}>回到首頁</span>
            <span className="mt-0.5 block text-xs leading-relaxed" style={{ color: "var(--muted-foreground)" }}>上傳新的 markdown 或選擇其他模式。</span>
          </span>
          <span className="inline-grid flex-shrink-0 place-items-center" style={{ width: 30, height: 30, borderRadius: "999px", background: "var(--background)" }}>
            <svg fill="none" height="14" stroke="currentColor" strokeLinecap="round" strokeWidth="2.4" viewBox="0 0 24 24" width="14">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </span>
        </button>
      </div>

      {/* Review section */}
      <div className="grid gap-8" style={{ gridTemplateColumns: "200px 1fr" }}>
        {/* Sidebar: question pips (clickable) */}
        <aside className="sticky top-20 self-start">
          <p
            className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-[0.22em]"
            style={{ color: "var(--muted-foreground)" }}
          >
            所有題目
          </p>
          <div className="mb-4 grid gap-1.5" style={{ gridTemplateColumns: "repeat(5, 1fr)" }}>
            {orderedQuestions.map((q) => {
              const isCorrect = !wrongQIdsSet.has(q.id) && !skippedQIds.has(q.id);
              const isSkipped = skippedQIds.has(q.id);
              const isWrong = wrongQIdsSet.has(q.id) && !isSkipped;
              return (
                <button
                  key={q.id}
                  className="grid aspect-square place-items-center font-mono text-[11px] font-semibold transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                  style={{
                    borderRadius: "7px",
                    border: isWrong
                      ? "1px solid var(--danger, #9b2228)"
                      : isSkipped
                        ? "1px solid var(--border-strong)"
                        : "1px solid var(--accent)",
                    background: isCorrect
                      ? "var(--accent)"
                      : isSkipped
                        ? "repeating-linear-gradient(45deg, var(--surface) 0 4px, var(--background) 4px 8px)"
                        : "var(--surface)",
                    color: isCorrect
                      ? "#fff"
                      : isWrong
                        ? "var(--danger, #9b2228)"
                        : "var(--muted-foreground)",
                  }}
                  title={`跳至 Q${questionDisplayNumbers[q.id]}`}
                  type="button"
                  onClick={() => scrollToQuestion(q.id, !isCorrect)}
                >
                  {questionDisplayNumbers[q.id]}
                </button>
              );
            })}
          </div>
          <div className="grid gap-1.5 text-[11px]" style={{ color: "var(--muted-foreground)" }}>
            <div className="flex items-center gap-2">
              <span className="inline-block h-3 w-3" style={{ borderRadius: "4px", background: "var(--accent)", border: "1px solid var(--accent)" }} />
              答對 ({evaluation.correctCount})
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-3 w-3" style={{ borderRadius: "4px", border: "1px solid var(--danger, #9b2228)" }} />
              答錯 ({incorrectAnsweredCount})
            </div>
            <div className="flex items-center gap-2">
              <span
                className="inline-block h-3 w-3"
                style={{
                  borderRadius: "4px",
                  background: "repeating-linear-gradient(45deg, var(--surface) 0 3px, var(--background) 3px 6px)",
                  border: "1px solid var(--border-strong)",
                }}
              />
              未作答 ({skippedCount})
            </div>
          </div>
        </aside>

        {/* Main review list */}
        <div>
          {/* Wrong questions */}
          <div className="mb-6 border-l-2" style={{ borderColor: "var(--border)" }}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                錯題 <span style={{ color: "var(--muted-foreground)", fontSize: "0.8em" }}>({evaluation.wrongQuestions.length})</span>
              </h2>
            </div>

            {evaluation.wrongQuestions.length === 0 ? (
              <div className="py-8 text-sm" style={{ color: "var(--muted-foreground)", paddingLeft: "32px" }}>
                這次沒有錯題，所有題目都答對了。
              </div>
            ) : (
              evaluation.wrongQuestions.map((item) => {
                const explanationHeadings = extractMarkdownHeadings(item.question.explanation ?? "");
                const isSkipped = item.selectedOptions.length === 0;
                const orderedOptions = getOrderedOptionsByQuestionId(item.question.id);

                return (
                  <article
                    id={`q-${item.question.id}`}
                    key={item.question.id}
                    className="relative border-b"
                    style={{ padding: "24px 0 24px 32px", borderColor: "var(--border)" }}
                  >
                    {/* Timeline dot */}
                    <span
                      className="absolute -left-[7px] top-8 block"
                      style={{
                        width: 12, height: 12, borderRadius: "999px",
                        background: isSkipped ? "var(--background)" : "var(--surface)",
                        border: isSkipped ? "2px solid var(--border-strong)" : "2px solid var(--danger, #9b2228)",
                      }}
                    />

                    {/* Header */}
                    <div className="mb-3 flex flex-wrap items-center gap-3">
                      <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--accent-strong)" }}>
                        Q · {String(questionDisplayNumbers[item.question.id]).padStart(2, "0")}
                      </span>
                      <span
                        className="inline-flex items-center gap-1.5 text-[11px] font-semibold"
                        style={{ color: isSkipped ? "var(--muted-foreground)" : "var(--danger, #9b2228)" }}
                      >
                        {isSkipped ? (
                          <>
                            <svg fill="none" height="11" stroke="currentColor" strokeLinecap="round" strokeWidth="2.4" viewBox="0 0 24 24" width="11"><path d="M5 12h14" /></svg>
                            未作答
                          </>
                        ) : (
                          <>
                            <svg fill="none" height="11" stroke="currentColor" strokeLinecap="round" strokeWidth="2.4" viewBox="0 0 24 24" width="11"><path d="M18 6L6 18M6 6l12 12" /></svg>
                            答錯
                          </>
                        )}
                      </span>
                    </div>

                    {/* Question text */}
                    <div className="mb-4 text-sm font-semibold leading-[1.5]" style={{ color: "var(--foreground)" }}>
                      <ExamMarkdown content={item.question.text} />
                    </div>

                    {/* Full options with highlighting */}
                    <div className="mb-4 grid gap-2">
                      {orderedOptions.map((option) => {
                        const isSelected = item.selectedOptions.some((o) => o.id === option.id);
                        const isCorrectOpt = item.correctOptions.some((o) => o.id === option.id);
                        return (
                          <OptionReviewRow
                            key={option.id}
                            isCorrect={isCorrectOpt}
                            isSelected={isSelected}
                            text={option.text}
                          />
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    {item.question.explanation ? (
                      <div
                        className="p-4 text-sm"
                        style={{ borderRadius: "var(--radius-md)", background: "var(--surface)", border: "1px solid var(--border)" }}
                      >
                        <p className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: "var(--muted-foreground)" }}>詳解</p>
                        <MarkdownView
                          className="text-sm"
                          headings={explanationHeadings}
                          markdown={item.question.explanation}
                        />
                      </div>
                    ) : null}
                  </article>
                );
              })
            )}
          </div>

          {/* Correct questions (collapsible) */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                已答對 <span style={{ color: "var(--muted-foreground)", fontSize: "0.8em" }}>({correctQuestions.length})</span>
              </h2>
              <button
                className="text-sm font-semibold transition"
                style={{ color: "var(--accent-strong)" }}
                onClick={() => setShowCorrectAnswers((v) => !v)}
                type="button"
              >
                {showCorrectAnswers ? "收合" : "展開"}
              </button>
            </div>

            {showCorrectAnswers ? (
              <div className="grid gap-4">
                {correctQuestions.map((item) => {
                  const orderedOptions = getOrderedOptionsByQuestionId(item.question.id);
                  return (
                    <div
                      id={`q-${item.question.id}`}
                      key={item.question.id}
                      className="p-4 text-sm"
                      style={{ borderRadius: "var(--radius-md)", background: "var(--surface)", border: "1px solid var(--border)" }}
                    >
                      <div className="mb-3 flex items-center gap-2">
                        <span
                          className="inline-grid flex-shrink-0 place-items-center"
                          style={{ width: 20, height: 20, borderRadius: "999px", background: "var(--accent)", color: "#fff" }}
                        >
                          <svg fill="none" height="10" stroke="currentColor" strokeLinecap="round" strokeWidth="3" viewBox="0 0 24 24" width="10">
                            <path d="M5 12l5 5L20 7" />
                          </svg>
                        </span>
                        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--accent-strong)" }}>
                          Q{questionDisplayNumbers[item.question.id]}
                        </span>
                      </div>
                      <div className="mb-3 font-semibold leading-[1.5]">
                        <ExamMarkdown content={item.question.text} />
                      </div>
                      <div className="grid gap-1.5">
                        {orderedOptions.map((option) => {
                          const isSelected = item.selectedOptions.some((o) => o.id === option.id);
                          const isCorrectOpt = item.correctOptions.some((o) => o.id === option.id);
                          return (
                            <OptionReviewRow
                              key={option.id}
                              isCorrect={isCorrectOpt}
                              isSelected={isSelected}
                              text={option.text}
                            />
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                預設收合，避免結果頁被已答對題目淹沒。
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

interface OptionReviewRowProps {
  isCorrect: boolean;
  isSelected: boolean;
  text: string;
}

function OptionReviewRow({ isCorrect, isSelected, text }: OptionReviewRowProps) {
  // isSelected + isCorrect → green fill (correct choice)
  // isSelected + !isCorrect → red fill (wrong choice)
  // !isSelected + isCorrect → green outline only (missed correct answer)
  // !isSelected + !isCorrect → neutral
  const show = isSelected || isCorrect;
  if (!show) {
    return (
      <div
        className="flex items-start gap-2.5 rounded-[10px] border px-3 py-2 text-sm"
        style={{ borderColor: "var(--border)", background: "var(--background)", color: "var(--muted-foreground)" }}
      >
        <span className="mt-0.5 h-4 w-4 flex-shrink-0 rounded border" style={{ borderColor: "var(--border-strong)" }} />
        <ExamMarkdown content={text} />
      </div>
    );
  }

  let borderColor: string;
  let bg: string;
  let iconBg: string;
  let iconContent: ReactNode;

  if (isSelected && isCorrect) {
    borderColor = "var(--accent)";
    bg = "var(--accent-soft)";
    iconBg = "var(--accent)";
    iconContent = (
      <svg fill="none" height="9" stroke="#fff" strokeLinecap="round" strokeWidth="3" viewBox="0 0 24 24" width="9">
        <path d="M5 12l5 5L20 7" />
      </svg>
    );
  } else if (isSelected && !isCorrect) {
    borderColor = "var(--danger, #9b2228)";
    bg = "rgba(155,34,40,0.06)";
    iconBg = "var(--danger, #9b2228)";
    iconContent = (
      <svg fill="none" height="9" stroke="#fff" strokeLinecap="round" strokeWidth="3" viewBox="0 0 24 24" width="9">
        <path d="M18 6L6 18M6 6l12 12" />
      </svg>
    );
  } else {
    // !isSelected && isCorrect — show correct but not chosen
    borderColor = "var(--accent)";
    bg = "var(--accent-soft)";
    iconBg = "transparent";
    iconContent = (
      <svg fill="none" height="9" stroke="var(--accent)" strokeLinecap="round" strokeWidth="2.5" viewBox="0 0 24 24" width="9">
        <path d="M5 12l5 5L20 7" />
      </svg>
    );
  }

  return (
    <div
      className="flex items-start gap-2.5 rounded-[10px] border px-3 py-2 text-sm"
      style={{ borderColor, background: bg }}
    >
      <span
        className="mt-0.5 inline-grid h-4 w-4 flex-shrink-0 place-items-center rounded border"
        style={{
          borderColor,
          background: iconBg,
        }}
      >
        {iconContent}
      </span>
      <ExamMarkdown content={text} />
    </div>
  );
}
