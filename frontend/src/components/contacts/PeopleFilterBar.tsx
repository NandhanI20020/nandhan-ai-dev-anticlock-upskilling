import { useState } from 'react';
import { X, SlidersHorizontal } from 'lucide-react';
import type { PeopleFilters } from '../../store/contactsStore';

interface Props {
  filters: PeopleFilters;
  onSetFilters: (f: Partial<PeopleFilters>) => void;
  onClear: () => void;
}

export default function PeopleFilterBar({ filters, onSetFilters, onClear }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [labelInput, setLabelInput] = useState('');

  const hasFilters = filters.myPeople || filters.label;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button
        onClick={() => onSetFilters({ myPeople: !filters.myPeople })}
        className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded-full border cursor-pointer transition-colors
          ${filters.myPeople ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
      >
        Assigned To: Me {filters.myPeople && <X size={10} onClick={(e) => { e.stopPropagation(); onSetFilters({ myPeople: false }); }} />}
      </button>

      {filters.label && (
        <span className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-full bg-indigo-50 border border-indigo-300 text-indigo-700">
          Label: {filters.label}
          <button onClick={() => onSetFilters({ label: undefined })}><X size={10} /></button>
        </span>
      )}

      {hasFilters && (
        <button onClick={onClear} className="text-xs text-gray-400 hover:text-gray-700 underline cursor-pointer">Clear all</button>
      )}

      <button onClick={() => setDrawerOpen(true)} className="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-xs border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 cursor-pointer">
        <SlidersHorizontal size={12} /> Filters
      </button>

      {drawerOpen && (
        <div className="fixed inset-0 z-40 flex justify-end">
          <div className="absolute inset-0 bg-black/20" onClick={() => setDrawerOpen(false)} />
          <div className="relative z-10 w-72 bg-white shadow-xl border-l border-gray-200 p-4 flex flex-col gap-4 h-full">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Filters</h3>
              <button onClick={() => setDrawerOpen(false)} className="p-1 rounded hover:bg-gray-100 cursor-pointer"><X size={16} /></button>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Label</label>
              <input value={labelInput} onChange={(e) => setLabelInput(e.target.value)} placeholder="e.g. Hot Lead" className="w-full text-sm border border-gray-300 rounded px-2.5 py-1.5 focus:outline-none focus:border-indigo-400" />
            </div>
            <button onClick={() => { onSetFilters({ label: labelInput || undefined }); setDrawerOpen(false); }} className="py-2 text-sm text-white rounded-md font-medium cursor-pointer" style={{ backgroundColor: '#6F6EE8' }}>Apply</button>
          </div>
        </div>
      )}
    </div>
  );
}
