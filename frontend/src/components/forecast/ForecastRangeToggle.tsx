import type { ForecastRange } from '../../../../shared/types/forecast';

const RANGES: { key: ForecastRange; label: string }[] = [
  { key: 'this_quarter', label: 'This Quarter' },
  { key: 'next_quarter', label: 'Next Quarter' },
  { key: 'this_year',   label: 'This Year' },
];

interface Props { range: ForecastRange; onChange: (r: ForecastRange) => void; }

export default function ForecastRangeToggle({ range, onChange }: Props) {
  return (
    <div className="flex rounded-lg border border-gray-200 overflow-hidden bg-white w-fit">
      {RANGES.map((r) => (
        <button key={r.key} onClick={() => onChange(r.key)}
          className={`px-4 py-1.5 text-sm font-medium cursor-pointer border-r border-gray-200 last:border-0 transition-colors
            ${range === r.key ? 'text-white' : 'text-gray-600 hover:bg-gray-50'}`}
          style={range === r.key ? { backgroundColor: '#6F6EE8' } : {}}
        >{r.label}</button>
      ))}
    </div>
  );
}
