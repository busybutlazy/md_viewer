"use client";

import { create } from "zustand";

interface SlidesSessionState {
  activeIndex: number;
  chromeVisible: boolean;
  hideChrome: () => void;
  isOverviewOpen: boolean;
  isSpeakerMode: boolean;
  setActiveIndex: (index: number) => void;
  setChromeVisible: (visible: boolean) => void;
  toggleOverview: () => void;
  toggleSpeakerMode: () => void;
}

export const useSlidesSessionStore = create<SlidesSessionState>()((set) => ({
  activeIndex: 0,
  chromeVisible: true,
  hideChrome: () => set({ chromeVisible: false }),
  isOverviewOpen: false,
  isSpeakerMode: false,
  setActiveIndex: (index) => set({ activeIndex: index }),
  setChromeVisible: (visible) => set({ chromeVisible: visible }),
  toggleOverview: () =>
    set((state) => ({ isOverviewOpen: !state.isOverviewOpen })),
  toggleSpeakerMode: () =>
    set((state) => ({ isSpeakerMode: !state.isSpeakerMode })),
}));
