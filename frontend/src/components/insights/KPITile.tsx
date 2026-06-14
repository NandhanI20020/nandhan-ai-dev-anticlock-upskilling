import { TrendingUp, TrendingDown } from 'lucide-react';

interface Props {
  label: string;
  value: string;
  trend?: number;
  color?: string;
}

export default function KPITile({ label, value, trend, color = '#6F6EE8' }: Props) {
  const positive = trend !== undefined && trend >= 0;
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <p className="text-xs text-gray-400 font-medium mb-1">{label}</p>
      <p className="text-2xl font-bold mb-2" style={{ color }}>{value}</p>
      {trend !== undefined && (
        <div className={`flex items-center gap-1 text-xs font-medium ${positive ? 'text-green-600' : 'text-red-500'}`}>
          {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {positive ? '+' : ''}{trend}% vs prior period
        </div>
      )}
    </div>
  );
}
