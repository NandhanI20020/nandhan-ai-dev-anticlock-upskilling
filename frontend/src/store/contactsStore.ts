import { create } from 'zustand';

export interface PeopleFilters {
  myPeople?: boolean;
  ownerId?: string;
  label?: string;
  orgId?: string;
  search?: string;
}

interface ContactsStore {
  filters: PeopleFilters;
  sort: string;
  sortDir: 'asc' | 'desc';
  selectedIds: Set<string>;
  page: number;
  perPage: number;
  setFilters: (f: Partial<PeopleFilters>) => void;
  clearFilters: () => void;
  setSort: (s: string) => void;
  toggleSelected: (id: string) => void;
  setAllSelected: (ids: string[]) => void;
  clearSelected: () => void;
  setPage: (p: number) => void;
}

export const useContactsStore = create<ContactsStore>((set) => ({
  filters: {},
  sort: 'createdAt',
  sortDir: 'desc',
  selectedIds: new Set<string>(),
  page: 1,
  perPage: 15,
  setFilters: (f) => set((s) => ({ filters: { ...s.filters, ...f }, page: 1 })),
  clearFilters: () => set({ filters: {}, page: 1 }),
  setSort: (sort) => set((s) => ({ sort, sortDir: s.sort === sort ? (s.sortDir === 'asc' ? 'desc' : 'asc') : 'desc', page: 1 })),
  toggleSelected: (id) => set((s) => { const n = new Set(s.selectedIds); n.has(id) ? n.delete(id) : n.add(id); return { selectedIds: n }; }),
  setAllSelected: (ids) => set({ selectedIds: new Set(ids) }),
  clearSelected: () => set({ selectedIds: new Set<string>() }),
  setPage: (page) => set({ page }),
}));
