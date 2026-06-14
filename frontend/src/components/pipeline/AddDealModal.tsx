import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { PipelineWithStages } from '../../../../shared/types/pipeline';
import { useCreateDeal } from '../../api/useDeals';

interface Props {
  pipeline: PipelineWithStages;
  defaultStageId: string;
  onClose: () => void;
}

export default function AddDealModal({ pipeline, defaultStageId, onClose }: Props) {
  const [title, setTitle] = useState('');
  const [value, setValue] = useState('');
  const [stageId, setStageId] = useState(defaultStageId);
  const createDeal = useCreateDeal();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    createDeal.mutate(
      { title: title.trim(), value: parseFloat(value) || 0, stageId, pipelineId: pipeline.id },
      { onSuccess: onClose }
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-gray-900">Add Deal</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Deal title *</label>
            <input
              autoFocus
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Acme Corp — Enterprise License"
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6F6EE8]/30"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Value (USD)</label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="0"
              min="0"
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6F6EE8]/30"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Stage</label>
            <select
              value={stageId}
              onChange={(e) => setStageId(e.target.value)}
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6F6EE8]/30 bg-white"
            >
              {pipeline.stages.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createDeal.isPending}
              className="px-4 py-2 text-sm text-white rounded-md cursor-pointer disabled:opacity-50"
              style={{ backgroundColor: '#0A9E5F' }}
            >
              {createDeal.isPending ? 'Adding…' : 'Add Deal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
