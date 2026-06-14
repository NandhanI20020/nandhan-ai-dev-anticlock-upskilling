import type { DatePreset } from '../../../../shared/types/insights';

const PRESETS: { key: DatePreset; label: string }[] = [
  { key: 'this_month',   label: 'This Month' },
  { key: 'last_month',   label: 'Last Month' },
  { key: 'this_quarter', label: 'This Quarter' },
  { key: 'last_quarter', label: 'Last Quarter' },
  { key: 'this_year',    label: 'This Year' },
];

interface Props {
  preset: DatePreset;
  customFrom: string;
  customTo: string;
  onPreset: (p: DatePreset) => void;
  onCustomFrom: (v: string) => void;
  onCustomTo: (v: string) => void;
}

export default function DateRangeSelector({ preset, customFrom, customTo, onPreset, onCustomFrom, onCustomTo }: Props) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {PRESETS.map((p) => (
        <button key={p.key} onClick={() => onPreset(p.key)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border cursor-pointer transition-colors
            ${preset === p.key ? 'text-white border-transparent' : 'text-gray-600 bg-white border-gray-200 hover:bg-gray-50'}`}
          style={preset === p.key ? { backgroundColor: '#6F6EE8', borderColor: '#6F6EE8' } : {}}
        >{p.label}</button>
      ))}
      <button onClick={() => onPreset('custom')}
        className={`px-3 py-1.5 rounded-full text-xs font-medium border cursor-pointer transition-colors
          ${preset === 'custom' ? 'text-white border-transparent' : 'text-gray-600 bg-white border-gray-200 hover:bg-gray-50'}`}
        style={preset === 'custom' ? { backgroundColor: '#6F6EE8', borderColor: '#6F6EE8' } : {}}
      >Custom</button>
      {preset === 'custom' && (
        <div className="flex items-center gap-1">
          <input type="date" value={customFrom} onChange={(e) => onCustomFrom(e.target.value)} className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-indigo-400" />
          <span className="text-xs text-gray-400">to</span>
          <input type="date" value={customTo} onChange={(e) => onCustomTo(e.target.value)} className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-indigo-400" />
        </div>
      )}
    </div>
  );
}
