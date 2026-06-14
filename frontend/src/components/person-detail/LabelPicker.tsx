import { useState } from 'react';
import { X, Tag } from 'lucide-react';
import { useLabels } from '../../api/usePersonDetail';
import { useUpdatePerson } from '../../api/usePersonDetail';

interface Props { personId: string; labelIds: string[]; }

export default function LabelPicker({ personId, labelIds }: Props) {
  const [open, setOpen] = useState(false);
  const { data: labels = [] } = useLabels();
  const update = useUpdatePerson(personId);

  function toggleLabel(id: string) {
    const next = labelIds.includes(id) ? labelIds.filter((l) => l !== id) : [...labelIds, id];
    update.mutate({ labelIds: next });
  }

  return (
    <div className="flex items-center gap-1 flex-wrap mt-2">
      {labelIds.map((id) => {
        const l = labels.find((lb) => lb.id === id);
        return (
          <span key={id} className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: l?.color ?? '#6B7280' }}>
            {l?.name ?? id}
            <button onClick={() => toggleLabel(id)} className="hover:opacity-70 cursor-pointer"><X size={10} /></button>
          </span>
        );
      })}
      <div className="relative">
        <button onClick={() => setOpen((v) => !v)} className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border border-dashed border-gray-300 text-gray-500 hover:border-indigo-400 hover:text-indigo-600 cursor-pointer">
          <Tag size={10} /> Add label
        </button>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <div className="absolute z-20 top-full mt-1 left-0 bg-white border border-gray-200 rounded-lg shadow-lg py-1 w-40">
              {labels.filter((l) => !labelIds.includes(l.id)).map((l) => (
                <button key={l.id} onClick={() => { toggleLabel(l.id); setOpen(false); }} className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50 flex items-center gap-2 cursor-pointer">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: l.color }} />{l.name}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
