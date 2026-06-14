import { useQuery } from '@tanstack/react-query';
import type { DashboardResponse } from '../../../shared/types/insights';

const BASE = 'http://localhost:3001/api/insights';

export function useInsights(from: string, to: string) {
  return useQuery<DashboardResponse>({
    queryKey: ['insights', from, to],
    queryFn: async () => {
      const res = await fetch(`${BASE}?from=${from}&to=${to}`);
      if (!res.ok) throw new Error('Failed to fetch insights');
      return res.json() as Promise<DashboardResponse>;
    },
  });
}
