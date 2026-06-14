import { create } from 'zustand';
import type { ForecastRange } from '../../../shared/types/forecast';

interface ForecastStore {
  range: ForecastRange;
  setRange: (range: ForecastRange) => void;
}

export const useForecastStore = create<ForecastStore>((set) => ({
  range: 'this_quarter',
  setRange: (range) => set({ range }),
}));
