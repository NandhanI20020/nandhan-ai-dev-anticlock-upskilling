import { RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { ArchivedDeal } from '../../../../shared/types/archive';
import { useReopenDeal } from '../../api/useArchive';

function fmt(n: number): string {
  return n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `$${(n / 1_000).toFixed(0)}K` : `$${n}`;
}

export default function ArchiveTableRow({ deal }: { deal: ArchivedDeal }) {
  const reopen = useReopenDeal();
  const won = deal.status === 'won';

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="py-3 px-4">
        <Link to={`/deals/${deal.id}`} className="text-sm font-medium text-indigo-700 hover:underline">{deal.title}</Link>
      </td>
      <td className="py-3 px-4">
        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${won ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
          {won ? 'Won' : 'Lost'}
        </span>
      </td>
      <td className="py-3 px-4 text-sm font-medium text-gray-800">{fmt(deal.value)}</td>
      <td className="py-3 px-4 text-xs text-gray-500">{deal.ownerName}</td>
      <td className="py-3 px-4 text-xs text-gray-400">{deal.closedAt ? new Date(deal.closedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}</td>
      <td className="py-3 px-4 text-xs text-gray-500">{deal.lostReason ?? '—'}</td>
      <td className="py-3 px-4">
        <button onClick={() => { if (window.confirm('Reopen this deal?')) reopen.mutate(deal.id); }}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-indigo-600 cursor-pointer transition-colors">
          <RotateCcw size={11} /> Reopen
        </button>
      </td>
    </tr>
  );
}
