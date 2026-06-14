import type { ForecastMonth } from '../../../../shared/types/forecast';
import DealBlock from './DealBlock';

function fmt(n: number): string {
  return n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `$${(n / 1_000).toFixed(0)}K` : `$${n}`;
}

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function ForecastColumn({ month }: { month: ForecastMonth }) {
  const label = `${MONTH_NAMES[month.month - 1]} ${month.year}`;
  const quotaPercent = month.quotaPercent ?? null;
  const barColor = quotaPercent !== null && quotaPercent >= 100 ? '#0A9E5F' : '#6F6EE8';

  return (
    <div className="flex flex-col min-w-[200px] bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 px-3 py-2.5 border-b border-gray-200">
        <p className="text-xs font-semibold text-gray-700">{label}</p>
        <p className="text-sm font-bold text-gray-900 mt-0.5">{fmt(month.totalValue)}</p>
        {month.weightedValue !== undefined && (
          <p className="text-[10px] text-gray-400">Weighted: {fmt(month.weightedValue)}</p>
        )}
        {quotaPercent !== null && (
          <div className="mt-1.5">
            <div className="flex justify-between text-[10px] mb-0.5">
              <span className="text-gray-400">vs quota</span>
              <span style={{ color: barColor }}>{quotaPercent}%</span>
            </div>
            <div className="bg-gray-200 rounded-full h-1">
              <div className="h-1 rounded-full transition-all" style={{ width: `${Math.min(quotaPercent, 100)}%`, backgroundColor: barColor }} />
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2 p-2 overflow-y-auto max-h-[480px]">
        {month.deals.length === 0 ? (
          <p className="text-xs text-gray-300 text-center py-4">No deals</p>
        ) : (
          month.deals.map((d) => <DealBlock key={d.id} deal={d} />)
        )}
      </div>
    </div>
  );
}
