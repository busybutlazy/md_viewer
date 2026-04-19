"use client";

import { describe, expect, it } from "vitest";
import { useSlidesSessionStore } from "@/lib/store/slides-session";

describe("useSlidesSessionStore", () => {
  it("tracks slide index and toggles overlays", () => {
    const store = useSlidesSessionStore.getState();

    store.setActiveIndex(3);
    store.toggleOverview();
    store.toggleSpeakerMode();
    store.hideChrome();

    const nextState = useSlidesSessionStore.getState();

    expect(nextState.activeIndex).toBe(3);
    expect(nextState.isOverviewOpen).toBe(true);
    expect(nextState.isSpeakerMode).toBe(true);
    expect(nextState.chromeVisible).toBe(false);

    nextState.setChromeVisible(true);
    expect(useSlidesSessionStore.getState().chromeVisible).toBe(true);
  });
});
