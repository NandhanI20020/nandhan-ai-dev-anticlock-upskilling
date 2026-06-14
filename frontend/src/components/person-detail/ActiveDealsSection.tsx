import { Link } from 'react-router-dom';
import type { ActivePersonDeal } from '../../../../shared/types/person';
import { formatCurrencyCompact } from '../../utils/dateUtils';

interface Props { deals: ActivePersonDeal[]; }

export default function ActiveDealsSection({ deals }: Props) {
  if (deals.length === 0) return (
    <div className="mt-4 pt-4 border-t border-gray-100">
      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Active Deals <span className="text-gray-300">(0)</span></p>
      <p className="text-xs text-gray-400">No open deals linked to this contact.</p>
    </div>
  );

  return (
    <div className="mt-4 pt-4 border-t border-gray-100">
      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Active Deals <span className="bg-indigo-100 text-indigo-700 text-[9px] px-1.5 py-0.5 rounded-full ml-1">{deals.length}</span></p>
      <div className="flex flex-col gap-2">
        {deals.map((d) => (
          <Link key={d.id} to={`/deals/${d.id}`} className="block p-2.5 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors">
            <p className="text-sm font-medium text-gray-900 truncate">{d.title}</p>
            <div className="flex items-center justify-between mt-0.5">
              <span className="text-xs text-gray-400">{d.stageName}</span>
              <span className="text-xs font-semibold" style={{ color: '#0A9E5F' }}>{formatCurrencyCompact(d.value)}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
