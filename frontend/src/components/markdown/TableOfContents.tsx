"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import type { MarkdownHeading } from "@/lib/markdown/headings";
import { cn } from "@/lib/utils";

interface TableOfContentsProps {
  headings: MarkdownHeading[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>();
  const [isOpen, setIsOpen] = useState(false);
  const tocHeadings = useMemo(
    () => headings.filter((heading) => heading.depth === 2 || heading.depth === 3),
    [headings],
  );

  useEffect(() => {
    if (tocHeadings.length === 0) {
      return;
    }

    const elements = tocHeadings
      .map((heading) => document.getElementById(heading.id))
      .filter((element): element is HTMLElement => element instanceof HTMLElement);

    if (elements.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (entryA, entryB) =>
              entryB.intersectionRatio - entryA.intersectionRatio,
          );

        if (visible[0]?.target instanceof HTMLElement) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-20% 0px -65% 0px",
        threshold: [0.15, 0.4, 0.75],
      },
    );

    elements.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
    };
  }, [tocHeadings]);

  if (tocHeadings.length === 0) {
    return null;
  }

  return (
    <>
      <div className="fixed bottom-5 right-4 z-30 lg:hidden">
        <Button
          aria-expanded={isOpen}
          className="shadow-[var(--shadow-soft)]"
          onClick={() => setIsOpen((value) => !value)}
          variant="secondary"
        >
          {isOpen ? "Hide TOC" : "Show TOC"}
        </Button>
      </div>
      <aside
        className={cn(
          "rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-soft)]",
          "lg:sticky lg:top-28 lg:block",
          isOpen ? "fixed inset-x-4 bottom-20 z-30 block" : "hidden",
        )}
      >
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent-strong)]">
          Table of Contents
        </p>
        <nav aria-label="Table of contents" className="mt-4">
          <ol className="grid gap-1">
            {tocHeadings.map((heading) => (
              <li key={heading.id}>
                <a
                  className={cn(
                    "block rounded-2xl px-3 py-2 text-sm leading-6 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
                    heading.depth === 3 ? "ml-4" : "",
                    activeId === heading.id
                      ? "bg-[var(--accent-soft)] font-semibold text-[var(--accent-strong)]"
                      : "text-[var(--muted-foreground)] hover:bg-[var(--surface-strong)] hover:text-[var(--foreground)]",
                  )}
                  href={`#${heading.id}`}
                  onClick={() => setIsOpen(false)}
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </aside>
    </>
  );
}
