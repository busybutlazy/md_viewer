import Image from "next/image";

interface ProseImageProps {
  alt?: string;
  src?: string;
  title?: string;
}

export function ProseImage({ alt, src, title }: ProseImageProps) {
  if (!src) {
    return null;
  }

  return (
    <figure className="my-10 overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--surface-strong)] shadow-[var(--shadow-soft)]">
      <div className="relative aspect-[16/9] w-full bg-[var(--surface)]">
        <Image
          alt={alt ?? title ?? ""}
          className="object-cover"
          fill
          loading="lazy"
          sizes="(min-width: 1024px) 960px, 100vw"
          src={src}
          unoptimized
        />
      </div>
      {(alt || title) ? (
        <figcaption className="border-t border-[var(--border)] px-5 py-4 text-sm leading-7 text-[var(--muted-foreground)]">
          {alt ?? title}
        </figcaption>
      ) : null}
    </figure>
  );
}
