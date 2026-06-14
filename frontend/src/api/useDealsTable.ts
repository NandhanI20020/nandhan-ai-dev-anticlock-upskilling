import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { PaginatedDealsResponse, DealListFilters } from '../../../shared/types/deal';
import type { BulkActionRequest } from '../../../shared/types/savedView';

const BASE = 'http://localhost:3001/api';

function buildParams(
  filters: DealListFilters,
  sort: string,
  sortDir: string,
  page: number,
  perPage: number,
  all = false,
): string {
  const p = new URLSearchParams();
  if (filters.status)       p.set('status', filters.status);
  if (filters.pipelineId)   p.set('pipelineId', filters.pipelineId);
  if (filters.stageId)      p.set('stageId', filters.stageId);
  if (filters.ownerId)      p.set('ownerId', filters.ownerId);
  if (filters.myDeals)      p.set('myDeals', 'true');
  if (filters.label)        p.set('label', filters.label);
  if (filters.valueMin !== undefined) p.set('valueMin', String(filters.valueMin));
  if (filters.valueMax !== undefined) p.set('valueMax', String(filters.valueMax));
  if (filters.closeDateFrom) p.set('closeDateFrom', filters.closeDateFrom);
  if (filters.closeDateTo)   p.set('closeDateTo', filters.closeDateTo);
  if (filters.source)        p.set('source', filters.source);
  if (filters.search)        p.set('search', filters.search);
  p.set('sort', sort);
  p.set('sortDir', sortDir);
  if (all) {
    p.set('all', 'true');
  } else {
    p.set('page', String(page));
    p.set('perPage', String(perPage));
  }
  return p.toString();
}

export function useDealsTable(
  filters: DealListFilters,
  sort: string,
  sortDir: 'asc' | 'desc',
  page: number,
  perPage: number,
) {
  return useQuery<PaginatedDealsResponse>({
    queryKey: ['deals-list', filters, sort, sortDir, page, perPage],
    queryFn: async () => {
      const params = buildParams(filters, sort, sortDir, page, perPage);
      const res = await fetch(`${BASE}/deals?${params}`);
      if (!res.ok) throw new Error('Failed to fetch deals');
      return res.json() as Promise<PaginatedDealsResponse>;
    },
  });
}

export function useAllDealsForExport(
  filters: DealListFilters,
  sort: string,
  sortDir: 'asc' | 'desc',
) {
  return async (): Promise<PaginatedDealsResponse> => {
    const params = buildParams(filters, sort, sortDir, 1, 15, true);
    const res = await fetch(`${BASE}/deals?${params}`);
    if (!res.ok) throw new Error('Failed to fetch deals for export');
    return res.json() as Promise<PaginatedDealsResponse>;
  };
}

export function useBulkAction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: BulkActionRequest) => {
      const res = await fetch(`${BASE}/deals/bulk`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Bulk action failed');
      return res.json() as Promise<{ affected: number }>;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['deals-list'] });
    },
  });
}
