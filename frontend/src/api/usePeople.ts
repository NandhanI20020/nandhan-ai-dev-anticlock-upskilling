import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { PersonListItem, PaginatedPeopleResponse, Person } from '../../../shared/types/person';
import type { PeopleFilters } from '../store/contactsStore';

const BASE = 'http://localhost:3001/api';

function buildParams(filters: PeopleFilters, sort: string, sortDir: string, page: number, perPage: number, all = false): string {
  const p = new URLSearchParams();
  if (filters.myPeople) p.set('myPeople', 'true');
  if (filters.ownerId) p.set('ownerId', filters.ownerId);
  if (filters.label) p.set('label', filters.label);
  if (filters.orgId) p.set('orgId', filters.orgId);
  if (filters.search) p.set('search', filters.search);
  p.set('sort', sort); p.set('sortDir', sortDir);
  if (all) p.set('all', 'true');
  else { p.set('page', String(page)); p.set('perPage', String(perPage)); }
  return p.toString();
}

export function usePeople(filters: PeopleFilters, sort: string, sortDir: 'asc' | 'desc', page: number, perPage: number) {
  return useQuery<PaginatedPeopleResponse>({
    queryKey: ['people', filters, sort, sortDir, page, perPage],
    queryFn: async () => {
      const res = await fetch(`${BASE}/people?${buildParams(filters, sort, sortDir, page, perPage)}`);
      if (!res.ok) throw new Error('Failed to fetch people');
      return res.json() as Promise<PaginatedPeopleResponse>;
    },
  });
}

export function useCreatePerson() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Person>) => {
      const res = await fetch(`${BASE}/people`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (res.status === 409) { const err = await res.json(); throw Object.assign(new Error('duplicate'), err); }
      if (!res.ok) throw new Error('Failed to create person');
      return res.json() as Promise<PersonListItem>;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['people'] }),
  });
}

export function useBulkPeopleAction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { ids: string[]; action: string; ownerId?: string; labelId?: string }) => {
      const res = await fetch(`${BASE}/people/bulk`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error('Bulk action failed');
      return res.json() as Promise<{ affected: number }>;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['people'] }),
  });
}

export function useMergePeople() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { keepId: string; mergeId: string }) => {
      const res = await fetch(`${BASE}/people/merge`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error('Merge failed');
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['people'] }),
  });
}

export function useAllPeopleForExport(filters: PeopleFilters, sort: string, sortDir: 'asc' | 'desc') {
  return async (): Promise<PaginatedPeopleResponse> => {
    const res = await fetch(`${BASE}/people?${buildParams(filters, sort, sortDir, 1, 15, true)}`);
    if (!res.ok) throw new Error('Export failed');
    return res.json() as Promise<PaginatedPeopleResponse>;
  };
}
