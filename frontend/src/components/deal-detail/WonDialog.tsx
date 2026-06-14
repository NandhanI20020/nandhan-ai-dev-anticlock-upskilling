import { useState } from 'react';
import { Trophy, X } from 'lucide-react';

interface Props {
  onConfirm: (note?: string) => void;
  onClose: () => void;
}

export default function WonDialog({ onConfirm, onClose }: Props) {
  const [note, setNote] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy size={18} style={{ color: '#0A9E5F' }} />
            <h2 className="text-base font-semibold text-gray-900">Mark as Won</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X size={16} /></button>
        </div>
        <p className="text-sm text-gray-500 mb-4">Congratulations! Add an optional note about the win.</p>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="e.g. Closed on annual plan, champion was CFO"
          rows={3}
          className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#6F6EE8]/30 mb-4"
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer">Cancel</button>
          <button
            onClick={() => onConfirm(note || undefined)}
            className="px-4 py-2 text-sm text-white rounded-md cursor-pointer"
            style={{ backgroundColor: '#0A9E5F' }}
          >
            Confirm Won
          </button>
        </div>
      </div>
    </div>
  );
}
