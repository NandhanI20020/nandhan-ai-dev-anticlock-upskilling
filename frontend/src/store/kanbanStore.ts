import { create } from 'zustand';

interface KanbanFilters {
  ownerId: string | null;
  search: string;
  labels: string[];
}

interface KanbanStore {
  activeCardId: string | null;
  overColumnId: string | null;
  setActiveCardId: (id: string | null) => void;
  setOverColumnId: (id: string | null) => void;
  filters: KanbanFilters;
  setFilters: (f: Partial<KanbanFilters>) => void;
  resetFilters: () => void;
}

const DEFAULT_FILTERS: KanbanFilters = { ownerId: null, search: '', labels: [] };

export const useKanbanStore = create<KanbanStore>((set) => ({
  activeCardId: null,
  overColumnId: null,
  setActiveCardId: (id) => set({ activeCardId: id }),
  setOverColumnId: (id) => set({ overColumnId: id }),
  filters: DEFAULT_FILTERS,
  setFilters: (f) => set((s) => ({ filters: { ...s.filters, ...f } })),
  resetFilters: () => set({ filters: DEFAULT_FILTERS }),
}));
