import { Badge } from "@/components/ui/Badge";

interface WarningBannerProps {
  warnings: string[];
}

export function WarningBanner({ warnings }: WarningBannerProps) {
  if (warnings.length === 0) {
    return null;
  }

  return (
    <section className="rounded-3xl border border-[var(--border-strong)] bg-[var(--accent-soft)] p-5">
      <div className="flex items-center gap-3">
        <Badge tone="accent">Warnings</Badge>
        <p className="text-sm font-semibold">Parser emitted non-fatal warnings.</p>
      </div>
      <ul className="mt-3 grid gap-2 text-sm leading-7 text-[var(--muted-foreground)]">
        {warnings.map((warning) => (
          <li key={warning}>- {warning}</li>
        ))}
      </ul>
    </section>
  );
}
