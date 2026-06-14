import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Activity, ActivityType } from '../../../shared/types/activity';

const BASE = 'http://localhost:3001/api/activities';

interface ActivitiesResponse {
  activities: (Activity & { dealTitle: string | null; personName: string | null; orgName: string | null; ownerName: string; tab: string })[];
  tabCounts: Record<string, number>;
  kpis: { completionRate: number; urgentCount: number; avgResponseTimeHours: number };
}

export function useActivities(activeTab: string, typeFilter: ActivityType | null) {
  return useQuery<ActivitiesResponse>({
    queryKey: ['activities', activeTab, typeFilter],
    queryFn: async () => {
      const p = new URLSearchParams({ tab: activeTab });
      if (typeFilter) p.set('type', typeFilter);
      const res = await fetch(`${BASE}?${p}`);
      if (!res.ok) throw new Error('Failed to fetch activities');
      return res.json() as Promise<ActivitiesResponse>;
    },
  });
}

export function useMarkDone() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${BASE}/${id}/done`, { method: 'PATCH' });
      if (!res.ok) throw new Error('Failed to mark done');
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['activities'] }),
  });
}

export function useCreateActivity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Activity>) => {
      const res = await fetch(BASE, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error('Failed to create activity');
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['activities'] }),
  });
}

export function useUpdateActivity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Activity> }) => {
      const res = await fetch(`${BASE}/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error('Update failed');
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['activities'] }),
  });
}

export function useDeleteActivity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['activities'] }),
  });
}
