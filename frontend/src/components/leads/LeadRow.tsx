import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import type { Lead } from '../../../../shared/types/lead';
import IntentScoreBadge from './IntentScoreBadge';
import ConvertLeadModal from './ConvertLeadModal';

function fmt(n: number | null): string {
  if (!n) return '—';
  return n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `$${(n / 1_000).toFixed(0)}K` : `$${n}`;
}

export default function LeadRow({ lead }: { lead: Lead }) {
  const [converting, setConverting] = useState(false);
  const isConverted = lead.status === 'converted';
  return (
    <>
      <tr className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${isConverted ? 'opacity-50' : ''}`}>
        <td className="py-3 px-4">
          <p className="text-sm font-medium text-gray-900">{lead.name}</p>
          {lead.email && <p className="text-xs text-gray-400">{lead.email}</p>}
        </td>
        <td className="py-3 px-4"><IntentScoreBadge score={lead.intentScore} /></td>
        <td className="py-3 px-4 text-xs text-gray-500">{lead.source}</td>
        <td className="py-3 px-4 text-sm text-gray-700 font-medium">{fmt(lead.estimatedValue)}</td>
        <td className="py-3 px-4">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${isConverted ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
            {lead.status}
          </span>
        </td>
        <td className="py-3 px-4">
          {!isConverted && (
            <button onClick={() => setConverting(true)} className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer">
              Convert <ArrowRight size={11} />
            </button>
          )}
        </td>
      </tr>
      {converting && <ConvertLeadModal lead={lead} onClose={() => setConverting(false)} />}
    </>
  );
}
