import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { ActivityByDay } from '../../../../shared/types/insights';

interface Props { data: ActivityByDay[] }

export default function ActivitiesCompletedChart({ data }: Props) {
  const chartData = data.map((d) => ({
    date: d.date,
    total: d.call + d.meeting + d.task + d.email + d.deadline,
  }));

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Activities Completed (Last 7 Days)</h3>
      <ResponsiveContainer width="100%" height={160}>
        <AreaChart data={chartData} margin={{ left: 0, right: 0, top: 4, bottom: 0 }}>
          <defs>
            <linearGradient id="actGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6F6EE8" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6F6EE8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(d) => new Date(d + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short' })} />
          <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
          <Tooltip
            labelFormatter={(d) => new Date(d + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            formatter={(v: number) => [`${v} activities`]}
            contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
          />
          <Area type="monotone" dataKey="total" stroke="#6F6EE8" strokeWidth={2} fill="url(#actGrad)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
