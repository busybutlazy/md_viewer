import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface SlideNavigatorProps {
  activeIndex: number;
  chromeVisible: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
  isOverviewOpen: boolean;
  isSpeakerMode: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onPrint: () => void;
  onToggleFullscreen: () => void;
  onToggleOverview: () => void;
  onToggleSpeakerMode: () => void;
  totalSlides: number;
}

export function SlideNavigator({
  activeIndex,
  chromeVisible,
  hasNext,
  hasPrevious,
  isOverviewOpen,
  isSpeakerMode,
  onNext,
  onPrevious,
  onPrint,
  onToggleFullscreen,
  onToggleOverview,
  onToggleSpeakerMode,
  totalSlides,
}: SlideNavigatorProps) {
  return (
    <div
      className={cn(
        "fixed bottom-4 left-1/2 z-40 w-[min(92vw,58rem)] -translate-x-1/2 rounded-full border border-[var(--border-strong)] bg-[color:var(--shell)]/90 px-3 py-3 shadow-[var(--shadow-soft)] backdrop-blur transition",
        chromeVisible ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-between">
        <div className="flex items-center gap-2">
          <Button disabled={!hasPrevious} onClick={onPrevious} variant="secondary">
            Prev
          </Button>
          <Button disabled={!hasNext} onClick={onNext} variant="secondary">
            Next
          </Button>
        </div>
        <p className="px-2 text-sm font-semibold text-[var(--foreground)]">
          Slide {activeIndex + 1} / {totalSlides}
        </p>
        <div className="flex items-center gap-2">
          <Button onClick={onToggleOverview} variant={isOverviewOpen ? "primary" : "ghost"}>
            Overview
          </Button>
          <Button onClick={onToggleSpeakerMode} variant={isSpeakerMode ? "primary" : "ghost"}>
            Speaker
          </Button>
          <Button onClick={onToggleFullscreen} variant="ghost">
            Fullscreen
          </Button>
          <Button onClick={onPrint} variant="ghost">
            Export PDF
          </Button>
        </div>
      </div>
    </div>
  );
}
