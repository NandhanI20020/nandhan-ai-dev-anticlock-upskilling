import { useQuery } from '@tanstack/react-query';
import type { ForecastResponse, ForecastRange } from '../../../shared/types/forecast';

const BASE = 'http://localhost:3001/api/forecast';

export function useForecast(range: ForecastRange) {
  return useQuery<ForecastResponse>({
    queryKey: ['forecast', range],
    queryFn: async () => {
      const res = await fetch(`${BASE}?range=${range}`);
      if (!res.ok) throw new Error('Failed to fetch forecast');
      return res.json() as Promise<ForecastResponse>;
    },
  });
}
