import { MarkdownView } from "@/components/markdown/MarkdownView";
import type { Slide, SlideDeck } from "@/lib/parsers/types";
import { extractMarkdownHeadings } from "@/lib/markdown/headings";
import { cn } from "@/lib/utils";

interface SlideFrameProps {
  deck: SlideDeck;
  isActive?: boolean;
  slide: Slide;
}

const ASPECT_RATIO_CLASSES = {
  "16:9": "aspect-[16/9]",
  "4:3": "aspect-[4/3]",
} as const;

const THEME_CLASSES = {
  dark:
    "bg-[radial-gradient(circle_at_top,_rgba(226,161,100,0.12),_transparent_32%),linear-gradient(180deg,#10161d,#131b24)] text-[#f4efe7]",
  default:
    "bg-[radial-gradient(circle_at_top,_rgba(190,106,50,0.14),_transparent_28%),linear-gradient(180deg,#fcfaf6,#f1ebe1)] text-[#13202a]",
  minimal: "bg-[#faf7f1] text-[#11161d]",
} as const;

export function SlideFrame({ deck, isActive = false, slide }: SlideFrameProps) {
  const headings = extractMarkdownHeadings(slide.content);

  return (
    <article
      className={cn(
        "slide-frame relative w-full overflow-hidden rounded-[2.5rem] border border-[var(--border-strong)] shadow-[var(--shadow-soft)]",
        ASPECT_RATIO_CLASSES[deck.meta.aspectRatio],
        THEME_CLASSES[deck.meta.theme],
        isActive ? "" : "opacity-85",
      )}
      data-slide-theme={deck.meta.theme}
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),transparent_30%)]" />
      <div className="slide-surface relative flex h-full flex-col justify-between p-8 sm:p-10 lg:p-14">
        <div className="slide-markdown max-w-none flex-1">
          <MarkdownView headings={headings} markdown={slide.content} />
        </div>
        <div className="mt-6 flex items-center justify-between text-sm text-current/70">
          <span>{deck.meta.title}</span>
          <span>
            {slide.index + 1} / {deck.slides.length}
          </span>
        </div>
      </div>
    </article>
  );
}
