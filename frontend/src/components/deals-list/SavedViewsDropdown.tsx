import { useState } from 'react';
import { Bookmark, Trash2, ChevronDown } from 'lucide-react';
import { useSavedViews, useDeleteView } from '../../api/useSavedViews';
import type { DealListFilters } from '../../../../shared/types/deal';

interface Props {
  onApplyView: (filters: DealListFilters) => void;
}

export default function SavedViewsDropdown({ onApplyView }: Props) {
  const [open, setOpen] = useState(false);
  const { data: views = [] } = useSavedViews();
  const deleteView = useDeleteView();

  if (views.length === 0) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 cursor-pointer"
      >
        <Bookmark size={13} /> Views <ChevronDown size={12} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute z-20 top-full mt-1 left-0 bg-white border border-gray-200 rounded-lg shadow-lg py-1 w-52">
            {views.map((view) => (
              <div key={view.id} className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 group">
                <button
                  onClick={() => { onApplyView(view.filters); setOpen(false); }}
                  className="text-sm text-gray-700 text-left flex-1 cursor-pointer"
                >
                  {view.name}
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteView.mutate(view.id); }}
                  className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-red-50 cursor-pointer"
                >
                  <Trash2 size={12} className="text-red-400" />
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
