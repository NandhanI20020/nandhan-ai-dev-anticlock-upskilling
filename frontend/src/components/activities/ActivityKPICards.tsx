interface Props {
  kpis: { completionRate: number; urgentCount: number; avgResponseTimeHours: number } | undefined;
}

export default function ActivityKPICards({ kpis }: Props) {
  if (!kpis) return null;
  const cards = [
    { label: 'Completion Rate', value: `${kpis.completionRate}%`, color: '#0A9E5F' },
    { label: 'Avg Response Time', value: `${kpis.avgResponseTimeHours}h`, color: '#6F6EE8' },
    { label: 'Urgent / Overdue', value: String(kpis.urgentCount), color: kpis.urgentCount > 0 ? '#E15A51' : '#6B7280' },
  ];
  return (
    <div className="grid grid-cols-3 gap-3">
      {cards.map((c) => (
        <div key={c.label} className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-400 mb-1">{c.label}</p>
          <p className="text-2xl font-bold" style={{ color: c.color }}>{c.value}</p>
        </div>
      ))}
    </div>
  );
}
