import { useQuery } from '@tanstack/react-query';
import type { SearchResponse } from '../../../shared/types/search';

const BASE = 'http://localhost:3001/api/search';

export function useSearch(q: string) {
  return useQuery<SearchResponse>({
    queryKey: ['search', q],
    queryFn: async () => {
      const res = await fetch(`${BASE}?q=${encodeURIComponent(q)}`);
      if (!res.ok) throw new Error('Search failed');
      return res.json() as Promise<SearchResponse>;
    },
    enabled: q.trim().length >= 2,
    staleTime: 10_000,
  });
}
