import { useState } from 'react';
import { XCircle, X } from 'lucide-react';

interface Props {
  onConfirm: (reason: string) => void;
  onClose: () => void;
}

export default function LostDialog({ onConfirm, onClose }: Props) {
  const [reason, setReason] = useState('');
  const [touched, setTouched] = useState(false);
  const invalid = touched && !reason.trim();

  function handleConfirm() {
    setTouched(true);
    if (!reason.trim()) return;
    onConfirm(reason.trim());
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <XCircle size={18} style={{ color: '#E15A51' }} />
            <h2 className="text-base font-semibold text-gray-900">Mark as Lost</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X size={16} /></button>
        </div>
        <p className="text-sm text-gray-500 mb-3">Please provide a reason for losing this deal.</p>
        <input
          autoFocus
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          onBlur={() => setTouched(true)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleConfirm(); }}
          placeholder="e.g. Lost to competitor, budget cut"
          className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 mb-1 ${invalid ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-[#6F6EE8]/30'}`}
        />
        {invalid && <p className="text-xs text-red-500 mb-3">Reason is required</p>}
        <div className={`flex justify-end gap-2 ${invalid ? '' : 'mt-4'}`}>
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer">Cancel</button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 text-sm text-white rounded-md cursor-pointer"
            style={{ backgroundColor: '#E15A51' }}
          >
            Confirm Lost
          </button>
        </div>
      </div>
    </div>
  );
}
