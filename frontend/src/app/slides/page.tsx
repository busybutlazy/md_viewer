"use client";

import { useCallback, useEffect, useRef } from "react";
import { SlideFrame } from "@/components/slides/SlideFrame";
import { SlideNavigator } from "@/components/slides/SlideNavigator";
import { SlideOverview } from "@/components/slides/SlideOverview";
import { SpeakerNotes } from "@/components/slides/SpeakerNotes";
import { WarningBanner } from "@/components/document/WarningBanner";
import { Badge } from "@/components/ui/Badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { useRequireDocument } from "@/components/document/ModeGuard";
import { useDocumentStore } from "@/lib/store/document";
import { useSlidesSessionStore } from "@/lib/store/slides-session";
import { cn } from "@/lib/utils";

export default function SlidesPage() {
  const { hasHydrated, mode, parsed } = useRequireDocument();
  const warnings = useDocumentStore((state) => state.warnings);
  const activeIndex = useSlidesSessionStore((state) => state.activeIndex);
  const chromeVisible = useSlidesSessionStore((state) => state.chromeVisible);
  const isOverviewOpen = useSlidesSessionStore((state) => state.isOverviewOpen);
  const isSpeakerMode = useSlidesSessionStore((state) => state.isSpeakerMode);
  const hideChrome = useSlidesSessionStore((state) => state.hideChrome);
  const setActiveIndex = useSlidesSessionStore((state) => state.setActiveIndex);
  const setChromeVisible = useSlidesSessionStore((state) => state.setChromeVisible);
  const toggleOverview = useSlidesSessionStore((state) => state.toggleOverview);
  const toggleSpeakerMode = useSlidesSessionStore((state) => state.toggleSpeakerMode);
  const containerRef = useRef<HTMLDivElement>(null);
  const deck =
    mode === "slides" && parsed && "slides" in parsed ? parsed : undefined;

  const totalSlides = deck?.slides.length ?? 0;
  const safeActiveIndex =
    totalSlides === 0 ? 0 : Math.min(activeIndex, totalSlides - 1);
  const currentSlide = deck?.slides[safeActiveIndex];
  const nextSlide = deck?.slides[safeActiveIndex + 1];

  const goToSlide = useCallback((index: number) => {
    if (totalSlides === 0) {
      return;
    }

    setActiveIndex(Math.min(Math.max(index, 0), totalSlides - 1));
    setChromeVisible(true);
  }, [setActiveIndex, setChromeVisible, totalSlides]);

  const handleToggleFullscreen = useCallback(() => {
    const element = containerRef.current;

    if (!element) {
      return;
    }

    if (document.fullscreenElement) {
      void document.exitFullscreen();
      return;
    }

    void element.requestFullscreen();
  }, []);

  useEffect(() => {
    if (!deck) {
      return;
    }

    if (safeActiveIndex !== activeIndex) {
      setActiveIndex(safeActiveIndex);
    }
  }, [activeIndex, deck, safeActiveIndex, setActiveIndex]);

  useEffect(() => {
    if (!deck) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowRight" || event.key === "PageDown" || event.key === " ") {
        event.preventDefault();
        goToSlide(safeActiveIndex + 1);
      }

      if (event.key === "ArrowLeft" || event.key === "PageUp") {
        event.preventDefault();
        goToSlide(safeActiveIndex - 1);
      }

      if (event.key === "Home") {
        event.preventDefault();
        goToSlide(0);
      }

      if (event.key === "End") {
        event.preventDefault();
        goToSlide(totalSlides - 1);
      }

      if (event.key.toLowerCase() === "f") {
        event.preventDefault();
        handleToggleFullscreen();
      }

      if (event.key === "Escape" && document.fullscreenElement) {
        event.preventDefault();
        void document.exitFullscreen();
      }

      if (event.key.toLowerCase() === "o") {
        event.preventDefault();
        toggleOverview();
      }

      if (event.key.toLowerCase() === "s") {
        event.preventDefault();
        toggleSpeakerMode();
      }

      setChromeVisible(true);
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    deck,
    goToSlide,
    handleToggleFullscreen,
    safeActiveIndex,
    setChromeVisible,
    toggleOverview,
    toggleSpeakerMode,
    totalSlides,
  ]);

  useEffect(() => {
    if (!deck) {
      return;
    }

    if (!document.fullscreenElement) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      hideChrome();
    }, 3000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [activeIndex, chromeVisible, deck, hideChrome, isOverviewOpen, isSpeakerMode]);

  if (!hasHydrated || !deck) {
    return null;
  }

  return (
    <div
      className="min-h-[calc(100vh-80px)]"
      onMouseMove={() => setChromeVisible(true)}
      ref={containerRef}
    >
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className={cn("slides-chrome transition", chromeVisible ? "opacity-100" : "opacity-0")}>
            <WarningBanner warnings={warnings} />
            <Card className="border-[var(--border-strong)] bg-[var(--surface-strong)]">
              <CardHeader>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge className="w-fit" tone="accent">
                    Slides Mode
                  </Badge>
                  <Badge tone="outline">{deck.meta.theme}</Badge>
                  <Badge tone="outline">{deck.meta.aspectRatio}</Badge>
                </div>
                <CardTitle>{deck.meta.title}</CardTitle>
                <CardDescription>
                  鍵盤切頁、overview、speaker mode、fullscreen 與 print export
                  都在這個模式內完成。
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {currentSlide ? (
            <div className={cn("grid gap-6", isSpeakerMode ? "xl:grid-cols-[minmax(0,1fr)_22rem]" : "")}>
              <div>
                <SlideFrame deck={deck} isActive slide={currentSlide} />
              </div>
              {isSpeakerMode ? (
                <SpeakerNotes currentSlide={currentSlide} nextSlide={nextSlide} />
              ) : null}
            </div>
          ) : (
            <Card className="border-[var(--border-strong)] bg-[var(--surface-strong)]">
              <CardContent className="mt-0 py-8 text-sm text-[var(--muted-foreground)]">
                目前沒有可顯示的投影片。請確認 markdown 內容包含有效分頁。
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <SlideOverview
        activeIndex={safeActiveIndex}
        deck={deck}
        isOpen={isOverviewOpen}
        onSelect={(index) => {
          goToSlide(index);
          if (isOverviewOpen) {
            toggleOverview();
          }
        }}
      />

      <SlideNavigator
        activeIndex={safeActiveIndex}
        chromeVisible={chromeVisible}
        hasNext={safeActiveIndex < totalSlides - 1}
        hasPrevious={safeActiveIndex > 0}
        isOverviewOpen={isOverviewOpen}
        isSpeakerMode={isSpeakerMode}
        onNext={() => goToSlide(safeActiveIndex + 1)}
        onPrevious={() => goToSlide(safeActiveIndex - 1)}
        onPrint={() => window.print()}
        onToggleFullscreen={handleToggleFullscreen}
        onToggleOverview={toggleOverview}
        onToggleSpeakerMode={toggleSpeakerMode}
        totalSlides={totalSlides}
      />

      <div className="slides-print-list hidden">
        {deck.slides.map((slide) => (
          <div className="mb-6" key={slide.index}>
            <SlideFrame deck={deck} slide={slide} />
          </div>
        ))}
      </div>
    </div>
  );
}
