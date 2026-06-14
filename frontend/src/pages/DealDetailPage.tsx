import { useParams } from 'react-router-dom';
import { useDeal, useDealStages, useDealFeed } from '../api/useDealDetail';
import DealHeader from '../components/deal-detail/DealHeader';
import DealInfoPanel from '../components/deal-detail/DealInfoPanel';
import ActivityFeed from '../components/deal-detail/ActivityFeed';
import QuickLogBar from '../components/deal-detail/QuickLogBar';
import NoteComposer from '../components/deal-detail/NoteComposer';

export default function DealDetailPage() {
  const { id } = useParams<{ id: string }>();
  const dealId = id!;

  const { data: deal, isLoading, error } = useDeal(dealId);
  const { data: stages = [] } = useDealStages(dealId);
  const { data: feedItems = [], isLoading: feedLoading } = useDealFeed(dealId);

  if (error) {
    return <div className="flex items-center justify-center flex-1 text-sm text-red-500">Failed to load deal.</div>;
  }

  if (isLoading || !deal) {
    return (
      <div className="flex flex-col flex-1 animate-pulse">
        <div className="h-32 bg-gray-100 border-b border-gray-200" />
        <div className="flex gap-6 p-6">
          <div className="w-80 h-64 bg-gray-100 rounded-xl" />
          <div className="flex-1 h-64 bg-gray-100 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
      <DealHeader deal={deal} stages={stages} />

      <div className="flex flex-1 gap-0 overflow-hidden min-h-0">
        {/* Left Panel — 40% */}
        <div className="w-80 shrink-0 overflow-y-auto p-4 border-r border-gray-200 bg-gray-50">
          <DealInfoPanel deal={deal} />
        </div>

        {/* Right Panel — 60% */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          <QuickLogBar dealId={dealId} />
          <NoteComposer dealId={dealId} />
          <div className="bg-white rounded-xl border border-gray-200 p-4 flex-1">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Activity</p>
            <ActivityFeed items={feedItems} dealId={dealId} isLoading={feedLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}
