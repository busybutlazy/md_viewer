"use client";

import { useCallback, useEffect, useRef } from "react";
import { SlideFrame } from "@/components/slides/SlideFrame";
import { SlideNavigator } from "@/components/slides/SlideNavigator";
import { SlideOverview } from "@/components/slides/SlideOverview";
import { SpeakerNotes } from "@/components/slides/SpeakerNotes";
import { WarningBanner } from "@/components/document/WarningBanner";
import { useRequireDocument } from "@/components/document/ModeGuard";
import { UploadPrompt } from "@/components/document/UploadPrompt";
import { UploadTriggerButton } from "@/components/ui/UploadTriggerButton";
import { useDocumentStore } from "@/lib/store/document";
import { useSlidesSessionStore } from "@/lib/store/slides-session";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n";

export default function SlidesPage() {
  const t = useT();
  const { hasHydrated, mode, parsed, shouldShowPrompt } = useRequireDocument("slides");
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

  if (!hasHydrated) return null;
  if (shouldShowPrompt) return <UploadPrompt />;
  if (!deck) return null;

  return (
    <div
      className="slides-dark min-h-[calc(100vh-80px)]"
      onMouseMove={() => setChromeVisible(true)}
      ref={containerRef}
      style={{ background: "#0d0c0a", color: "#f2ece0" }}
    >
      <main className="mx-auto w-full max-w-[1640px] px-6 pb-36 pt-6">
        {/* Meta strip */}
        <div
          className={cn(
            "slides-chrome mb-5 transition duration-300",
            chromeVisible ? "opacity-100" : "opacity-0 pointer-events-none",
          )}
        >
          <WarningBanner warnings={warnings} />
          <div
            className="flex items-center justify-between gap-4 px-5 py-3"
            style={{
              borderRadius: "var(--radius-lg, 6px)",
              background: "rgba(242,236,224,0.04)",
              border: "1px solid rgba(242,236,224,0.08)",
            }}
          >
            <div className="flex min-w-0 flex-1 items-center gap-4">
              <span
                className="flex-shrink-0 font-mono text-[10px] font-semibold uppercase tracking-[0.2em]"
                style={{ color: "rgba(242,236,224,0.4)" }}
              >
                {t.slides.badge}
              </span>
              <span
                className="min-w-0 truncate font-serif text-base font-medium"
                style={{ color: "#f2ece0" }}
              >
                {deck.meta.title}
              </span>
              {deck.meta.theme ? (
                <span
                  className="flex-shrink-0 font-mono text-[10px] uppercase tracking-[0.1em]"
                  style={{ color: "rgba(242,236,224,0.4)" }}
                >
                  {deck.meta.theme}
                </span>
              ) : null}
            </div>
            <div className="flex flex-shrink-0 items-center gap-3">
              <span
                className="font-mono text-[12px]"
                style={{ color: "rgba(242,236,224,0.5)" }}
              >
                <strong style={{ color: "#f2ece0" }}>{safeActiveIndex + 1}</strong>
                {" / "}
                {totalSlides}
              </span>
              <UploadTriggerButton />
            </div>
          </div>
        </div>

        {/* Slide area */}
        {currentSlide ? (
          <div className={cn("grid gap-5", isSpeakerMode ? "xl:grid-cols-[minmax(0,1.85fr)_minmax(0,1fr)]" : "")}>
            <SlideFrame deck={deck} isActive slide={currentSlide} />
            {isSpeakerMode ? (
              <SpeakerNotes currentSlide={currentSlide} nextSlide={nextSlide} />
            ) : null}
          </div>
        ) : (
          <div
            className="py-16 text-center text-sm"
            style={{ color: "rgba(242,236,224,0.45)" }}
          >
            {t.slides.noSlides}
          </div>
        )}
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
