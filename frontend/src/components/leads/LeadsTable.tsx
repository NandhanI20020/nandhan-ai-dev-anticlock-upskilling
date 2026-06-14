import type { Lead } from '../../../../shared/types/lead';
import LeadRow from './LeadRow';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useLeadsStore } from '../../store/leadsStore';

const COLS = [
  { key: 'name',           label: 'Name' },
  { key: 'intentScore',    label: 'Intent' },
  { key: 'source',         label: 'Source' },
  { key: 'estimatedValue', label: 'Value' },
  { key: 'status',         label: 'Status' },
  { key: '',               label: '' },
];

interface Props { leads: Lead[]; isLoading: boolean; }

export default function LeadsTable({ leads, isLoading }: Props) {
  const { sortField, sortDir, setSortField } = useLeadsStore();

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {COLS.map((col) => (
              <th key={col.key} className={`text-left py-2.5 px-4 text-xs font-semibold text-gray-500 ${col.key ? 'cursor-pointer hover:text-gray-800 select-none' : ''}`}
                onClick={() => col.key && setSortField(col.key)}>
                <span className="flex items-center gap-1">
                  {col.label}
                  {col.key && sortField === col.key && (sortDir === 'asc' ? <ChevronUp size={11} /> : <ChevronDown size={11} />)}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? Array.from({ length: 5 }).map((_, i) => (
            <tr key={i} className="border-b border-gray-100 animate-pulse">
              {Array.from({ length: 6 }).map((_, j) => <td key={j} className="py-3 px-4"><div className="h-4 bg-gray-100 rounded w-24" /></td>)}
            </tr>
          )) : leads.length === 0 ? (
            <tr><td colSpan={6} className="py-12 text-center text-sm text-gray-400">No leads found.</td></tr>
          ) : leads.map((l) => <LeadRow key={l.id} lead={l} />)}
        </tbody>
      </table>
    </div>
  );
}
