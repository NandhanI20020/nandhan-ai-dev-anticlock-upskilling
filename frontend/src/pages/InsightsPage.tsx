import { useState } from 'react';
import { useInsightsStore } from '../store/insightsStore';
import { useInsights } from '../api/useInsights';
import DateRangeSelector from '../components/insights/DateRangeSelector';
import KPITile from '../components/insights/KPITile';
import DealsByStageChart from '../components/insights/DealsByStageChart';
import WinLossDonut from '../components/insights/WinLossDonut';
import ActivitiesCompletedChart from '../components/insights/ActivitiesCompletedChart';
import RecentDealsPanel from '../components/insights/RecentDealsPanel';
import type { DatePreset } from '../../../shared/types/insights';

function fmt(n: number): string {
  return n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `$${(n / 1_000).toFixed(0)}K` : `$${n}`;
}

export default function InsightsPage() {
  const store = useInsightsStore();
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const { from, to } = store.getRange();
  const { data, isLoading } = useInsights(from, to);

  function handlePreset(p: DatePreset) {
    store.setDatePreset(p);
  }

  function handleCustomFrom(v: string) {
    setCustomFrom(v);
    if (v && customTo) store.setCustomRange(v, customTo);
  }

  function handleCustomTo(v: string) {
    setCustomTo(v);
    if (customFrom && v) store.setCustomRange(customFrom, v);
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-gray-50">
      <div className="flex items-center justify-between px-6 pt-5 pb-4 bg-white border-b border-gray-200">
        <h1 className="text-base font-semibold text-gray-800">Insights</h1>
        <DateRangeSelector
          preset={store.datePreset}
          customFrom={customFrom}
          customTo={customTo}
          onPreset={handlePreset}
          onCustomFrom={handleCustomFrom}
          onCustomTo={handleCustomTo}
        />
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
        {isLoading ? (
          <div className="p-8 text-center text-sm text-gray-400 animate-pulse">Loading insights…</div>
        ) : data ? (
          <>
            <div className="grid grid-cols-4 gap-3">
              <KPITile label="Open Pipeline" value={fmt(data.stats.openPipelineValue)} trend={data.stats.openPipelineTrend} />
              <KPITile label="Won Revenue" value={fmt(data.stats.wonRevenue)} trend={data.stats.wonRevenueTrend} color="#0A9E5F" />
              <KPITile label="Activities Today" value={String(data.stats.activitiesToday)} trend={data.stats.activitiesTodayTrend} />
              <KPITile label="Avg Deal Age" value={`${data.stats.avgDealAgeDays}d`} trend={data.stats.avgDealAgeTrend} />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <DealsByStageChart data={data.stageDistribution} />
              </div>
              <WinLossDonut data={data.winLoss} />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <ActivitiesCompletedChart data={data.activityTimeline} />
              </div>
              <RecentDealsPanel deals={data.recentDeals} />
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
