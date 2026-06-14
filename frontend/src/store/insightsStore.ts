import { create } from 'zustand';
import type { DatePreset } from '../../../shared/types/insights';

interface InsightsStore {
  datePreset: DatePreset;
  customFrom: string | null;
  customTo: string | null;
  setDatePreset: (preset: DatePreset) => void;
  setCustomRange: (from: string, to: string) => void;
  getRange: () => { from: string; to: string };
}

function getPresetRange(preset: DatePreset): { from: string; to: string } {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const quarter = Math.floor(m / 3);

  if (preset === 'this_month') {
    return { from: new Date(y, m, 1).toISOString().slice(0, 10), to: now.toISOString().slice(0, 10) };
  }
  if (preset === 'last_month') {
    const lm = m === 0 ? 11 : m - 1;
    const ly = m === 0 ? y - 1 : y;
    return { from: new Date(ly, lm, 1).toISOString().slice(0, 10), to: new Date(y, m, 0).toISOString().slice(0, 10) };
  }
  if (preset === 'this_quarter') {
    return { from: new Date(y, quarter * 3, 1).toISOString().slice(0, 10), to: now.toISOString().slice(0, 10) };
  }
  if (preset === 'last_quarter') {
    const lq = quarter === 0 ? 3 : quarter - 1;
    const ly = quarter === 0 ? y - 1 : y;
    return { from: new Date(ly, lq * 3, 1).toISOString().slice(0, 10), to: new Date(y, quarter * 3, 0).toISOString().slice(0, 10) };
  }
  if (preset === 'this_year') {
    return { from: new Date(y, 0, 1).toISOString().slice(0, 10), to: now.toISOString().slice(0, 10) };
  }
  return { from: now.toISOString().slice(0, 10), to: now.toISOString().slice(0, 10) };
}

export const useInsightsStore = create<InsightsStore>((set, get) => ({
  datePreset: 'this_month',
  customFrom: null,
  customTo: null,
  setDatePreset: (datePreset) => set({ datePreset }),
  setCustomRange: (customFrom, customTo) => set({ datePreset: 'custom', customFrom, customTo }),
  getRange: () => {
    const { datePreset, customFrom, customTo } = get();
    if (datePreset === 'custom' && customFrom && customTo) return { from: customFrom, to: customTo };
    return getPresetRange(datePreset);
  },
}));
