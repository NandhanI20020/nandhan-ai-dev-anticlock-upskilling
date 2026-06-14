import { Link } from 'react-router-dom';
import type { RecentDeal } from '../../../../shared/types/insights';

function fmt(n: number): string {
  return n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `$${(n / 1_000).toFixed(0)}K` : `$${n}`;
}

interface Props { deals: RecentDeal[] }

export default function RecentDealsPanel({ deals }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Recently Updated Deals</h3>
      {deals.length === 0 ? <p className="text-sm text-gray-400">No open deals.</p> : (
        <div className="flex flex-col gap-2">
          {deals.map((d) => (
            <div key={d.id} className="flex items-center gap-2">
              <div className="flex-1 min-w-0">
                <Link to={`/deals/${d.id}`} className="text-sm font-medium text-indigo-700 hover:underline truncate block">{d.title}</Link>
                <p className="text-xs text-gray-400">{d.stageName}</p>
              </div>
              <span className="text-xs font-semibold text-gray-700">{fmt(d.value)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
