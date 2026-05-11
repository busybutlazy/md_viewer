"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FolderAccessStatus } from "@/components/folder/FolderAccessStatus";
import { FolderTreeSidebar } from "@/components/folder/FolderTreeSidebar";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/utils";
import { useLocale, useT } from "@/lib/i18n";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const t = useT();
  const { locale, setLocale } = useLocale();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b-[1.5px] border-[var(--foreground)] bg-[var(--background)]">
        <div className="mx-auto flex w-full max-w-[1280px] items-center gap-4 px-8 py-3.5">
          {/* Brand */}
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="flex h-[38px] w-[38px] flex-shrink-0 items-center justify-center bg-[var(--foreground)] font-serif text-[13px] font-bold italic text-[var(--background)]">
              MR
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--muted-foreground)]">
                {t.app.title}
              </p>
              <p className="text-[13px] font-semibold text-[var(--foreground)]">
                {t.app.tagline}
              </p>
            </div>
          </Link>

          <div className="flex-1" />

          {/* Mode nav (segmented) */}
          <nav className="hidden items-center gap-0.5 rounded-full border border-[var(--border-strong)] bg-[var(--surface)] p-1 sm:inline-flex">
            <NavLink href="/read">{t.nav.read}</NavLink>
            <NavLink href="/exam">{t.nav.exam}</NavLink>
            <NavLink href="/slides">{t.nav.slides}</NavLink>
            <NavLink href="/edit">{t.nav.edit}</NavLink>
          </nav>

          <div className="flex items-center gap-2">
            {/* Language pill */}
            <div className="inline-flex border border-[var(--border-strong)] bg-[var(--surface)] p-0.5">
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

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center rounded-full px-3.5 py-1.5 text-[13px] font-medium transition",
        isActive
          ? "bg-[var(--accent)] text-[var(--accent-foreground)]"
          : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]",
      )}
    >
      {children}
    </Link>
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
      className={cn(
        "inline-flex min-h-8 items-center justify-center px-3 text-[12px] font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
        active
          ? "bg-[var(--accent)] text-[var(--accent-foreground)]"
          : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]",
      )}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}
