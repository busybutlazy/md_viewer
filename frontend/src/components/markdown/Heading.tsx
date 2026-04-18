import Link from "next/link";
import { cn } from "@/lib/utils";

interface HeadingProps {
  children: React.ReactNode;
  className?: string;
  id: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
}

const HEADING_TAGS = {
  1: "h1",
  2: "h2",
  3: "h3",
  4: "h4",
  5: "h5",
  6: "h6",
} as const;

const HEADING_STYLES = {
  1: "text-4xl font-semibold tracking-tight sm:text-5xl",
  2: "text-3xl font-semibold tracking-tight",
  3: "text-2xl font-semibold tracking-tight",
  4: "text-xl font-semibold tracking-tight",
  5: "text-lg font-semibold tracking-tight",
  6: "text-base font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]",
} as const;

export function Heading({
  children,
  className,
  id,
  level,
}: HeadingProps) {
  const Tag = HEADING_TAGS[level];

  return (
    <Tag className={cn("group scroll-mt-28", HEADING_STYLES[level], className)} id={id}>
      <span className="inline-flex items-start gap-3">
        <span>{children}</span>
        <Link
          aria-label={`Link to ${id}`}
          className="mt-1 text-sm text-[var(--muted-foreground)] opacity-0 transition group-hover:opacity-100 focus-visible:opacity-100"
          href={`#${id}`}
        >
          #
        </Link>
      </span>
    </Tag>
  );
}
