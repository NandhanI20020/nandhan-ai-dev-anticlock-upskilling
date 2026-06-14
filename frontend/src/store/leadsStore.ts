import { create } from 'zustand';
import type { LeadStatus } from '../../../shared/types/lead';

interface LeadsStore {
  activeTab: LeadStatus | 'all';
  sortField: string;
  sortDir: 'asc' | 'desc';
  sourceFilter: string | null;
  setActiveTab: (tab: LeadStatus | 'all') => void;
  setSortField: (field: string) => void;
  setSourceFilter: (source: string | null) => void;
}

export const useLeadsStore = create<LeadsStore>((set) => ({
  activeTab: 'all',
  sortField: 'intentScore',
  sortDir: 'desc',
  sourceFilter: null,
  setActiveTab: (activeTab) => set({ activeTab }),
  setSortField: (sortField) => set((s) => ({ sortField, sortDir: s.sortField === sortField ? (s.sortDir === 'asc' ? 'desc' : 'asc') : 'desc' })),
  setSourceFilter: (sourceFilter) => set({ sourceFilter }),
}));
