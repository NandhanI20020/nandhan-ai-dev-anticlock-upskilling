import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SlidersHorizontal, Download, LayoutGrid, List } from 'lucide-react';
import { useDealsListStore } from '../store/dealsListStore';
import { useDealsTable, useAllDealsForExport } from '../api/useDealsTable';
import type { DealListFilters } from '../../../shared/types/deal';
import DealsTable from '../components/deals-list/DealsTable';
import QuickFilterTabs from '../components/deals-list/QuickFilterTabs';
import FilterChipBar from '../components/deals-list/FilterChipBar';
import AdvancedFiltersPanel from '../components/deals-list/AdvancedFiltersPanel';
import SavedViewsDropdown from '../components/deals-list/SavedViewsDropdown';
import BulkActionBar from '../components/deals-list/BulkActionBar';
import PaginationControls from '../components/shared/PaginationControls';
import { exportToCsv } from '../lib/csvExport';

export default function DealsListPage() {
  const [filtersOpen, setFiltersOpen] = useState(false);

  const {
    filters, sort, sortDir, selectedIds, page, perPage,
    setFilters, clearFilters, setSort, toggleSelected, setAllSelected, clearSelected, setPage,
  } = useDealsListStore();

  const { data, isLoading } = useDealsTable(filters, sort, sortDir, page, perPage);
  const getAllDeals = useAllDealsForExport(filters, sort, sortDir);

  const deals = data?.deals ?? [];
  const total = data?.total ?? 0;

  function handleTabChange(key: string) {
    if (key === 'my') {
      setFilters({ status: 'all', myDeals: true });
    } else {
      setFilters({ status: key as DealListFilters['status'], myDeals: undefined });
    }
    clearSelected();
  }

  function activeTab(): string {
    if (filters.myDeals) return 'my';
    return filters.status ?? 'all';
  }

  async function handleExport() {
    try {
      const result = await getAllDeals();
      const date = new Date().toISOString().slice(0, 10);
      exportToCsv(result.deals, `deals-export-${date}.csv`);
    } catch {
      // silently fail
    }
  }

  function removeFilter(key: keyof DealListFilters) {
    const next = { ...filters };
    delete next[key];
    setFilters(next);
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden bg-gray-50">
      {/* View toggle header */}
      <div className="bg-white border-b border-gray-200 px-6 pt-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-base font-semibold text-gray-800">Deals</h1>
          <div className="flex items-center gap-1 p-0.5 bg-gray-100 rounded-md">
            <Link
              to="/pipeline"
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded text-gray-500 hover:text-gray-800 hover:bg-white transition-colors"
            >
              <LayoutGrid size={13} /> Pipeline
            </Link>
            <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded text-white" style={{ backgroundColor: '#6F6EE8' }}>
              <List size={13} /> List
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-0.5">
          <SavedViewsDropdown onApplyView={(f) => { setFilters(f); clearSelected(); }} />
          <button
            onClick={() => setFiltersOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 cursor-pointer"
          >
            <SlidersHorizontal size={13} /> Filters
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 cursor-pointer"
          >
            <Download size={13} /> Export
          </button>
        </div>
      </div>

      <QuickFilterTabs activeTab={activeTab()} total={total} onTabChange={handleTabChange} />

      <div className="flex flex-col flex-1 overflow-auto">
        <div className="bg-white mx-4 mt-4 rounded-xl border border-gray-200 flex flex-col mb-4">
          {selectedIds.size > 0 && (
            <div className="px-4 pt-3">
              <BulkActionBar selectedIds={selectedIds} onClear={clearSelected} />
            </div>
          )}

          <FilterChipBar
            filters={filters}
            onRemoveFilter={removeFilter}
            onClearAll={() => { clearFilters(); clearSelected(); }}
          />

          <DealsTable
            deals={deals}
            sort={sort}
            sortDir={sortDir}
            selectedIds={selectedIds}
            isLoading={isLoading}
            onSort={setSort}
            onToggleSelect={toggleSelected}
            onSelectAll={setAllSelected}
            onClearAll={clearSelected}
          />

          <div className="px-4 border-t border-gray-100">
            <PaginationControls
              total={total}
              page={page}
              perPage={perPage}
              onPageChange={setPage}
            />
          </div>
        </div>
      </div>

      {filtersOpen && (
        <AdvancedFiltersPanel
          filters={filters}
          onApply={(partial) => { setFilters(partial); clearSelected(); }}
          onClose={() => setFiltersOpen(false)}
        />
      )}
    </div>
  );
}
