"use client";

import { create } from "zustand";

interface SlidesSessionState {
  activeIndex: number;
  chromeVisible: boolean;
  hideChrome: () => void;
  isOverviewOpen: boolean;
  isSpeakerMode: boolean;
  resetSession: () => void;
  setActiveIndex: (index: number) => void;
  setChromeVisible: (visible: boolean) => void;
  toggleOverview: () => void;
  toggleSpeakerMode: () => void;
}

const INITIAL_STATE = {
  activeIndex: 0,
  chromeVisible: true,
  isOverviewOpen: false,
  isSpeakerMode: false,
};

export const useSlidesSessionStore = create<SlidesSessionState>()((set) => ({
  ...INITIAL_STATE,
  hideChrome: () => set({ chromeVisible: false }),
  resetSession: () => set(INITIAL_STATE),
  setActiveIndex: (index) => set({ activeIndex: index }),
  setChromeVisible: (visible) => set({ chromeVisible: visible }),
  toggleOverview: () =>
    set((state) => ({ isOverviewOpen: !state.isOverviewOpen })),
  toggleSpeakerMode: () =>
    set((state) => ({ isSpeakerMode: !state.isSpeakerMode })),
}));
