import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { ArchiveResponse } from '../../../shared/types/archive';
import type { ArchiveStatusFilter, ArchiveDatePreset } from '../store/archiveStore';

const BASE = 'http://localhost:3001/api';

function dateRangeForPreset(preset: ArchiveDatePreset): { from?: string; to?: string } {
  const now = new Date();
  const y = now.getFullYear();
  const q = Math.floor(now.getMonth() / 3);
  if (preset === 'this_year') return { from: `${y}-01-01`, to: now.toISOString().slice(0, 10) };
  if (preset === 'last_year') return { from: `${y - 1}-01-01`, to: `${y - 1}-12-31` };
  if (preset === 'this_quarter') return { from: new Date(y, q * 3, 1).toISOString().slice(0, 10), to: now.toISOString().slice(0, 10) };
  return {};
}

export function useArchive(statusFilter: ArchiveStatusFilter, datePreset: ArchiveDatePreset, searchQuery: string) {
  return useQuery<ArchiveResponse>({
    queryKey: ['archive', statusFilter, datePreset, searchQuery],
    queryFn: async () => {
      const p = new URLSearchParams();
      if (statusFilter !== 'all') p.set('status', statusFilter);
      const { from, to } = dateRangeForPreset(datePreset);
      if (from) p.set('from', from);
      if (to) p.set('to', to);
      if (searchQuery) p.set('q', searchQuery);
      const res = await fetch(`${BASE}/archive?${p}`);
      if (!res.ok) throw new Error('Failed to fetch archive');
      return res.json() as Promise<ArchiveResponse>;
    },
  });
}

export function useReopenDeal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${BASE}/deals/${id}/reopen`, { method: 'PATCH' });
      if (!res.ok) throw new Error('Reopen failed');
      return res.json();
    },
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: ['archive'] });
      qc.invalidateQueries({ queryKey: ['deals-list'] });
      qc.invalidateQueries({ queryKey: ['deal', id] });
    },
  });
}
