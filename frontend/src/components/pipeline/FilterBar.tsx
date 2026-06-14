import { Search, X } from 'lucide-react';
import { useKanbanStore } from '../../store/kanbanStore';

export default function FilterBar() {
  const { filters, setFilters, resetFilters } = useKanbanStore();
  const hasFilters = filters.search !== '' || filters.ownerId !== null || filters.labels.length > 0;

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search deals..."
          value={filters.search}
          onChange={(e) => setFilters({ search: e.target.value })}
          className="pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#6F6EE8]/30 w-48"
        />
      </div>

      {hasFilters && (
        <button
          onClick={resetFilters}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 cursor-pointer"
        >
          <X size={12} /> Clear
        </button>
      )}
    </div>
  );
}
