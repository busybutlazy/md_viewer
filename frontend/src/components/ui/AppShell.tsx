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
            <Link className="group inline-flex items-center gap-3" href="/">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--accent)] text-sm font-bold text-[var(--accent-foreground)] shadow-[var(--shadow-soft)]">
                MR
              </span>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--muted-foreground)]">
                  Markdown Reader Pro
                </p>
                <p className="text-sm text-[var(--muted-foreground)] transition group-hover:text-[var(--foreground)]">
                  Reading · Exam · Slides
                </p>
              </div>
            </Link>
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
