import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { ForecastDeal } from '../../../../shared/types/forecast';

function fmt(n: number): string {
  return n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `$${(n / 1_000).toFixed(0)}K` : `$${n}`;
}

export default function DealBlock({ deal }: { deal: ForecastDeal }) {
  const [hover, setHover] = useState(false);
  const probabilityColor = deal.probability >= 70 ? '#0A9E5F' : deal.probability >= 40 ? '#FB923C' : '#E15A51';

  return (
    <div className="relative" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <Link to={`/deals/${deal.id}`}>
        <div className="bg-white border border-gray-200 rounded-lg p-2.5 hover:border-indigo-300 hover:shadow-sm transition-all cursor-pointer">
          <p className="text-xs font-medium text-gray-800 truncate">{deal.title}</p>
          <p className="text-xs text-gray-500 mt-0.5">{fmt(deal.value)}</p>
          <div className="flex items-center gap-1 mt-1.5">
            <div className="flex-1 bg-gray-100 rounded-full h-1">
              <div className="h-1 rounded-full" style={{ width: `${deal.probability}%`, backgroundColor: probabilityColor }} />
            </div>
            <span className="text-[10px] font-medium" style={{ color: probabilityColor }}>{deal.probability}%</span>
          </div>
        </div>
      </Link>
      {hover && (
        <div className="absolute left-0 top-full mt-1 z-20 bg-white border border-gray-200 rounded-xl shadow-xl p-3 w-52 pointer-events-none">
          <p className="text-xs font-semibold text-gray-900 mb-1.5">{deal.title}</p>
          <div className="flex flex-col gap-1 text-xs text-gray-500">
            <span>Value: <strong className="text-gray-800">{fmt(deal.value)}</strong></span>
            <span>Weighted: <strong className="text-green-700">{fmt(deal.weightedValue)}</strong></span>
            <span>Stage: <strong className="text-gray-800">{deal.stageName}</strong></span>
            <span>Close: <strong className="text-gray-800">{deal.expectedCloseDate ?? '—'}</strong></span>
          </div>
        </div>
      )}
    </div>
  );
}
