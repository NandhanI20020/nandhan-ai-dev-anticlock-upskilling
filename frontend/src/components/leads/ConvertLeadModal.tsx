import { useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import type { Lead } from '../../../../shared/types/lead';
import { useConvertLead } from '../../api/useLeads';

interface Props { lead: Lead; onClose: () => void; }

export default function ConvertLeadModal({ lead, onClose }: Props) {
  const [title, setTitle] = useState(lead.name);
  const [value, setValue] = useState(String(lead.estimatedValue ?? ''));
  const convert = useConvertLead();

  function handleConvert(e: React.FormEvent) {
    e.preventDefault();
    convert.mutate(
      { leadId: lead.id, title, value: Number(value) || 0, pipelineId: 'pipeline-1', stageId: '' },
      { onSuccess: onClose }
    );
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold">Convert Lead to Deal</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100 cursor-pointer"><X size={16} /></button>
        </div>
        <form onSubmit={handleConvert} className="flex flex-col gap-3">
          <div><label className="block text-xs font-medium text-gray-600 mb-1">Deal Title *</label>
            <input required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full text-sm border border-gray-300 rounded px-2.5 py-1.5 focus:outline-none focus:border-indigo-400" /></div>
          <div><label className="block text-xs font-medium text-gray-600 mb-1">Deal Value ($)</label>
            <input type="number" min="0" value={value} onChange={(e) => setValue(e.target.value)} className="w-full text-sm border border-gray-300 rounded px-2.5 py-1.5 focus:outline-none focus:border-indigo-400" /></div>
          <div className="flex gap-2 mt-1">
            <button type="submit" disabled={convert.isPending} className="flex-1 py-2 text-sm text-white rounded-md font-medium cursor-pointer disabled:opacity-50" style={{ backgroundColor: '#6F6EE8' }}>Create Deal</button>
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer">Cancel</button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
