import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { WinLossRatio } from '../../../../shared/types/insights';

interface Props { data: WinLossRatio }

export default function WinLossDonut({ data }: Props) {
  const chartData = [
    { name: 'Won', value: data.won },
    { name: 'Lost', value: data.lost },
  ];
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-1">Win / Loss</h3>
      <p className="text-xs text-gray-400 mb-3">Win rate: <span className="font-semibold text-green-600">{data.winRate}%</span></p>
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie data={chartData} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3}>
            <Cell fill="#0A9E5F" />
            <Cell fill="#E15A51" />
          </Pie>
          <Tooltip formatter={(v: number) => [`${v} deals`]} contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }} />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
