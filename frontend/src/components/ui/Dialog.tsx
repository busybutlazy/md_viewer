"use client";

import { type ReactNode, useId, useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface DialogProps {
  description: string;
  title: string;
  triggerLabel: string;
  children: ReactNode;
}

export function Dialog({
  children,
  description,
  title,
  triggerLabel,
}: DialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const descriptionId = useId();
  const titleId = useId();

  return (
    <>
      <Button onClick={() => setIsOpen(true)} variant="secondary">
        {triggerLabel}
      </Button>
      <div
        aria-hidden={!isOpen}
        className={cn(
          "fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 transition",
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <div
          aria-describedby={descriptionId}
          aria-labelledby={titleId}
          aria-modal="true"
          className="w-full max-w-lg rounded-[2rem] border border-[var(--border-strong)] bg-[var(--surface-strong)] p-6 shadow-[var(--shadow-soft)]"
          role="dialog"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold" id={titleId}>
                {title}
              </h2>
              <p
                className="text-sm leading-7 text-[var(--muted-foreground)]"
                id={descriptionId}
              >
                {description}
              </p>
            </div>
            <Button
              aria-label="Close dialog"
              className="px-4"
              onClick={() => setIsOpen(false)}
              variant="ghost"
            >
              Close
            </Button>
          </div>
          <div className="mt-5">{children}</div>
        </div>
      </div>
    </>
  );
}
