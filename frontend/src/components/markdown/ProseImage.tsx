"use client";

import { useEffect, useState } from "react";
import { isRelativeImageSrc, resolveImageUrl } from "@/lib/fs/image-resolver";

interface ProseImageProps {
  alt?: string;
  src?: string;
  title?: string;
}

export function ProseImage({ alt, src, title }: ProseImageProps) {
  const isAbsolute = src ? !isRelativeImageSrc(src) : false;
  const [resolvedSrc, setResolvedSrc] = useState<string | undefined>(
    isAbsolute ? src : undefined,
  );

  useEffect(() => {
    if (!src || !isRelativeImageSrc(src)) return;

    let cancelled = false;
    resolveImageUrl(src).then((url) => {
      if (!cancelled && url) setResolvedSrc(url);
    });
    return () => {
      cancelled = true;
    };
  }, [src]);

  if (!resolvedSrc) return null;

  return (
    <figure className="my-10 overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface-strong)] shadow-[var(--shadow-soft)]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt={alt ?? title ?? ""}
        className="block h-auto w-full"
        loading="lazy"
        src={resolvedSrc}
      />
      {(alt || title) ? (
        <figcaption className="border-t border-[var(--border)] px-5 py-4 text-sm leading-7 text-[var(--muted-foreground)]">
          {alt ?? title}
        </figcaption>
      ) : null}
    </figure>
  );
}
