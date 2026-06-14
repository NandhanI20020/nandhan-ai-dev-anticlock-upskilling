import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { DealDetail, DealStageInfo, FeedItem } from '../../../shared/types/deal';

const API = 'http://localhost:3001/api';

export function useDeal(id: string) {
  return useQuery<DealDetail>({
    queryKey: ['deal', id],
    queryFn: () => fetch(`${API}/deals/${id}`).then((r) => r.json()),
    enabled: !!id,
  });
}

export function useDealStages(id: string) {
  return useQuery<DealStageInfo[]>({
    queryKey: ['deal-stages', id],
    queryFn: () => fetch(`${API}/deals/${id}/stages`).then((r) => r.json()),
    enabled: !!id,
  });
}

export function useDealFeed(id: string) {
  return useQuery<FeedItem[]>({
    queryKey: ['deal-feed', id],
    queryFn: () => fetch(`${API}/deals/${id}/feed`).then((r) => r.json()),
    enabled: !!id,
  });
}

export function useUpdateDeal(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Partial<DealDetail>) =>
      fetch(`${API}/deals/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then((r) => r.json()),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['deal', id] });
      qc.invalidateQueries({ queryKey: ['deals'] });
    },
  });
}

export function useChangeStage(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (stageId: string) =>
      fetch(`${API}/deals/${id}/stage`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ stageId }) }).then((r) => r.json()),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['deal', id] });
      qc.invalidateQueries({ queryKey: ['deal-stages', id] });
      qc.invalidateQueries({ queryKey: ['deal-feed', id] });
    },
  });
}

export function useMarkWon(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => fetch(`${API}/deals/${id}/won`, { method: 'PATCH' }).then((r) => r.json()),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['deal', id] });
      qc.invalidateQueries({ queryKey: ['deal-feed', id] });
    },
  });
}

export function useMarkLost(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (lostReason: string) =>
      fetch(`${API}/deals/${id}/lost`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ lostReason }) }).then((r) => r.json()),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['deal', id] });
      qc.invalidateQueries({ queryKey: ['deal-feed', id] });
    },
  });
}

export function useLogActivity(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { type: string; subject: string; dueDate?: string; dueTime?: string; note?: string; outcome?: string }) =>
      fetch(`${API}/deals/${id}/activities`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then((r) => r.json()),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['deal-feed', id] });
      qc.invalidateQueries({ queryKey: ['deal', id] });
    },
  });
}

export function useCreateNote(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (content: string) =>
      fetch(`${API}/deals/${id}/notes`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content }) }).then((r) => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['deal-feed', id] }),
  });
}

export function useUpdateNote(dealId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ noteId, content }: { noteId: string; content: string }) =>
      fetch(`${API}/notes/${noteId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content }) }).then((r) => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['deal-feed', dealId] }),
  });
}

export function useDeleteNote(dealId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (noteId: string) => fetch(`${API}/notes/${noteId}`, { method: 'DELETE' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['deal-feed', dealId] }),
  });
}
