import { useQuery } from '@tanstack/react-query';
import type { PipelineWithStages } from '../../../shared/types/pipeline';

const API = 'http://localhost:3001/api';

export function usePipelines() {
  return useQuery<PipelineWithStages[]>({
    queryKey: ['pipelines'],
    queryFn: () => fetch(`${API}/pipelines`).then((r) => r.json()),
  });
}
