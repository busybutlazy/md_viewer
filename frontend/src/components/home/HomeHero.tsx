"use client";

import { useT } from "@/lib/i18n";

export function HomeHero() {
  const t = useT();
  return (
    <div>
      {/* Eyebrow */}
      <div className="mb-5 flex items-center gap-2.5">
        <span
          className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--accent)]"
          style={{ boxShadow: "0 0 0 4px var(--accent-soft)" }}
        />
        <span className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[var(--accent-strong)]">
          {t.app.tagline}
        </span>
      </div>

      {/* H1 — Newsreader serif */}
      <h1
        className="mb-6 font-serif font-medium leading-[1.02] tracking-[-0.02em]"
        style={{ fontSize: "clamp(2.75rem, 5.5vw, 5.5rem)" }}
      >
        Markdown
        <br />
        Reader{" "}
        <em className="italic text-[var(--accent-strong)]">Pro</em>
      </h1>

      {/* Lead text */}
      <p
        className="max-w-[480px] leading-[1.7] text-[var(--ink-soft)]"
        style={{ fontSize: "17px" }}
      >
        {t.app.description}
      </p>
    </div>
  );
}
