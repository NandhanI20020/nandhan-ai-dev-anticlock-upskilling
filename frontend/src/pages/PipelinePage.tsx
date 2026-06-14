import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { usePipelines } from '../api/usePipelines';
import { useDeals } from '../api/useDeals';
import KanbanBoard from '../components/pipeline/KanbanBoard';
import PipelineSelector from '../components/pipeline/PipelineSelector';
import FilterBar from '../components/pipeline/FilterBar';
import AddDealModal from '../components/pipeline/AddDealModal';

export default function PipelinePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [addDealStageId, setAddDealStageId] = useState<string | null>(null);

  const { data: pipelines, isLoading: pipelinesLoading, error: pipelinesError } = usePipelines();

  const defaultPipelineId = pipelines?.find((p) => p.isDefault)?.id ?? pipelines?.[0]?.id ?? '';
  const activePipelineId = searchParams.get('pipeline') ?? defaultPipelineId;

  const { data: dealsData, isLoading: dealsLoading } = useDeals(activePipelineId);

  const activePipeline = pipelines?.find((p) => p.id === activePipelineId);

  function handlePipelineChange(id: string) {
    setSearchParams({ pipeline: id });
  }

  if (pipelinesError) {
    return (
      <div className="flex items-center justify-center flex-1 text-sm text-red-500">
        Failed to load pipelines. Is the backend running on port 3001?
      </div>
    );
  }

  if (pipelinesLoading || !activePipeline) {
    return (
      <div className="flex items-center justify-center flex-1">
        <div className="w-6 h-6 border-2 border-gray-300 border-t-[#6F6EE8] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
      <header className="flex items-center gap-4 px-4 py-3 border-b border-gray-200 bg-white shrink-0">
        <h1 className="text-sm font-semibold text-gray-900 mr-2">Pipeline</h1>
        <PipelineSelector
          pipelines={pipelines!}
          activePipelineId={activePipelineId}
          onChange={handlePipelineChange}
        />
        <div className="flex-1" />
        <FilterBar />
        <button
          onClick={() => setAddDealStageId(activePipeline.stages[0]?.id ?? null)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-white rounded-md cursor-pointer"
          style={{ backgroundColor: '#0A9E5F' }}
        >
          <Plus size={14} /> Add Deal
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden py-4 min-h-0">
        {dealsLoading ? (
          <div className="flex items-center justify-center flex-1">
            <div className="w-6 h-6 border-2 border-gray-300 border-t-[#6F6EE8] rounded-full animate-spin" />
          </div>
        ) : (
          <KanbanBoard
            pipeline={activePipeline}
            deals={dealsData?.deals ?? []}
            onAddDeal={(stageId) => setAddDealStageId(stageId)}
          />
        )}
      </div>

      {addDealStageId && (
        <AddDealModal
          pipeline={activePipeline}
          defaultStageId={addDealStageId}
          onClose={() => setAddDealStageId(null)}
        />
      )}
    </div>
  );
}
