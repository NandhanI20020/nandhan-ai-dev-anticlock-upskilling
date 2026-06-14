import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { LeadsResponse, LeadStatus, LeadConvertRequest } from '../../../shared/types/lead';

const BASE = 'http://localhost:3001/api/leads';

export function useLeads(activeTab: LeadStatus | 'all', sortField: string, sortDir: 'asc' | 'desc', sourceFilter: string | null) {
  return useQuery<LeadsResponse>({
    queryKey: ['leads', activeTab, sortField, sortDir, sourceFilter],
    queryFn: async () => {
      const p = new URLSearchParams({ sort: sortField, sortDir });
      if (activeTab !== 'all') p.set('status', activeTab);
      if (sourceFilter) p.set('source', sourceFilter);
      const res = await fetch(`${BASE}?${p}`);
      if (!res.ok) throw new Error('Failed to fetch leads');
      return res.json() as Promise<LeadsResponse>;
    },
  });
}

export function useConvertLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ leadId, ...data }: LeadConvertRequest) => {
      const res = await fetch(`${BASE}/${leadId}/convert`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error('Convert failed');
      return res.json();
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['leads'] }); qc.invalidateQueries({ queryKey: ['deals-list'] }); },
  });
}
