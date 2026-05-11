import { ExamMarkdown } from "@/components/exam/ExamMarkdown";
import { cn } from "@/lib/utils";

interface OptionItemProps {
  checked: boolean;
  displayLabel: string;
  inputType: "checkbox" | "radio";
  name: string;
  onChange: () => void;
  text: string;
}

export function OptionItem({
  checked,
  displayLabel,
  inputType,
  name,
  onChange,
  text,
}: OptionItemProps) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-start gap-3.5 rounded-[1.75rem] border px-4 py-3.5 transition",
        checked
          ? "border-[var(--accent)] bg-[var(--accent-soft)]"
          : "border-[var(--border)] bg-[var(--surface-strong)] hover:border-[var(--border-strong)] hover:bg-[var(--surface)]",
      )}
    >
      {/* Hidden native input — keeps keyboard/screen-reader behaviour */}
      <input
        checked={checked}
        className="sr-only"
        name={name}
        onChange={onChange}
        type={inputType}
      />

      {/* Custom letter indicator — the letter IS the selector */}
      <span
        className={cn(
          "mt-0.5 inline-grid h-[26px] w-[26px] flex-shrink-0 place-items-center font-mono text-[11px] font-bold leading-none transition",
          inputType === "radio" ? "rounded-full" : "rounded-[7px]",
          checked
            ? "bg-[var(--accent)] text-white"
            : "border border-[var(--border-strong)] text-[var(--muted-foreground)]",
        )}
      >
        {checked && inputType === "checkbox" ? (
          <svg
            fill="none"
            height="11"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            viewBox="0 0 24 24"
            width="11"
          >
            <path d="M5 12l5 5L20 7" />
          </svg>
        ) : (
          displayLabel
        )}
      </span>

      <div className="flex-1 text-sm leading-[1.7] text-[var(--foreground)]">
        <ExamMarkdown content={text} />
      </div>
    </label>
  );
}
