import { create } from 'zustand';
import type { ActivityType } from '../../../shared/types/activity';

export type ActivityView = 'list' | 'calendar';

interface ActivitiesStore {
  activeTab: string;
  typeFilter: ActivityType | null;
  view: ActivityView;
  setActiveTab: (tab: string) => void;
  setTypeFilter: (type: ActivityType | null) => void;
  setView: (v: ActivityView) => void;
}

export const useActivitiesStore = create<ActivitiesStore>((set) => ({
  activeTab: 'today',
  typeFilter: null,
  view: 'list',
  setActiveTab: (activeTab) => set({ activeTab }),
  setTypeFilter: (typeFilter) => set({ typeFilter }),
  setView: (view) => set({ view }),
}));
