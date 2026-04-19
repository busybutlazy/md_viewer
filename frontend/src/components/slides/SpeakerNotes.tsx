import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import type { Slide } from "@/lib/parsers/types";

interface SpeakerNotesProps {
  currentSlide: Slide;
  nextSlide?: Slide;
}

export function SpeakerNotes({ currentSlide, nextSlide }: SpeakerNotesProps) {
  return (
    <aside className="grid gap-4 lg:w-[22rem]">
      <Card className="bg-[var(--surface-strong)]">
        <CardHeader>
          <CardTitle>Speaker Notes</CardTitle>
          <CardDescription>Current slide notes and next slide preview.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent-strong)]">
              Current
            </p>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[var(--foreground)]">
              {currentSlide.speakerNotes ?? "No speaker notes for this slide."}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent-strong)]">
              Next Slide
            </p>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[var(--muted-foreground)]">
              {nextSlide?.content ?? "End of deck."}
            </p>
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}
