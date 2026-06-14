import { ArrowUp, ArrowDown, ChevronsUpDown } from 'lucide-react';
import type { OrgListItem } from '../../../../shared/types/organization';
import OrgRow from './OrgRow';

const COLS = [
  { key: 'name', label: 'Organization' },
  { key: 'peopleCount', label: 'People' },
  { key: 'dealCount', label: 'Deals' },
  { key: 'ownerName', label: 'Owner' },
  { key: 'lastActivityDate', label: 'Last Activity' },
];

interface Props {
  orgs: OrgListItem[];
  sort: string;
  sortDir: 'asc' | 'desc';
  isLoading: boolean;
  onSort: (k: string) => void;
}

export default function OrgsTable({ orgs, sort, sortDir, isLoading, onSort }: Props) {
  if (isLoading) return <div className="p-8 text-center text-sm text-gray-400 animate-pulse">Loading organizations…</div>;
  if (orgs.length === 0) return <div className="p-8 text-center text-sm text-gray-400">No organizations found.</div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            {COLS.map((c) => (
              <th key={c.key} onClick={() => onSort(c.key)} className="px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer select-none hover:text-gray-800 whitespace-nowrap">
                <span className="flex items-center gap-1">{c.label} {sort === c.key ? (sortDir === 'asc' ? <ArrowUp size={12} className="text-indigo-500" /> : <ArrowDown size={12} className="text-indigo-500" />) : <ChevronsUpDown size={12} className="text-gray-300" />}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{orgs.map((o) => <OrgRow key={o.id} org={o} />)}</tbody>
      </table>
    </div>
  );
}
