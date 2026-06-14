import { create } from 'zustand';
import type { DealListFilters } from '../../../shared/types/deal';

interface DealsListStore {
  filters: DealListFilters;
  sort: string;
  sortDir: 'asc' | 'desc';
  selectedIds: Set<string>;
  page: number;
  perPage: number;

  setFilters: (filters: Partial<DealListFilters>) => void;
  clearFilters: () => void;
  setSort: (sort: string) => void;
  toggleSortDir: () => void;
  toggleSelected: (id: string) => void;
  setAllSelected: (ids: string[]) => void;
  clearSelected: () => void;
  setPage: (page: number) => void;
}

const DEFAULT_FILTERS: DealListFilters = { status: 'all' };

export const useDealsListStore = create<DealsListStore>((set) => ({
  filters: { ...DEFAULT_FILTERS },
  sort: 'createdAt',
  sortDir: 'desc',
  selectedIds: new Set<string>(),
  page: 1,
  perPage: 15,

  setFilters: (partial) =>
    set((s) => ({ filters: { ...s.filters, ...partial }, page: 1 })),

  clearFilters: () =>
    set({ filters: { ...DEFAULT_FILTERS }, page: 1 }),

  setSort: (sort) =>
    set((s) => ({
      sort,
      sortDir: s.sort === sort ? (s.sortDir === 'asc' ? 'desc' : 'asc') : 'desc',
      page: 1,
    })),

  toggleSortDir: () =>
    set((s) => ({ sortDir: s.sortDir === 'asc' ? 'desc' : 'asc' })),

  toggleSelected: (id) =>
    set((s) => {
      const next = new Set(s.selectedIds);
      next.has(id) ? next.delete(id) : next.add(id);
      return { selectedIds: next };
    }),

  setAllSelected: (ids) =>
    set({ selectedIds: new Set(ids) }),

  clearSelected: () =>
    set({ selectedIds: new Set<string>() }),

  setPage: (page) => set({ page }),
}));
