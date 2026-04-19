import { ExamMarkdown } from "@/components/exam/ExamMarkdown";
import { OptionItem } from "@/components/exam/OptionItem";
import type { Option, Question } from "@/lib/parsers/types";

interface QuestionCardProps {
  answerCount: number;
  displayNumber: number;
  onSelect: (optionId: string) => void;
  orderedOptions: Option[];
  question: Question;
  selectedOptionIds: string[];
}

export function QuestionCard({
  answerCount,
  displayNumber,
  onSelect,
  orderedOptions,
  question,
  selectedOptionIds,
}: QuestionCardProps) {
  const selectionLabel = question.isMulti ? "複選題" : "單選題";

  return (
    <section
      className="rounded-[2rem] border border-[var(--border-strong)] bg-[var(--surface-strong)] p-6 shadow-[var(--shadow-soft)]"
      id={`question-${displayNumber}`}
    >
      <div className="flex flex-col gap-3 border-b border-[var(--border)] pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent-strong)]">
            Q{displayNumber}
          </p>
          <div className="text-lg font-semibold leading-8 text-[var(--foreground)]">
            <ExamMarkdown content={question.text} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-[var(--surface)] px-3 py-1 text-xs font-semibold text-[var(--muted-foreground)]">
            {selectionLabel}
          </span>
          <span className="rounded-full bg-[var(--surface)] px-3 py-1 text-xs font-semibold text-[var(--muted-foreground)]">
            已選 {answerCount}
          </span>
        </div>
      </div>
      <div className="mt-5 grid gap-3">
        {orderedOptions.map((option, index) => (
          <OptionItem
            checked={selectedOptionIds.includes(option.id)}
            displayLabel={String.fromCharCode(65 + index)}
            inputType={question.isMulti ? "checkbox" : "radio"}
            key={option.id}
            name={question.id}
            onChange={() => onSelect(option.id)}
            text={option.text}
          />
        ))}
      </div>
    </section>
  );
}
