import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { DealListItem, PaginatedDealsResponse } from '../../../shared/types/deal';

const API = 'http://localhost:3001/api';

export function useDeals(pipelineId: string) {
  return useQuery<PaginatedDealsResponse>({
    queryKey: ['deals', pipelineId],
    queryFn: () =>
      fetch(`${API}/deals?pipelineId=${pipelineId}&status=open&perPage=200`).then((r) => r.json()),
    enabled: !!pipelineId,
  });
}

export function useMoveDeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ dealId, stageId }: { dealId: string; stageId: string; pipelineId: string }) =>
      fetch(`${API}/deals/${dealId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stageId }),
      }).then((r) => r.json()),

    onMutate: async ({ dealId, stageId, pipelineId }) => {
      await queryClient.cancelQueries({ queryKey: ['deals', pipelineId] });
      const previous = queryClient.getQueryData<PaginatedDealsResponse>(['deals', pipelineId]);
      queryClient.setQueryData<PaginatedDealsResponse>(['deals', pipelineId], (old) => {
        if (!old) return old;
        return { ...old, deals: old.deals.map((d) => (d.id === dealId ? { ...d, stageId } : d)) };
      });
      return { previous, pipelineId };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['deals', context.pipelineId], context.previous);
      }
    },

    onSettled: (_data, _err, { pipelineId }) => {
      queryClient.invalidateQueries({ queryKey: ['deals', pipelineId] });
    },
  });
}

export function useCreateDeal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: Partial<DealListItem>) =>
      fetch(`${API}/deals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }).then((r) => r.json()),
    onSuccess: (data: DealListItem) => {
      queryClient.invalidateQueries({ queryKey: ['deals', data.pipelineId] });
    },
  });
}

export function useWonDeal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ dealId }: { dealId: string; pipelineId: string }) =>
      fetch(`${API}/deals/${dealId}/won`, { method: 'PATCH' }).then((r) => r.json()),
    onSuccess: (_data, { pipelineId }) => {
      queryClient.invalidateQueries({ queryKey: ['deals', pipelineId] });
    },
  });
}

export function useLostDeal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ dealId, lostReason }: { dealId: string; lostReason?: string; pipelineId: string }) =>
      fetch(`${API}/deals/${dealId}/lost`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lostReason }),
      }).then((r) => r.json()),
    onSuccess: (_data, { pipelineId }) => {
      queryClient.invalidateQueries({ queryKey: ['deals', pipelineId] });
    },
  });
}

export function useDeleteDeal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ dealId }: { dealId: string; pipelineId: string }) =>
      fetch(`${API}/deals/${dealId}`, { method: 'DELETE' }),
    onSuccess: (_data, { pipelineId }) => {
      queryClient.invalidateQueries({ queryKey: ['deals', pipelineId] });
    },
  });
}
