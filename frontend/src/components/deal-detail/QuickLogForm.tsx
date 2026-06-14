import { useState } from 'react';
import type { ActivityType } from '../../../../shared/types/activity';

interface Props {
  activityType: ActivityType;
  onSave: (data: { type: ActivityType; subject: string; dueDate?: string; dueTime?: string; note?: string }) => void;
  onCancel: () => void;
  isPending?: boolean;
}

const LABELS: Record<ActivityType, string> = {
  call: 'Call', meeting: 'Meeting', task: 'Task', email: 'Email', deadline: 'Deadline',
};

export default function QuickLogForm({ activityType, onSave, onCancel, isPending }: Props) {
  const [subject, setSubject] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [note, setNote] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!subject.trim()) return;
    onSave({ type: activityType, subject: subject.trim(), dueDate: dueDate || undefined, dueTime: dueTime || undefined, note: note || undefined });
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 border border-gray-200 rounded-lg p-3 mt-2">
      <p className="text-xs font-semibold text-gray-500 mb-2">Log {LABELS[activityType]}</p>
      <div className="flex flex-col gap-2">
        <input
          autoFocus
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder={`${LABELS[activityType]} subject *`}
          required
          className="w-full border border-gray-200 rounded-md px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#6F6EE8]/30 bg-white"
        />
        <div className="flex gap-2">
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="flex-1 border border-gray-200 rounded-md px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#6F6EE8]/30 bg-white"
          />
          <input
            type="time"
            value={dueTime}
            onChange={(e) => setDueTime(e.target.value)}
            className="flex-1 border border-gray-200 rounded-md px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#6F6EE8]/30 bg-white"
          />
        </div>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Note (optional)"
          rows={2}
          className="w-full border border-gray-200 rounded-md px-2.5 py-1.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#6F6EE8]/30 bg-white"
        />
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="text-xs px-3 py-1.5 border border-gray-200 rounded-md text-gray-500 hover:bg-gray-100 cursor-pointer">Cancel</button>
          <button type="submit" disabled={isPending} className="text-xs px-3 py-1.5 text-white rounded-md cursor-pointer disabled:opacity-50" style={{ backgroundColor: '#0A9E5F' }}>
            {isPending ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </form>
  );
}
