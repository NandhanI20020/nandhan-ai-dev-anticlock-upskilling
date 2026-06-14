import { create } from 'zustand';
import type { ActivityType } from '../../../shared/types/activity';

interface DealDetailStore {
  activeLogType: ActivityType | null;
  setActiveLogType: (t: ActivityType | null) => void;
  editingField: string | null;
  setEditingField: (f: string | null) => void;
}

export const useDealDetailStore = create<DealDetailStore>((set) => ({
  activeLogType: null,
  setActiveLogType: (t) => set({ activeLogType: t }),
  editingField: null,
  setEditingField: (f) => set({ editingField: f }),
}));
