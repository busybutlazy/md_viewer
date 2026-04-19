interface ExamProgressBarProps {
  answeredCount: number;
  totalCount: number;
}

export function ExamProgressBar({
  answeredCount,
  totalCount,
}: ExamProgressBarProps) {
  const progress =
    totalCount === 0 ? 0 : Math.round((answeredCount / totalCount) * 100);

  return (
    <div className="sticky top-[79px] z-30 rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-soft)] lg:top-[83px]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent-strong)]">
            Progress
          </p>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            已作答 {answeredCount} / {totalCount}
          </p>
        </div>
        <p className="text-lg font-semibold">{progress}%</p>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--surface-strong)]">
        <div
          className="h-full bg-[linear-gradient(90deg,var(--accent),var(--accent-strong))] transition-[width]"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
