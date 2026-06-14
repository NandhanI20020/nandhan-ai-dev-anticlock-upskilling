import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { OrgListItem, OrgDetail, Organization } from '../../../shared/types/organization';
import type { FeedItem } from '../../../shared/types/deal';
import type { Activity } from '../../../shared/types/activity';

const BASE = 'http://localhost:3001/api/organizations';

export function useOrganizations(sort = 'createdAt', sortDir: 'asc' | 'desc' = 'desc', page = 1, perPage = 15) {
  return useQuery<{ organizations: OrgListItem[]; total: number; page: number; perPage: number }>({
    queryKey: ['organizations', sort, sortDir, page, perPage],
    queryFn: async () => {
      const p = new URLSearchParams({ sort, sortDir, page: String(page), perPage: String(perPage) });
      const res = await fetch(`${BASE}?${p}`);
      if (!res.ok) throw new Error('Failed to fetch orgs');
      return res.json();
    },
  });
}

export function useOrg(id: string) {
  return useQuery<OrgDetail>({
    queryKey: ['org', id],
    queryFn: async () => {
      const res = await fetch(`${BASE}/${id}`);
      if (!res.ok) throw new Error('Org not found');
      return res.json() as Promise<OrgDetail>;
    },
  });
}

export function useOrgFeed(id: string) {
  return useQuery<FeedItem[]>({
    queryKey: ['org-feed', id],
    queryFn: async () => {
      const res = await fetch(`${BASE}/${id}/feed`);
      if (!res.ok) throw new Error('Failed to load feed');
      return res.json() as Promise<FeedItem[]>;
    },
  });
}

export function useCreateOrg() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Organization>) => {
      const res = await fetch(BASE, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error('Failed to create org');
      return res.json() as Promise<OrgListItem & { warning?: string }>;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['organizations'] }),
  });
}

export function useUpdateOrg(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Organization>) => {
      const res = await fetch(`${BASE}/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error('Update failed');
      return res.json();
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['org', id] }); qc.invalidateQueries({ queryKey: ['organizations'] }); },
  });
}

export function useLogOrgActivity(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Activity>) => {
      const res = await fetch(`${BASE}/${id}/activities`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error('Failed to log activity');
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['org-feed', id] }),
  });
}

export function useCreateOrgNote(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (content: string) => {
      const res = await fetch(`${BASE}/${id}/notes`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content }) });
      if (!res.ok) throw new Error('Failed to create note');
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['org-feed', id] }),
  });
}
