import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
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
                    Markdown Reader Pro
                  </p>
                </Link>
                <div className="flex items-center gap-1.5 text-sm text-[var(--muted-foreground)]">
                  <Link className="transition hover:text-[var(--foreground)]" href="/read">Read</Link>
                  <span className="opacity-40">·</span>
                  <Link className="transition hover:text-[var(--foreground)]" href="/exam">Exam</Link>
                  <span className="opacity-40">·</span>
                  <Link className="transition hover:text-[var(--foreground)]" href="/slides">Slides</Link>
                </div>
              </div>
            </div>
            <Badge className="lg:hidden" tone="accent">
              P1.1
            </Badge>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Badge className="hidden lg:inline-flex" tone="accent">
              Design System
            </Badge>
            <ThemeToggle />
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
