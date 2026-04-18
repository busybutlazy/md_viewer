"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
}

function detectLanguage(className?: string): string {
  const match = className?.match(/language-([a-z0-9-]+)/i);
  return match?.[1] ?? "text";
}

function getCodeContent(children: React.ReactNode): string {
  if (typeof children === "string") {
    return children;
  }

  if (Array.isArray(children)) {
    return children.join("");
  }

  return "";
}

export function CodeBlock({ children, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const language = detectLanguage(className);
  const content = getCodeContent(children).replace(/\n$/, "");

  async function handleCopy() {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    window.setTimeout(() => {
      setCopied(false);
    }, 1200);
  }

  return (
    <div className="group my-8 overflow-hidden rounded-[2rem] border border-[var(--border-strong)] bg-[#10161c] shadow-[var(--shadow-soft)]">
      <div className="flex items-center justify-between gap-4 border-b border-white/10 bg-white/5 px-4 py-3">
        <span className="font-mono text-xs uppercase tracking-[0.22em] text-white/70">
          {language}
        </span>
        <button
          className="rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold text-white/80 transition hover:border-white/30 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
          onClick={handleCopy}
          type="button"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-5 text-sm leading-7 text-white">
        <code className={cn("font-mono", className)}>{children}</code>
      </pre>
    </div>
  );
}
