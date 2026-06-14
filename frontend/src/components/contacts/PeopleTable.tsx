import { useRef, useEffect } from 'react';
import { ArrowUp, ArrowDown, ChevronsUpDown } from 'lucide-react';
import type { PersonListItem } from '../../../../shared/types/person';
import PersonRow from './PersonRow';

const COLUMNS = [
  { key: 'name',       label: 'Name' },
  { key: 'orgName',    label: 'Organization' },
  { key: 'email',      label: 'Email' },
  { key: 'phone',      label: 'Phone' },
  { key: 'dealCount',  label: 'Deals' },
  { key: 'lastAction', label: 'Last Action' },
];

interface Props {
  people: PersonListItem[];
  sort: string;
  sortDir: 'asc' | 'desc';
  selectedIds: Set<string>;
  isLoading: boolean;
  onSort: (k: string) => void;
  onToggleSelect: (id: string) => void;
  onSelectAll: (ids: string[]) => void;
  onClearAll: () => void;
}

export default function PeopleTable({ people, sort, sortDir, selectedIds, isLoading, onSort, onToggleSelect, onSelectAll, onClearAll }: Props) {
  const hRef = useRef<HTMLInputElement>(null);
  const allSel = people.length > 0 && people.every((p) => selectedIds.has(p.id));
  const someSel = people.some((p) => selectedIds.has(p.id));
  useEffect(() => { if (hRef.current) hRef.current.indeterminate = someSel && !allSel; }, [someSel, allSel]);

  if (isLoading) return <div className="p-8 text-center text-sm text-gray-400 animate-pulse">Loading contacts…</div>;
  if (people.length === 0) return <div className="p-8 text-center text-sm text-gray-400">No contacts match your filters.</div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="pl-4 pr-2 py-2.5 w-8"><input ref={hRef} type="checkbox" className="rounded border-gray-300 text-indigo-600 cursor-pointer" checked={allSel} onChange={() => allSel ? onClearAll() : onSelectAll(people.map((p) => p.id))} /></th>
            {COLUMNS.map((c) => (
              <th key={c.key} className="px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer select-none hover:text-gray-800 whitespace-nowrap" onClick={() => onSort(c.key)}>
                <span className="flex items-center gap-1">{c.label} {sort === c.key ? (sortDir === 'asc' ? <ArrowUp size={12} className="text-indigo-500" /> : <ArrowDown size={12} className="text-indigo-500" />) : <ChevronsUpDown size={12} className="text-gray-300" />}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{people.map((p) => <PersonRow key={p.id} person={p} selected={selectedIds.has(p.id)} onToggle={onToggleSelect} />)}</tbody>
      </table>
    </div>
  );
}
