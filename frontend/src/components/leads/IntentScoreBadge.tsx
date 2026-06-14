import type { IntentScore } from '../../../../shared/types/lead';

const CONFIG: Record<IntentScore, { label: string; bg: string; text: string }> = {
  high:   { label: 'High',   bg: 'bg-green-50',  text: 'text-green-700' },
  medium: { label: 'Medium', bg: 'bg-amber-50',  text: 'text-amber-700' },
  low:    { label: 'Low',    bg: 'bg-gray-50',   text: 'text-gray-500'  },
};

export default function IntentScoreBadge({ score }: { score: IntentScore }) {
  const { label, bg, text } = CONFIG[score];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${bg} ${text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${score === 'high' ? 'bg-green-500' : score === 'medium' ? 'bg-amber-500' : 'bg-gray-400'}`} />
      {label}
    </span>
  );
}
