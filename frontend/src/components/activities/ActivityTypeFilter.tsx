import { Phone, Users, CheckSquare, Mail, Clock } from 'lucide-react';
import type { ActivityType } from '../../../../shared/types/activity';

const TYPES: { key: ActivityType | null; label: string; Icon?: React.ComponentType<{ size?: number }> }[] = [
  { key: null,       label: 'All' },
  { key: 'call',     label: 'Call',     Icon: Phone },
  { key: 'meeting',  label: 'Meeting',  Icon: Users },
  { key: 'task',     label: 'Task',     Icon: CheckSquare },
  { key: 'email',    label: 'Email',    Icon: Mail },
  { key: 'deadline', label: 'Deadline', Icon: Clock },
];

interface Props { active: ActivityType | null; onChange: (t: ActivityType | null) => void; }

export default function ActivityTypeFilter({ active, onChange }: Props) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {TYPES.map(({ key, label, Icon }) => (
        <button key={String(key)} onClick={() => onChange(key)}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border cursor-pointer transition-colors
            ${active === key ? 'text-white border-transparent' : 'text-gray-600 bg-white border-gray-200 hover:bg-gray-50'}`}
          style={active === key ? { backgroundColor: '#6F6EE8', borderColor: '#6F6EE8' } : {}}
        >
          {Icon && <Icon size={11} />} {label}
        </button>
      ))}
    </div>
  );
}
