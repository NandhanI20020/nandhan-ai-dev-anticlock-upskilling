import { useState } from 'react';
import { Phone, Users, CheckSquare, Mail, Clock, Check, MoreHorizontal, Link as LinkIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Activity, ActivityType } from '../../../../shared/types/activity';
import { useMarkDone, useDeleteActivity } from '../../api/useActivities';
import ActivityForm from './ActivityForm';

const ICONS: Record<ActivityType, React.ComponentType<{ size?: number; className?: string }>> = {
  call: Phone, meeting: Users, task: CheckSquare, email: Mail, deadline: Clock,
};

type EnrichedActivity = Activity & { dealTitle: string | null; personName: string | null; orgName: string | null; ownerName: string; tab: string };

interface Props { activity: EnrichedActivity; }

export default function ActivityRow({ activity }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const markDone = useMarkDone();
  const deleteActivity = useDeleteActivity();
  const Icon = ICONS[activity.type] ?? CheckSquare;
  const isOverdue = !activity.doneAt && activity.dueDate && new Date(activity.dueDate) < new Date();

  return (
    <div className={`flex items-start gap-3 py-3 border-b border-gray-100 last:border-0 group ${activity.doneAt ? 'opacity-60' : ''}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isOverdue ? 'bg-red-50' : 'bg-indigo-50'}`}>
        <Icon size={14} className={isOverdue ? 'text-red-500' : 'text-indigo-500'} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${activity.doneAt ? 'line-through text-gray-400' : 'text-gray-900'}`}>{activity.subject}</p>
        <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-400">
          {activity.dueDate && <span className={isOverdue ? 'text-red-500 font-medium' : ''}>{new Date(activity.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>}
          {activity.dealTitle && <Link to={`/deals/${activity.dealId}`} className="flex items-center gap-0.5 hover:text-indigo-600"><LinkIcon size={10} />{activity.dealTitle}</Link>}
          {activity.personName && <span>{activity.personName}</span>}
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        {!activity.doneAt && (
          <button onClick={() => markDone.mutate(activity.id)} title="Mark done" className="opacity-0 group-hover:opacity-100 flex items-center gap-1 px-2 py-1 text-xs border border-green-300 text-green-700 rounded hover:bg-green-50 cursor-pointer transition-opacity">
            <Check size={11} /> Done
          </button>
        )}
        <div className="relative">
          <button onClick={() => setMenuOpen((v) => !v)} className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-gray-100 cursor-pointer transition-opacity">
            <MoreHorizontal size={14} className="text-gray-400" />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute z-20 right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 w-28">
                <button onClick={() => { setEditing(true); setMenuOpen(false); }} className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">Edit</button>
                <button onClick={() => { if (window.confirm('Delete this activity?')) deleteActivity.mutate(activity.id); setMenuOpen(false); }} className="w-full text-left px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 cursor-pointer">Delete</button>
              </div>
            </>
          )}
        </div>
      </div>
      {editing && <ActivityForm initial={activity} onClose={() => setEditing(false)} />}
    </div>
  );
}
