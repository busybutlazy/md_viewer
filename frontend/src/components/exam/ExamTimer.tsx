import { cn } from "@/lib/utils";

interface ExamTimerProps {
  remainingSeconds?: number;
}

function formatRemainingTime(remainingSeconds?: number): string {
  if (typeof remainingSeconds !== "number") {
    return "No limit";
  }

  const minutes = Math.floor(remainingSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (remainingSeconds % 60).toString().padStart(2, "0");

  return `${minutes}:${seconds}`;
}

export function ExamTimer({ remainingSeconds }: ExamTimerProps) {
  const isUrgent =
    typeof remainingSeconds === "number" && remainingSeconds <= 30;

  return (
    <div
      className={cn(
        "rounded-[1.75rem] border px-4 py-3 shadow-[var(--shadow-soft)]",
        isUrgent
          ? "border-red-400/40 bg-red-500/10 text-red-700 dark:text-red-300"
          : "border-[var(--border)] bg-[var(--surface)]",
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
        Timer
      </p>
      <p className="mt-1 font-mono text-2xl font-semibold">
        {formatRemainingTime(remainingSeconds)}
      </p>
    </div>
  );
}
