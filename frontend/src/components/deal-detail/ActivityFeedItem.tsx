import { useState } from 'react';
import { Phone, Users, CheckSquare, Mail, Clock, FileText, GitBranch, Trophy, XCircle, Plus, Pencil, Trash2 } from 'lucide-react';
import type { FeedItem } from '../../../../shared/types/deal';
import { relativeTime } from '../../utils/dateUtils';
import { useUpdateNote, useDeleteNote } from '../../api/useDealDetail';

const ACTIVITY_ICONS = {
  call:     Phone,
  meeting:  Users,
  task:     CheckSquare,
  email:    Mail,
  deadline: Clock,
} as const;

interface Props {
  item: FeedItem;
  dealId: string;
}

export default function ActivityFeedItem({ item, dealId }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const updateNote = useUpdateNote(dealId);
  const deleteNote = useDeleteNote(dealId);

  if (item.type === 'activity') {
    const Icon = ACTIVITY_ICONS[item.activityType] ?? CheckSquare;
    const isOverdue = item.dueDate && !item.done && new Date(item.dueDate) < new Date();
    return (
      <div className="flex gap-3 py-2">
        <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${item.done ? 'bg-green-100' : isOverdue ? 'bg-red-50' : 'bg-purple-50'}`}>
          <Icon size={13} className={item.done ? 'text-green-600' : isOverdue ? 'text-red-500' : 'text-purple-600'} />
        </div>
        <div className="min-w-0 flex-1">
          <p className={`text-sm font-medium ${item.done ? 'line-through text-gray-400' : isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
            {item.subject}
          </p>
          {item.note && <p className="text-xs text-gray-500 mt-0.5">{item.note}</p>}
          {item.outcome && <p className="text-xs text-gray-500 mt-0.5 italic">Outcome: {item.outcome}</p>}
          <p className="text-[11px] text-gray-400 mt-0.5">
            {item.ownerName} · {relativeTime(item.createdAt)}
            {item.dueDate && !item.done && (
              <span className={isOverdue ? ' · overdue' : ''}> · due {item.dueDate}</span>
            )}
          </p>
        </div>
      </div>
    );
  }

  if (item.type === 'note') {
    if (editing) {
      return (
        <div className="flex gap-3 py-2">
          <div className="w-7 h-7 rounded-full bg-amber-50 flex items-center justify-center shrink-0 mt-0.5">
            <FileText size={13} className="text-amber-600" />
          </div>
          <div className="flex-1">
            <textarea
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={3}
              className="w-full border border-[#6F6EE8] rounded-md px-2 py-1.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#6F6EE8]/30"
            />
            <div className="flex gap-2 mt-1">
              <button
                onClick={() => { updateNote.mutate({ noteId: item.id, content: draft }, { onSuccess: () => setEditing(false) }); }}
                className="text-xs px-2 py-1 text-white rounded cursor-pointer"
                style={{ backgroundColor: '#6F6EE8' }}
              >
                Save
              </button>
              <button onClick={() => setEditing(false)} className="text-xs px-2 py-1 text-gray-500 border border-gray-200 rounded cursor-pointer">Cancel</button>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="flex gap-3 py-2 group">
        <div className="w-7 h-7 rounded-full bg-amber-50 flex items-center justify-center shrink-0 mt-0.5">
          <FileText size={13} className="text-amber-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-800 whitespace-pre-wrap">{item.content}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">{item.ownerName} · {relativeTime(item.createdAt)}</p>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button onClick={() => { setDraft(item.content); setEditing(true); }} className="p-1 text-gray-400 hover:text-gray-600 cursor-pointer"><Pencil size={12} /></button>
          <button onClick={() => deleteNote.mutate(item.id)} className="p-1 text-gray-400 hover:text-red-500 cursor-pointer"><Trash2 size={12} /></button>
        </div>
      </div>
    );
  }

  // system
  const icons: Record<string, React.ReactNode> = {
    stage_change: <GitBranch size={13} className="text-blue-500" />,
    deal_created: <Plus size={13} className="text-gray-500" />,
    deal_won:     <Trophy size={13} className="text-green-600" />,
    deal_lost:    <XCircle size={13} className="text-red-500" />,
    deal_reopened:<GitBranch size={13} className="text-purple-500" />,
  };

  return (
    <div className="flex gap-3 py-2">
      <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
        {icons[item.kind] ?? <GitBranch size={13} className="text-gray-400" />}
      </div>
      <div>
        <p className="text-sm text-gray-600">{item.message}</p>
        <p className="text-[11px] text-gray-400 mt-0.5">{relativeTime(item.createdAt)}</p>
      </div>
    </div>
  );
}
