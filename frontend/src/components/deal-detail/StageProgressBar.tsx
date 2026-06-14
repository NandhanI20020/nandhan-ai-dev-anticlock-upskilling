import { useState } from 'react';
import type { DealStageInfo } from '../../../../shared/types/deal';

interface Props {
  stages: DealStageInfo[];
  onChangeStage: (stageId: string) => void;
  dealStatus: 'open' | 'won' | 'lost';
}

export default function StageProgressBar({ stages, onChangeStage, dealStatus }: Props) {
  const [confirmStageId, setConfirmStageId] = useState<string | null>(null);

  const currentIdx = stages.findIndex((s) => s.isCurrent);

  function handleClick(stage: DealStageInfo, idx: number) {
    if (dealStatus !== 'open') return;
    if (stage.isCurrent) return;
    if (idx < currentIdx) {
      setConfirmStageId(stage.id);
    } else {
      onChangeStage(stage.id);
    }
  }

  return (
    <>
      <div className="flex items-stretch mt-3 select-none overflow-x-auto">
        {stages.map((stage, idx) => {
          const isPast = idx < currentIdx;
          const isCurrent = stage.isCurrent;
          const isClickable = dealStatus === 'open' && !isCurrent;

          let bg = 'bg-gray-100 text-gray-500';
          if (isCurrent) bg = 'text-white';
          else if (isPast) bg = 'text-white';

          return (
            <button
              key={stage.id}
              onClick={() => handleClick(stage, idx)}
              disabled={!isClickable}
              title={`${stage.name} — ${stage.daysInStage}d`}
              className={`relative flex flex-col items-start justify-center px-3 py-1.5 text-left min-w-24
                ${isClickable ? 'cursor-pointer hover:brightness-95' : 'cursor-default'}
                ${idx === 0 ? 'rounded-l-md' : ''}
                ${idx === stages.length - 1 ? 'rounded-r-md' : ''}
                transition-all`}
              style={{
                backgroundColor: isCurrent ? '#6F6EE8' : isPast ? '#A5B4FC' : '#E5E7EB',
                color: isCurrent || isPast ? '#fff' : '#6B7280',
                clipPath: idx < stages.length - 1
                  ? 'polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%, 10px 50%)'
                  : 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 10px 50%)',
                marginLeft: idx === 0 ? 0 : '-6px',
                zIndex: stages.length - idx,
              }}
            >
              <span className={`text-[11px] font-semibold leading-tight truncate max-w-20 ${bg}`}>{stage.name}</span>
              {stage.daysInStage > 0 && (
                <span className={`text-[9px] opacity-80 ${bg}`}>{stage.daysInStage}d</span>
              )}
            </button>
          );
        })}
      </div>

      {confirmStageId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setConfirmStageId(null)}>
          <div className="bg-white rounded-xl shadow-xl p-5 max-w-xs w-full" onClick={(e) => e.stopPropagation()}>
            <p className="text-sm font-medium text-gray-900 mb-1">Move deal backward?</p>
            <p className="text-sm text-gray-500 mb-4">This will move the deal to an earlier stage. Are you sure?</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setConfirmStageId(null)} className="px-3 py-1.5 text-sm border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer">Cancel</button>
              <button
                onClick={() => { onChangeStage(confirmStageId); setConfirmStageId(null); }}
                className="px-3 py-1.5 text-sm text-white rounded-md cursor-pointer"
                style={{ backgroundColor: '#6F6EE8' }}
              >
                Move Backward
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
