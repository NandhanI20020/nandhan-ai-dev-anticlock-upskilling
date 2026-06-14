import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { WinReasonEntry } from '../../../../shared/types/archive';

const COLORS = ['#0A9E5F', '#34D399', '#6EE7B7', '#A7F3D0', '#D1FAE5'];

interface Props { data: WinReasonEntry[] }

export default function WinReasonChart({ data }: Props) {
  if (data.length === 0) return null;
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Wins by Source</h3>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} layout="vertical" margin={{ left: 0, right: 16, top: 0, bottom: 0 }}>
          <XAxis type="number" tick={{ fontSize: 10 }} allowDecimals={false} />
          <YAxis type="category" dataKey="source" tick={{ fontSize: 10 }} width={80} />
          <Tooltip formatter={(v: number) => [`${v} deals`]} contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }} />
          <Bar dataKey="count" radius={[0, 4, 4, 0]}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
