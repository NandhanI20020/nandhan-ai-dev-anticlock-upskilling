import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { StageDistribution } from '../../../../shared/types/insights';

const COLORS = ['#6F6EE8', '#818CF8', '#A5B4FC', '#C7D2FE', '#E0E7FF'];

interface Props { data: StageDistribution[] }

export default function DealsByStageChart({ data }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Deals by Stage</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} layout="vertical" margin={{ left: 0, right: 16, top: 0, bottom: 0 }}>
          <XAxis type="number" tick={{ fontSize: 11 }} />
          <YAxis type="category" dataKey="stageName" tick={{ fontSize: 11 }} width={90} />
          <Tooltip
            formatter={(val: number) => [`${val} deals`, 'Count']}
            contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
          />
          <Bar dataKey="dealCount" radius={[0, 4, 4, 0]}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
