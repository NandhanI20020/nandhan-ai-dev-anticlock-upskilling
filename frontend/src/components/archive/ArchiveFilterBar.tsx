import { Search } from 'lucide-react';
import { useArchiveStore } from '../../store/archiveStore';
import type { ArchiveDatePreset } from '../../store/archiveStore';

const DATE_PRESETS: { key: ArchiveDatePreset; label: string }[] = [
  { key: 'all_time',     label: 'All Time' },
  { key: 'this_quarter', label: 'This Quarter' },
  { key: 'this_year',    label: 'This Year' },
  { key: 'last_year',    label: 'Last Year' },
];

export default function ArchiveFilterBar() {
  const { statusFilter, datePreset, searchQuery, setStatusFilter, setDatePreset, setSearchQuery } = useArchiveStore();

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="relative">
        <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search deals…"
          className="pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-400 w-48" />
      </div>
      <div className="flex rounded-lg border border-gray-200 overflow-hidden bg-white">
        {(['all', 'won', 'lost'] as const).map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 text-xs font-medium cursor-pointer border-r border-gray-200 last:border-0 capitalize transition-colors
              ${statusFilter === s ? 'text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            style={statusFilter === s ? { backgroundColor: '#6F6EE8' } : {}}
          >{s}</button>
        ))}
      </div>
      <select value={datePreset} onChange={(e) => setDatePreset(e.target.value as ArchiveDatePreset)}
        className="text-sm border border-gray-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-400 bg-white">
        {DATE_PRESETS.map((d) => <option key={d.key} value={d.key}>{d.label}</option>)}
      </select>
    </div>
  );
}
