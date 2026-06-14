import { Phone, Users, CheckSquare, Mail, Clock } from 'lucide-react';
import type { ActivityType } from '../../../../shared/types/activity';
import { useDealDetailStore } from '../../store/dealDetailStore';
import { useLogActivity } from '../../api/useDealDetail';
import QuickLogForm from './QuickLogForm';

const TYPES: { type: ActivityType; Icon: React.ComponentType<{ size?: number; className?: string }> ; label: string }[] = [
  { type: 'call',     Icon: Phone,        label: 'Call'     },
  { type: 'meeting',  Icon: Users,        label: 'Meeting'  },
  { type: 'task',     Icon: CheckSquare,  label: 'Task'     },
  { type: 'email',    Icon: Mail,         label: 'Email'    },
  { type: 'deadline', Icon: Clock,        label: 'Deadline' },
];

interface Props { dealId: string; overrideLogFn?: (data: Record<string, unknown>) => Promise<unknown>; }

export default function QuickLogBar({ dealId, overrideLogFn }: Props) {
  const { activeLogType, setActiveLogType } = useDealDetailStore();
  const logActivity = useLogActivity(dealId);

  return (
    <div className="mb-3">
      <div className="flex gap-1 flex-wrap">
        {TYPES.map(({ type, Icon, label }) => {
          const active = activeLogType === type;
          return (
            <button
              key={type}
              onClick={() => setActiveLogType(active ? null : type)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer border ${
                active ? 'text-white border-transparent' : 'text-gray-600 bg-white border-gray-200 hover:bg-gray-50'
              }`}
              style={active ? { backgroundColor: '#6F6EE8', borderColor: '#6F6EE8' } : {}}
            >
              <Icon size={12} />
              {label}
            </button>
          );
        })}
      </div>

      {activeLogType && (
        <QuickLogForm
          activityType={activeLogType}
          isPending={logActivity.isPending}
          onSave={(data) => { if (overrideLogFn) { overrideLogFn(data as Record<string, unknown>).then(() => setActiveLogType(null)).catch(() => {}); } else { logActivity.mutate(data, { onSuccess: () => setActiveLogType(null) }); } }}
          onCancel={() => setActiveLogType(null)}
        />
      )}
    </div>
  );
}
