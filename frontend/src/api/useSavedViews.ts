import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { SavedView } from '../../../shared/types/savedView';
import type { DealListFilters } from '../../../shared/types/deal';

const BASE = 'http://localhost:3001/api/saved-views';

export function useSavedViews() {
  return useQuery<SavedView[]>({
    queryKey: ['saved-views'],
    queryFn: async () => {
      const res = await fetch(`${BASE}?entity=deals`);
      if (!res.ok) throw new Error('Failed to fetch saved views');
      return res.json() as Promise<SavedView[]>;
    },
  });
}

export function useCreateView() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { name: string; filters: DealListFilters }) => {
      const res = await fetch(BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, entity: 'deals' }),
      });
      if (!res.ok) throw new Error('Failed to save view');
      return res.json() as Promise<SavedView>;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['saved-views'] }),
  });
}

export function useDeleteView() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete view');
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['saved-views'] }),
  });
}
