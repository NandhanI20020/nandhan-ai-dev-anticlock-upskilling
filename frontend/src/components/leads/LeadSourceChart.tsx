import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { SourceDistribution } from '../../../../shared/types/lead';

const COLORS = ['#6F6EE8', '#0A9E5F', '#FB923C', '#3B82F6', '#E15A51', '#8B5CF6'];

interface Props { data: SourceDistribution[] }

export default function LeadSourceChart({ data }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Leads by Source</h3>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie data={data} dataKey="count" nameKey="source" cx="50%" cy="50%" outerRadius={75} paddingAngle={2}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip formatter={(v: number, name: string) => [`${v} leads`, name]} contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }} />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
