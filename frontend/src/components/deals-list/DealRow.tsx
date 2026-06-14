import { Link } from 'react-router-dom';
import type { DealListItem } from '../../../../shared/types/deal';
import { formatCurrencyCompact } from '../../utils/dateUtils';
import { daysSince } from '../../utils/dateUtils';
import StageProgressCell from './StageProgressCell';
import DealStatusBadge from './DealStatusBadge';

interface Props {
  deal: DealListItem;
  selected: boolean;
  onToggleSelect: (id: string) => void;
}

export default function DealRow({ deal, selected, onToggleSelect }: Props) {
  const isRotten = deal.rottingDays !== null && deal.status === 'open' && daysSince(deal.updatedAt) > deal.rottingDays;

  return (
    <tr
      className={`border-b border-gray-100 hover:bg-gray-50 transition-colors
        ${deal.status === 'lost' ? 'border-l-4 border-l-red-400' : ''}
        ${isRotten ? 'border-l-4 border-l-orange-400' : ''}
        ${selected ? 'bg-indigo-50' : ''}`}
    >
      <td className="pl-4 pr-2 py-2.5 w-8">
        <input
          type="checkbox"
          className="rounded border-gray-300 text-indigo-600 cursor-pointer"
          checked={selected}
          onChange={() => onToggleSelect(deal.id)}
          onClick={(e) => e.stopPropagation()}
        />
      </td>

      <td className="px-3 py-2.5 min-w-0">
        <Link
          to={`/deals/${deal.id}`}
          className="text-sm font-medium text-gray-900 hover:underline truncate block max-w-xs"
        >
          {deal.title}
        </Link>
        {deal.orgName && (
          <p className="text-xs text-gray-400 truncate">{deal.orgName}</p>
        )}
        <DealStatusBadge status={deal.status} rottingDays={deal.rottingDays} updatedAt={deal.updatedAt} />
      </td>

      <td className="px-3 py-2.5 text-sm font-semibold whitespace-nowrap" style={{ color: '#0A9E5F' }}>
        {formatCurrencyCompact(deal.value, deal.currency)}
      </td>

      <td className="px-3 py-2.5 min-w-[140px]">
        <p className="text-xs text-gray-700 mb-1 truncate">{deal.stageName}</p>
        <StageProgressCell stageOrder={deal.stageOrder} totalStages={deal.pipelineTotalStages} />
      </td>

      <td className="px-3 py-2.5">
        <div className="flex items-center gap-1.5">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
            style={{ backgroundColor: deal.ownerColor }}
            title={deal.ownerName}
          >
            {deal.ownerInitials}
          </div>
          <span className="text-xs text-gray-600 hidden sm:block truncate max-w-[80px]">{deal.ownerName}</span>
        </div>
      </td>

      <td className="px-3 py-2.5 text-xs text-gray-500 whitespace-nowrap">
        {deal.expectedCloseDate
          ? new Date(deal.expectedCloseDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          : <span className="text-gray-300">—</span>}
      </td>
    </tr>
  );
}
