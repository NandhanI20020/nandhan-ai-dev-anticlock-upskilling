import type { LossReasonEntry } from '../../../../shared/types/archive';

interface Props { data: LossReasonEntry[] }

export default function LossInsightsPanel({ data }: Props) {
  if (data.length === 0) return null;
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Loss Reasons</h3>
      <div className="flex flex-col gap-2.5">
        {data.map((entry) => (
          <div key={entry.reason}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-700">{entry.reason}</span>
              <span className="text-gray-400">{entry.count} deals · {entry.percent}%</span>
            </div>
            <div className="bg-gray-100 rounded-full h-1.5">
              <div className="h-1.5 rounded-full bg-red-400 transition-all" style={{ width: `${entry.percent}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
