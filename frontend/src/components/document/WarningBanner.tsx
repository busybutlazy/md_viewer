"use client";

import { useState } from "react";
import { useT } from "@/lib/i18n";

interface WarningBannerProps {
  warnings: string[];
}

export function WarningBanner({ warnings }: WarningBannerProps) {
  const t = useT();
  const [expanded, setExpanded] = useState(false);

  if (warnings.length === 0) {
    return null;
  }

  return (
    <section className="rounded-xl border border-[var(--border-strong)] bg-[var(--accent-soft)] px-4 py-3">
      <button
        className="flex w-full items-center gap-3 text-left"
        onClick={() => setExpanded((v) => !v)}
        type="button"
      >
        <span
          className="inline-flex flex-shrink-0 items-center rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em]"
          style={{ background: "var(--accent)", color: "#fff" }}
        >
          {t.warnings.label}
        </span>
        <span className="flex-1 truncate text-sm font-semibold">
          {t.warnings.title}
          <span className="ml-1.5 font-mono text-[11px] font-normal text-[var(--muted-foreground)]">
            ({warnings.length})
          </span>
        </span>
        <span
          className="ml-auto flex-shrink-0 text-[var(--muted-foreground)] transition-transform duration-200"
          style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          <svg fill="none" height="14" stroke="currentColor" strokeLinecap="round" strokeWidth="2" viewBox="0 0 24 24" width="14">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </button>

      {expanded ? (
        <ul className="mt-3 grid gap-1.5 border-t border-[var(--border)] pt-3 text-sm leading-6 text-[var(--muted-foreground)]">
          {warnings.map((warning) => (
            <li key={warning} className="flex items-start gap-2">
              <span className="mt-1.5 block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--accent)]" />
              {warning}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
