import type { ArchivedDeal } from '../../../../shared/types/archive';
import ArchiveTableRow from './ArchiveTableRow';

interface Props { deals: ArchivedDeal[]; isLoading: boolean; }

export default function ArchiveTable({ deals, isLoading }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {['Deal', 'Status', 'Value', 'Owner', 'Closed', 'Lost Reason', ''].map((h) => (
              <th key={h} className="text-left py-2.5 px-4 text-xs font-semibold text-gray-500">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? Array.from({ length: 5 }).map((_, i) => (
            <tr key={i} className="border-b border-gray-100 animate-pulse">
              {Array.from({ length: 7 }).map((_, j) => <td key={j} className="py-3 px-4"><div className="h-4 bg-gray-100 rounded w-20" /></td>)}
            </tr>
          )) : deals.length === 0 ? (
            <tr><td colSpan={7} className="py-12 text-center text-sm text-gray-400">No archived deals match your filters.</td></tr>
          ) : deals.map((d) => <ArchiveTableRow key={d.id} deal={d} />)}
        </tbody>
      </table>
    </div>
  );
}
