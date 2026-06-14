import { create } from 'zustand';
import type { RecentlyViewedItem } from '../../../shared/types/search';

interface SearchStore {
  isOpen: boolean;
  recentlyViewed: RecentlyViewedItem[];
  setOpen: (open: boolean) => void;
  addRecent: (item: Omit<RecentlyViewedItem, 'viewedAt'>) => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  isOpen: false,
  recentlyViewed: [],
  setOpen: (isOpen) => set({ isOpen }),
  addRecent: (item) =>
    set((s) => {
      const filtered = s.recentlyViewed.filter((r) => r.id !== item.id || r.type !== item.type);
      return {
        recentlyViewed: [{ ...item, viewedAt: new Date().toISOString() }, ...filtered].slice(0, 5),
      };
    }),
}));
