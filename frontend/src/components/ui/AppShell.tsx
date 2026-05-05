"use client";

import Link from "next/link";
import { FolderAccessStatus } from "@/components/folder/FolderAccessStatus";
import { FolderTreeSidebar } from "@/components/folder/FolderTreeSidebar";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useLocale, useT } from "@/lib/i18n";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const t = useT();
  const { locale, setLocale } = useLocale();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[color:var(--shell)]/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex items-center justify-between gap-3">
            <div className="inline-flex items-center gap-3">
              <Link href="/">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--accent)] text-sm font-bold text-[var(--accent-foreground)] shadow-[var(--shadow-soft)]">
                  MR
                </span>
              </Link>
              <div>
                <Link href="/">
                  <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--muted-foreground)] transition hover:text-[var(--foreground)]">
                    {t.app.title}
                  </p>
                </Link>
                <div className="flex items-center gap-1.5 text-sm text-[var(--muted-foreground)]">
                  <Link className="transition hover:text-[var(--foreground)]" href="/read">{t.nav.read}</Link>
                  <span className="opacity-40">·</span>
                  <Link className="transition hover:text-[var(--foreground)]" href="/exam">{t.nav.exam}</Link>
                  <span className="opacity-40">·</span>
                  <Link className="transition hover:text-[var(--foreground)]" href="/slides">{t.nav.slides}</Link>
                  <span className="opacity-40">·</span>
                  <Link className="transition hover:text-[var(--foreground)]" href="/edit">{t.nav.edit}</Link>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex rounded-full border border-[var(--border)] bg-[var(--surface)] p-1">
              <LangButton active={locale === "zh"} onClick={() => setLocale("zh")}>
                {t.lang.zh}
              </LangButton>
              <LangButton active={locale === "en"} onClick={() => setLocale("en")}>
                {t.lang.en}
              </LangButton>
            </div>
            <FolderAccessStatus />
            <ThemeToggle />
          </div>
        </div>
      </header>
      <div className="lg:flex">
        <FolderTreeSidebar />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}

function LangButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      aria-pressed={active}
      className={[
        "min-h-9 rounded-full px-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
        active
          ? "bg-[var(--accent)] text-[var(--accent-foreground)]"
          : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]",
      ].join(" ")}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}
