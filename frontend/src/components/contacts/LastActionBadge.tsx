import { relativeTime } from '../../utils/dateUtils';

interface Props {
  status: 'active' | 'overdue' | 'new' | null;
  date: string | null;
}

const STYLE: Record<string, { bg: string; text: string; label: string }> = {
  active:  { bg: 'bg-green-50',  text: 'text-green-700',  label: 'Active' },
  overdue: { bg: 'bg-orange-50', text: 'text-orange-600', label: 'Overdue' },
  new:     { bg: 'bg-gray-100',  text: 'text-gray-500',   label: 'New contact' },
};

export default function LastActionBadge({ status, date }: Props) {
  if (!status) return null;
  const s = STYLE[status];
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full ${s.bg} ${s.text}`}>
      {s.label}{date && status !== 'new' ? ` · ${relativeTime(date)}` : ''}
    </span>
  );
}
