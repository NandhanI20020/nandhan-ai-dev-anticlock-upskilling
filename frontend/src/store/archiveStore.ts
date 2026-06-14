import { create } from 'zustand';

export type ArchiveStatusFilter = 'all' | 'won' | 'lost';
export type ArchiveDatePreset = 'all_time' | 'this_year' | 'last_year' | 'this_quarter';

interface ArchiveStore {
  statusFilter: ArchiveStatusFilter;
  datePreset: ArchiveDatePreset;
  searchQuery: string;
  setStatusFilter: (f: ArchiveStatusFilter) => void;
  setDatePreset: (p: ArchiveDatePreset) => void;
  setSearchQuery: (q: string) => void;
}

export const useArchiveStore = create<ArchiveStore>((set) => ({
  statusFilter: 'all',
  datePreset: 'all_time',
  searchQuery: '',
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  setDatePreset: (datePreset) => set({ datePreset }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
}));
