import type { ArchiveKPIs } from '../../../../shared/types/archive';

function fmt(n: number): string {
  return n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `$${(n / 1_000).toFixed(0)}K` : `$${n}`;
}

export default function ArchiveKPICards({ kpis }: { kpis: ArchiveKPIs | undefined }) {
  if (!kpis) return null;
  const cards = [
    { label: 'Deals Won',       value: String(kpis.wonCount),     color: '#0A9E5F' },
    { label: 'Won Revenue',     value: fmt(kpis.wonRevenue),      color: '#0A9E5F' },
    { label: 'Deals Lost',      value: String(kpis.lostCount),    color: '#E15A51' },
    { label: 'Win Rate',        value: `${kpis.winRate}%`,        color: '#6F6EE8' },
    { label: 'Avg Cycle Days',  value: `${kpis.avgCycleDays}d`,  color: '#6F6EE8' },
  ];
  return (
    <div className="grid grid-cols-5 gap-3">
      {cards.map((c) => (
        <div key={c.label} className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-400 mb-1">{c.label}</p>
          <p className="text-2xl font-bold" style={{ color: c.color }}>{c.value}</p>
        </div>
      ))}
    </div>
  );
}
