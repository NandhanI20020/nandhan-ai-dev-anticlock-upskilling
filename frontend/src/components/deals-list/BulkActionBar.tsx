import { useState } from 'react';
import { Trash2, UserCheck, X } from 'lucide-react';
import { useBulkAction } from '../../api/useDealsTable';

const OWNER_OPTIONS = [
  { id: 'user-1', name: 'Alice Johnson' },
  { id: 'user-2', name: 'Bob Smith' },
];

interface Props {
  selectedIds: Set<string>;
  onClear: () => void;
}

export default function BulkActionBar({ selectedIds, onClear }: Props) {
  const [assignOpen, setAssignOpen] = useState(false);
  const bulk = useBulkAction();
  const ids = Array.from(selectedIds);

  function handleDelete() {
    if (!window.confirm(`Delete ${ids.length} deal${ids.length > 1 ? 's' : ''}? This cannot be undone.`)) return;
    bulk.mutate({ ids, action: 'delete' }, { onSuccess: onClear });
  }

  function handleAssign(ownerId: string) {
    bulk.mutate({ ids, action: 'assignOwner', ownerId }, { onSuccess: () => { onClear(); setAssignOpen(false); } });
  }

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm sticky top-0 z-10 shadow-md">
      <span className="font-medium">{ids.length} selected</span>

      <div className="flex items-center gap-2 ml-2">
        <div className="relative">
          <button
            onClick={() => setAssignOpen((v) => !v)}
            className="flex items-center gap-1.5 px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-sm cursor-pointer"
          >
            <UserCheck size={13} /> Assign Owner
          </button>
          {assignOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setAssignOpen(false)} />
              <div className="absolute z-20 top-full mt-1 left-0 bg-white border border-gray-200 rounded-lg shadow-lg py-1 w-44">
                {OWNER_OPTIONS.map((o) => (
                  <button
                    key={o.id}
                    onClick={() => handleAssign(o.id)}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                  >
                    {o.name}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <button
          onClick={handleDelete}
          className="flex items-center gap-1.5 px-3 py-1 bg-red-500 hover:bg-red-600 rounded text-sm cursor-pointer"
        >
          <Trash2 size={13} /> Delete
        </button>
      </div>

      <button
        onClick={onClear}
        className="ml-auto p-1 hover:bg-white/20 rounded cursor-pointer"
      >
        <X size={14} />
      </button>
    </div>
  );
}
