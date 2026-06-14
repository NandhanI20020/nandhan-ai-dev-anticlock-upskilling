import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { PersonDetail, Person } from '../../../shared/types/person';
import type { FeedItem } from '../../../shared/types/deal';
import type { Activity } from '../../../shared/types/activity';

const BASE = 'http://localhost:3001/api';

export function usePerson(id: string) {
  return useQuery<PersonDetail>({
    queryKey: ['person', id],
    queryFn: async () => {
      const res = await fetch(`${BASE}/people/${id}`);
      if (!res.ok) throw new Error('Person not found');
      return res.json() as Promise<PersonDetail>;
    },
  });
}

export function usePersonFeed(id: string) {
  return useQuery<FeedItem[]>({
    queryKey: ['person-feed', id],
    queryFn: async () => {
      const res = await fetch(`${BASE}/people/${id}/feed`);
      if (!res.ok) throw new Error('Failed to load feed');
      return res.json() as Promise<FeedItem[]>;
    },
  });
}

export function useUpdatePerson(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Person>) => {
      const res = await fetch(`${BASE}/people/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error('Update failed');
      return res.json();
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['person', id] }); qc.invalidateQueries({ queryKey: ['people'] }); },
  });
}

export function useCreatePersonNote(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (content: string) => {
      const res = await fetch(`${BASE}/people/${id}/notes`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content }) });
      if (!res.ok) throw new Error('Failed to create note');
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['person-feed', id] }),
  });
}

export function useLogPersonActivity(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Activity>) => {
      const res = await fetch(`${BASE}/people/${id}/activities`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error('Failed to log activity');
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['person-feed', id] }),
  });
}

export function useLabels() {
  return useQuery<{ id: string; name: string; color: string }[]>({
    queryKey: ['labels'],
    queryFn: async () => {
      const res = await fetch(`${BASE}/labels/labels`);
      if (!res.ok) return [];
      return res.json();
    },
    staleTime: Infinity,
  });
}
