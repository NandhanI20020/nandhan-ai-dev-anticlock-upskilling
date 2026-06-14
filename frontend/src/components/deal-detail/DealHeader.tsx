import { useState } from 'react';
import { ArrowLeft, Trophy, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { DealDetail, DealStageInfo } from '../../../../shared/types/deal';
import InlineEdit from './InlineEdit';
import StageProgressBar from './StageProgressBar';
import WonDialog from './WonDialog';
import LostDialog from './LostDialog';
import { useUpdateDeal, useMarkWon, useMarkLost, useChangeStage } from '../../api/useDealDetail';

interface Props {
  deal: DealDetail;
  stages: DealStageInfo[];
}

const STATUS_BADGE: Record<string, { label: string; bg: string; text: string }> = {
  won:  { label: 'Won',  bg: '#D1FAE5', text: '#065F46' },
  lost: { label: 'Lost', bg: '#FEE2E2', text: '#991B1B' },
};

export default function DealHeader({ deal, stages }: Props) {
  const navigate = useNavigate();
  const [wonOpen, setWonOpen] = useState(false);
  const [lostOpen, setLostOpen] = useState(false);

  const update = useUpdateDeal(deal.id);
  const markWon = useMarkWon(deal.id);
  const markLost = useMarkLost(deal.id);
  const changeStage = useChangeStage(deal.id);

  const badge = deal.status !== 'open' ? STATUS_BADGE[deal.status] : null;

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 shrink-0">
      <button
        onClick={() => navigate('/pipeline')}
        className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 mb-3 cursor-pointer"
      >
        <ArrowLeft size={12} /> Back to Pipeline
      </button>

      <div className="flex items-start gap-3">
        <h1 className="text-xl font-semibold text-gray-900 flex-1 min-w-0 leading-tight">
          <InlineEdit
            value={deal.title}
            onSave={(v) => update.mutate({ title: v })}
            displayClassName="text-xl font-semibold"
            className="text-xl font-semibold w-full"
          />
        </h1>

        {badge ? (
          <span
            className="shrink-0 px-3 py-1 rounded-full text-xs font-semibold mt-1"
            style={{ backgroundColor: badge.bg, color: badge.text }}
          >
            {badge.label}
          </span>
        ) : (
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => setWonOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-white rounded-md cursor-pointer"
              style={{ backgroundColor: '#0A9E5F' }}
            >
              <Trophy size={13} /> Won
            </button>
            <button
              onClick={() => setLostOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-white rounded-md cursor-pointer"
              style={{ backgroundColor: '#E15A51' }}
            >
              <XCircle size={13} /> Lost
            </button>
          </div>
        )}
      </div>

      {stages.length > 0 && (
        <StageProgressBar
          stages={stages}
          dealStatus={deal.status}
          onChangeStage={(stageId) => changeStage.mutate(stageId)}
        />
      )}

      {wonOpen && (
        <WonDialog
          onConfirm={() => { markWon.mutate(); setWonOpen(false); }}
          onClose={() => setWonOpen(false)}
        />
      )}
      {lostOpen && (
        <LostDialog
          onConfirm={(reason) => { markLost.mutate(reason); setLostOpen(false); }}
          onClose={() => setLostOpen(false)}
        />
      )}
    </div>
  );
}
