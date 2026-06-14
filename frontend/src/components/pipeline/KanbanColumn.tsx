import { useDroppable } from '@dnd-kit/core';
import type { Stage } from '../../../../shared/types/pipeline';
import type { DealListItem } from '../../../../shared/types/deal';
import { formatCurrencyCompact } from '../../utils/dateUtils';
import DealCard from './DealCard';

interface Props {
  stage: Stage;
  deals: DealListItem[];
  onAddDeal: (stageId: string) => void;
}

export default function KanbanColumn({ stage, deals, onAddDeal }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.id });

  const totalValue = deals.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="flex flex-col w-64 shrink-0">
      <div className="flex items-center justify-between mb-2 px-1">
        <div>
          <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
            {stage.name}
          </span>
          <span className="ml-2 text-xs text-gray-400">
            {deals.length} · {formatCurrencyCompact(totalValue)}
          </span>
        </div>
      </div>

      <div
        ref={setNodeRef}
        className={`flex flex-col gap-2 flex-1 p-2 rounded-lg min-h-24 transition-colors ${
          isOver ? 'bg-[#6F6EE8]/8 ring-2 ring-[#6F6EE8]/30' : 'bg-gray-100/70'
        }`}
      >
        {deals.map((deal) => (
          <DealCard key={deal.id} deal={deal} />
        ))}

        {deals.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-4">No deals</p>
        )}

        <button
          onClick={() => onAddDeal(stage.id)}
          className="mt-1 text-xs text-gray-400 hover:text-gray-600 py-1.5 rounded-md hover:bg-gray-200 transition-colors cursor-pointer text-center"
        >
          + Add deal
        </button>
      </div>
    </div>
  );
}
