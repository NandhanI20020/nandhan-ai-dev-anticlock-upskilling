import { useRef, useEffect } from 'react';
import { ArrowUp, ArrowDown, ChevronsUpDown } from 'lucide-react';
import type { DealListItem } from '../../../../shared/types/deal';
import DealRow from './DealRow';

const COLUMNS: { key: string; label: string; sortable: boolean }[] = [
  { key: 'title',               label: 'Deal',          sortable: true },
  { key: 'value',               label: 'Value',         sortable: true },
  { key: 'stageName',           label: 'Stage',         sortable: true },
  { key: 'ownerName',           label: 'Owner',         sortable: true },
  { key: 'expectedCloseDate',   label: 'Close Date',    sortable: true },
];

interface Props {
  deals: DealListItem[];
  sort: string;
  sortDir: 'asc' | 'desc';
  selectedIds: Set<string>;
  isLoading: boolean;
  onSort: (key: string) => void;
  onToggleSelect: (id: string) => void;
  onSelectAll: (ids: string[]) => void;
  onClearAll: () => void;
}

export default function DealsTable({
  deals, sort, sortDir, selectedIds, isLoading,
  onSort, onToggleSelect, onSelectAll, onClearAll,
}: Props) {
  const headerCheckRef = useRef<HTMLInputElement>(null);
  const allSelected = deals.length > 0 && deals.every((d) => selectedIds.has(d.id));
  const someSelected = deals.some((d) => selectedIds.has(d.id));

  useEffect(() => {
    if (headerCheckRef.current) {
      headerCheckRef.current.indeterminate = someSelected && !allSelected;
    }
  }, [someSelected, allSelected]);

  function SortIcon({ col }: { col: string }) {
    if (sort !== col) return <ChevronsUpDown size={12} className="text-gray-300" />;
    return sortDir === 'asc'
      ? <ArrowUp size={12} className="text-indigo-500" />
      : <ArrowDown size={12} className="text-indigo-500" />;
  }

  if (isLoading) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="pl-4 pr-2 py-2.5 w-8" />
              {COLUMNS.map((c) => (
                <th key={c.key} className="px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }, (_, i) => (
              <tr key={i} className="border-b border-gray-100 animate-pulse">
                <td className="pl-4 pr-2 py-3"><div className="w-4 h-4 bg-gray-200 rounded" /></td>
                <td className="px-3 py-3"><div className="h-4 bg-gray-200 rounded w-48 mb-1" /><div className="h-3 bg-gray-100 rounded w-32" /></td>
                <td className="px-3 py-3"><div className="h-4 bg-gray-200 rounded w-20" /></td>
                <td className="px-3 py-3"><div className="h-4 bg-gray-200 rounded w-24" /></td>
                <td className="px-3 py-3"><div className="h-4 bg-gray-200 rounded w-20" /></td>
                <td className="px-3 py-3"><div className="h-4 bg-gray-200 rounded w-24" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (deals.length === 0) {
    return (
      <div className="text-center py-16 text-sm text-gray-400">
        No deals match your filters.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="pl-4 pr-2 py-2.5 w-8">
              <input
                ref={headerCheckRef}
                type="checkbox"
                className="rounded border-gray-300 text-indigo-600 cursor-pointer"
                checked={allSelected}
                onChange={() => allSelected ? onClearAll() : onSelectAll(deals.map((d) => d.id))}
              />
            </th>
            {COLUMNS.map((c) => (
              <th
                key={c.key}
                className={`px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap
                  ${c.sortable ? 'cursor-pointer select-none hover:text-gray-800' : ''}`}
                onClick={() => c.sortable && onSort(c.key)}
              >
                <span className="flex items-center gap-1">
                  {c.label}
                  {c.sortable && <SortIcon col={c.key} />}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {deals.map((deal) => (
            <DealRow
              key={deal.id}
              deal={deal}
              selected={selectedIds.has(deal.id)}
              onToggleSelect={onToggleSelect}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
