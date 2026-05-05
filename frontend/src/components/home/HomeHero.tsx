"use client";

import { useT } from "@/lib/i18n";

export function HomeHero() {
  const t = useT();
  return (
    <section className="mb-14">
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.32em] text-[var(--accent-strong)]">
        {t.app.tagline}
      </p>
      <h1 className="mb-5 text-5xl font-semibold tracking-tight text-balance sm:text-6xl">
        {t.app.title}
      </h1>
      <p className="max-w-md text-base leading-8 text-[var(--muted-foreground)]">
        {t.app.description}
      </p>
    </section>
  );
}
