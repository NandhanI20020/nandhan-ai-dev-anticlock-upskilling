import { useState } from 'react';
import { X } from 'lucide-react';
import type { DealListFilters } from '../../../../shared/types/deal';

interface Props {
  filters: DealListFilters;
  onApply: (filters: Partial<DealListFilters>) => void;
  onClose: () => void;
}

export default function AdvancedFiltersPanel({ filters, onApply, onClose }: Props) {
  const [local, setLocal] = useState<Partial<DealListFilters>>({
    stageId:       filters.stageId ?? '',
    source:        filters.source ?? '',
    valueMin:      filters.valueMin,
    valueMax:      filters.valueMax,
    closeDateFrom: filters.closeDateFrom ?? '',
    closeDateTo:   filters.closeDateTo ?? '',
  });

  function set<K extends keyof DealListFilters>(key: K, value: DealListFilters[K]) {
    setLocal((prev) => ({ ...prev, [key]: value }));
  }

  function handleApply() {
    const cleaned: Partial<DealListFilters> = {};
    if (local.stageId)       cleaned.stageId = local.stageId;
    if (local.source)        cleaned.source = local.source;
    if (local.valueMin !== undefined && local.valueMin !== null) cleaned.valueMin = Number(local.valueMin);
    if (local.valueMax !== undefined && local.valueMax !== null) cleaned.valueMax = Number(local.valueMax);
    if (local.closeDateFrom) cleaned.closeDateFrom = local.closeDateFrom;
    if (local.closeDateTo)   cleaned.closeDateTo = local.closeDateTo;
    onApply(cleaned);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div className="relative z-10 w-80 bg-white shadow-xl border-l border-gray-200 flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-800">Advanced Filters</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100 cursor-pointer">
            <X size={16} className="text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Stage ID</label>
            <input
              value={local.stageId ?? ''}
              onChange={(e) => set('stageId', e.target.value)}
              placeholder="e.g. stage-002"
              className="w-full text-sm border border-gray-300 rounded px-2.5 py-1.5 focus:outline-none focus:border-indigo-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Source</label>
            <input
              value={local.source ?? ''}
              onChange={(e) => set('source', e.target.value)}
              placeholder="e.g. Website"
              className="w-full text-sm border border-gray-300 rounded px-2.5 py-1.5 focus:outline-none focus:border-indigo-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Value Range</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={local.valueMin ?? ''}
                onChange={(e) => set('valueMin', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="Min"
                className="w-full text-sm border border-gray-300 rounded px-2.5 py-1.5 focus:outline-none focus:border-indigo-400"
              />
              <input
                type="number"
                value={local.valueMax ?? ''}
                onChange={(e) => set('valueMax', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="Max"
                className="w-full text-sm border border-gray-300 rounded px-2.5 py-1.5 focus:outline-none focus:border-indigo-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Close Date Range</label>
            <div className="flex flex-col gap-2">
              <input
                type="date"
                value={local.closeDateFrom ?? ''}
                onChange={(e) => set('closeDateFrom', e.target.value)}
                className="w-full text-sm border border-gray-300 rounded px-2.5 py-1.5 focus:outline-none focus:border-indigo-400"
              />
              <input
                type="date"
                value={local.closeDateTo ?? ''}
                onChange={(e) => set('closeDateTo', e.target.value)}
                className="w-full text-sm border border-gray-300 rounded px-2.5 py-1.5 focus:outline-none focus:border-indigo-400"
              />
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 flex gap-2">
          <button
            onClick={handleApply}
            className="flex-1 py-2 text-sm text-white rounded-md font-medium cursor-pointer"
            style={{ backgroundColor: '#6F6EE8' }}
          >
            Apply Filters
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
