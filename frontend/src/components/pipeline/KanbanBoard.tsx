import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core';
import type { PipelineWithStages } from '../../../../shared/types/pipeline';
import type { DealListItem } from '../../../../shared/types/deal';
import { useKanbanStore } from '../../store/kanbanStore';
import { useMoveDeal } from '../../api/useDeals';
import KanbanColumn from './KanbanColumn';
import DragOverlayCard from './DragOverlayCard';

interface Props {
  pipeline: PipelineWithStages;
  deals: DealListItem[];
  onAddDeal: (stageId: string) => void;
}

export default function KanbanBoard({ pipeline, deals, onAddDeal }: Props) {
  const { filters, setActiveCardId, setOverColumnId } = useKanbanStore();
  const [activeDeal, setActiveDeal] = useState<DealListItem | null>(null);
  const moveDeal = useMoveDeal();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  const filteredDeals = deals.filter((d) => {
    if (filters.search && !d.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.ownerId && d.ownerId !== filters.ownerId) return false;
    if (filters.labels.length > 0 && !filters.labels.some((l) => d.labels.includes(l))) return false;
    return true;
  });

  function dealsForStage(stageId: string) {
    return filteredDeals.filter((d) => d.stageId === stageId);
  }

  function handleDragStart(event: DragStartEvent) {
    const deal = deals.find((d) => d.id === event.active.id);
    setActiveDeal(deal ?? null);
    setActiveCardId(String(event.active.id));
  }

  function handleDragOver(event: DragOverEvent) {
    setOverColumnId(event.over ? String(event.over.id) : null);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveDeal(null);
    setActiveCardId(null);
    setOverColumnId(null);

    if (!over) return;
    const dealId = String(active.id);
    const targetStageId = String(over.id);
    const deal = deals.find((d) => d.id === dealId);
    if (!deal || deal.stageId === targetStageId) return;

    moveDeal.mutate({ dealId, stageId: targetStageId, pipelineId: pipeline.id });
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4 flex-1 px-4">
        {pipeline.stages.map((stage) => (
          <KanbanColumn
            key={stage.id}
            stage={stage}
            deals={dealsForStage(stage.id)}
            onAddDeal={onAddDeal}
          />
        ))}
      </div>

      <DragOverlay dropAnimation={{ duration: 150, easing: 'cubic-bezier(0.18,0.67,0.6,1.22)' }}>
        {activeDeal ? <DragOverlayCard deal={activeDeal} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
