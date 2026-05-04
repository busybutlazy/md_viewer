"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface FolderSessionState {
  expandedPaths: string[];
  isDrawerOpen: boolean;
  searchQuery: string;
  closeDrawer: () => void;
  openDrawer: () => void;
  setSearchQuery: (query: string) => void;
  toggleExpanded: (path: string) => void;
}

export const useFolderSessionStore = create<FolderSessionState>()(
  persist(
    (set) => ({
      expandedPaths: [],
      isDrawerOpen: false,
      searchQuery: "",
      closeDrawer: () => set({ isDrawerOpen: false }),
      openDrawer: () => set({ isDrawerOpen: true }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      toggleExpanded: (path) =>
        set((state) => ({
          expandedPaths: state.expandedPaths.includes(path)
            ? state.expandedPaths.filter((item) => item !== path)
            : [...state.expandedPaths, path],
        })),
    }),
    {
      name: "mrp-folder-session",
      partialize: (state) => ({
        expandedPaths: state.expandedPaths,
        searchQuery: state.searchQuery,
      }),
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
