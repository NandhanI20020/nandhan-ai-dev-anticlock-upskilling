import { useState } from 'react';
import { X, Save } from 'lucide-react';
import type { DealListFilters } from '../../../../shared/types/deal';
import { useCreateView } from '../../api/useSavedViews';

interface Props {
  filters: DealListFilters;
  onRemoveFilter: (key: keyof DealListFilters) => void;
  onClearAll: () => void;
}

const FILTER_LABELS: Partial<Record<keyof DealListFilters, string>> = {
  stageId:       'Stage',
  ownerId:       'Owner',
  label:         'Label',
  valueMin:      'Min Value',
  valueMax:      'Max Value',
  closeDateFrom: 'Close From',
  closeDateTo:   'Close To',
  source:        'Source',
};

export default function FilterChipBar({ filters, onRemoveFilter, onClearAll }: Props) {
  const [saving, setSaving] = useState(false);
  const [viewName, setViewName] = useState('');
  const createView = useCreateView();

  const activeKeys = (Object.keys(FILTER_LABELS) as (keyof DealListFilters)[]).filter(
    (k) => filters[k] !== undefined && filters[k] !== null && filters[k] !== '',
  );

  if (activeKeys.length === 0) return null;

  function handleSave() {
    if (!viewName.trim()) return;
    createView.mutate({ name: viewName.trim(), filters });
    setSaving(false);
    setViewName('');
  }

  return (
    <div className="flex items-center gap-2 flex-wrap px-1">
      {activeKeys.map((key) => (
        <span
          key={key}
          className="flex items-center gap-1 px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs rounded-full border border-indigo-200"
        >
          {FILTER_LABELS[key]}: {String(filters[key])}
          <button
            onClick={() => onRemoveFilter(key)}
            className="hover:text-indigo-900 cursor-pointer"
          >
            <X size={10} />
          </button>
        </span>
      ))}

      <button
        onClick={onClearAll}
        className="text-xs text-gray-400 hover:text-gray-700 underline cursor-pointer"
      >
        Clear all
      </button>

      {!saving ? (
        <button
          onClick={() => setSaving(true)}
          className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 cursor-pointer"
        >
          <Save size={11} /> Save as view
        </button>
      ) : (
        <div className="flex items-center gap-1">
          <input
            autoFocus
            value={viewName}
            onChange={(e) => setViewName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') setSaving(false); }}
            placeholder="View name…"
            className="text-xs border border-gray-300 rounded px-2 py-0.5 focus:outline-none focus:border-indigo-400 w-32"
          />
          <button
            onClick={handleSave}
            disabled={!viewName.trim()}
            className="text-xs px-2 py-0.5 rounded text-white cursor-pointer disabled:opacity-40"
            style={{ backgroundColor: '#6F6EE8' }}
          >
            Save
          </button>
          <button onClick={() => setSaving(false)} className="text-xs text-gray-400 hover:text-gray-700 cursor-pointer">
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
