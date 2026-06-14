import type { LeadKPIs } from '../../../../shared/types/lead';

function fmt(n: number): string {
  return n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `$${(n / 1_000).toFixed(0)}K` : `$${n}`;
}

export default function LeadKPICards({ kpis }: { kpis: LeadKPIs | undefined }) {
  if (!kpis) return null;
  const cards = [
    { label: 'Incoming Leads',  value: String(kpis.incomingCount),  color: '#6F6EE8' },
    { label: 'Converted',       value: String(kpis.convertedCount), color: '#0A9E5F' },
    { label: 'Est. Pipeline',   value: fmt(kpis.estimatedValue),    color: '#6F6EE8' },
    { label: 'Response Rate',   value: `${kpis.responseRate}%`,     color: '#FB923C' },
  ];
  return (
    <div className="grid grid-cols-4 gap-3">
      {cards.map((c) => (
        <div key={c.label} className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-400 mb-1">{c.label}</p>
          <p className="text-2xl font-bold" style={{ color: c.color }}>{c.value}</p>
        </div>
      ))}
    </div>
  );
}
