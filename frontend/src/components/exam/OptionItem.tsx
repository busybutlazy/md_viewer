import { ExamMarkdown } from "@/components/exam/ExamMarkdown";
import { cn } from "@/lib/utils";

interface OptionItemProps {
  checked: boolean;
  inputType: "checkbox" | "radio";
  name: string;
  onChange: () => void;
  optionId: string;
  text: string;
}

export function OptionItem({
  checked,
  inputType,
  name,
  onChange,
  optionId,
  text,
}: OptionItemProps) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-start gap-4 rounded-[1.75rem] border px-4 py-4 transition",
        checked
          ? "border-[var(--accent)] bg-[var(--accent-soft)]"
          : "border-[var(--border)] bg-[var(--surface-strong)] hover:border-[var(--border-strong)] hover:bg-[var(--surface)]",
      )}
    >
      <input
        checked={checked}
        className="mt-1 h-4 w-4 accent-[var(--accent)]"
        name={name}
        onChange={onChange}
        type={inputType}
      />
      <div className="flex-1 text-sm leading-7 text-[var(--foreground)]">
        <p className="mb-1 font-mono text-xs uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
          {optionId}
        </p>
        <ExamMarkdown content={text} />
      </div>
    </label>
  );
}
