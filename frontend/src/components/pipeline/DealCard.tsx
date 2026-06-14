import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { MoreHorizontal, Phone, Mail, Users, CheckSquare, Clock } from 'lucide-react';
import type { DealListItem } from '../../../../shared/types/deal';
import { daysSince, relativeTime, formatCurrencyCompact } from '../../utils/dateUtils';
import { useWonDeal, useLostDeal, useDeleteDeal } from '../../api/useDeals';
import DealCardMenu from './DealCardMenu';

const ACTIVITY_ICONS = {
  call:     Phone,
  meeting:  Users,
  email:    Mail,
  task:     CheckSquare,
  deadline: Clock,
} as const;

interface Props {
  deal: DealListItem;
  isDragOverlay?: boolean;
}

export default function DealCard({ deal, isDragOverlay = false }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: deal.id,
    data: { deal },
    disabled: isDragOverlay,
  });

  const wonMutation  = useWonDeal();
  const lostMutation = useLostDeal();
  const deleteMutation = useDeleteDeal();

  const isRotten = deal.rottingDays !== null && daysSince(deal.updatedAt) > deal.rottingDays;
  const ActivityIcon = deal.nextActivityType ? ACTIVITY_ICONS[deal.nextActivityType] : null;

  const style = transform
    ? { transform: CSS.Translate.toString(transform) }
    : undefined;

  if (isDragging && !isDragOverlay) {
    return (
      <div
        ref={setNodeRef}
        className="h-24 rounded-lg bg-gray-100 border-2 border-dashed border-gray-300"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(isDragOverlay ? {} : { ...listeners, ...attributes })}
      className={`bg-white rounded-lg border border-gray-200 p-3 cursor-grab active:cursor-grabbing select-none
        hover:shadow-sm transition-shadow relative group ${isDragOverlay ? 'shadow-lg rotate-2 opacity-95' : ''}`}
    >
      {isRotten && (
        <span
          className="absolute top-2 right-2 text-[10px] font-semibold px-1.5 py-0.5 rounded"
          style={{ backgroundColor: '#FFF3E0', color: '#FB923C' }}
        >
          ROTTEN
        </span>
      )}

      <Link
        to={`/deals/${deal.id}`}
        onMouseDown={(e) => e.stopPropagation()}
        className="text-sm font-medium text-gray-900 leading-tight pr-6 truncate block hover:underline"
      >
        {deal.title}
      </Link>

      {deal.orgName && (
        <p className="text-xs text-gray-400 mt-0.5 truncate">{deal.orgName}</p>
      )}

      <p className="text-sm font-semibold mt-2" style={{ color: '#0A9E5F' }}>
        {formatCurrencyCompact(deal.value, deal.currency)}
      </p>

      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-1.5">
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold shrink-0"
            style={{ backgroundColor: deal.ownerColor }}
            title={deal.ownerName}
          >
            {deal.ownerInitials}
          </div>

          {ActivityIcon && deal.lastActivityDate && (
            <div className="flex items-center gap-0.5 text-gray-400">
              <ActivityIcon size={11} />
              <span className="text-[10px]">{relativeTime(deal.lastActivityDate)}</span>
            </div>
          )}
        </div>

        <div className="relative" onMouseDown={(e) => e.stopPropagation()}>
          <button
            className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-gray-100 cursor-pointer"
            onClick={(e) => { e.stopPropagation(); setMenuOpen((v) => !v); }}
          >
            <MoreHorizontal size={14} className="text-gray-400" />
          </button>

          {menuOpen && (
            <DealCardMenu
              dealId={deal.id}
              pipelineId={deal.pipelineId}
              onWon={() => { wonMutation.mutate({ dealId: deal.id, pipelineId: deal.pipelineId }); setMenuOpen(false); }}
              onLost={() => { lostMutation.mutate({ dealId: deal.id, pipelineId: deal.pipelineId }); setMenuOpen(false); }}
              onDelete={() => { deleteMutation.mutate({ dealId: deal.id, pipelineId: deal.pipelineId }); setMenuOpen(false); }}
              onClose={() => setMenuOpen(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
