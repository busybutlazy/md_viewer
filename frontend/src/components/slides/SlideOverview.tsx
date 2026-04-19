import type { SlideDeck } from "@/lib/parsers/types";
import { cn } from "@/lib/utils";

interface SlideOverviewProps {
  activeIndex: number;
  deck: SlideDeck;
  isOpen: boolean;
  onSelect: (index: number) => void;
}

export function SlideOverview({
  activeIndex,
  deck,
  isOpen,
  onSelect,
}: SlideOverviewProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-30 overflow-auto bg-slate-950/60 px-4 py-24 backdrop-blur",
        isOpen ? "block" : "hidden",
      )}
    >
      <div className="mx-auto grid w-full max-w-7xl gap-4 md:grid-cols-2 xl:grid-cols-3">
        {deck.slides.map((slide) => (
          <button
            className={cn(
              "rounded-[2rem] border p-5 text-left shadow-[var(--shadow-soft)] transition",
              activeIndex === slide.index
                ? "border-[var(--accent)] bg-[var(--surface-strong)]"
                : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-strong)]",
            )}
            key={slide.index}
            onClick={() => onSelect(slide.index)}
            type="button"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent-strong)]">
              Slide {slide.index + 1}
            </p>
            <pre className="mt-3 line-clamp-8 whitespace-pre-wrap text-sm leading-6 text-[var(--foreground)]">
              {slide.content}
            </pre>
          </button>
        ))}
      </div>
    </div>
  );
}
