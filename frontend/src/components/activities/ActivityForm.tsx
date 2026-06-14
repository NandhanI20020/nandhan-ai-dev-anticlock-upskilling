import { useState } from 'react';
import { X } from 'lucide-react';
import type { Activity, ActivityType } from '../../../../shared/types/activity';
import { useCreateActivity, useUpdateActivity } from '../../api/useActivities';

const TYPES: ActivityType[] = ['call', 'meeting', 'task', 'email', 'deadline'];

interface Props { initial?: Partial<Activity>; onClose: () => void; }

export default function ActivityForm({ initial, onClose }: Props) {
  const [type, setType] = useState<ActivityType>((initial?.type ?? 'call') as ActivityType);
  const [subject, setSubject] = useState(initial?.subject ?? '');
  const [dueDate, setDueDate] = useState(initial?.dueDate ?? '');
  const [dueTime, setDueTime] = useState(initial?.dueTime ?? '');
  const [note, setNote] = useState(initial?.note ?? '');
  const create = useCreateActivity();
  const update = useUpdateActivity();

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!subject) return;
    const data: Partial<Activity> = { type, subject, dueDate: dueDate || null, dueTime: dueTime || null, note };
    if (initial?.id) {
      update.mutate({ id: initial.id, data }, { onSuccess: onClose });
    } else {
      create.mutate(data, { onSuccess: onClose });
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold">{initial?.id ? 'Edit Activity' : 'New Activity'}</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100 cursor-pointer"><X size={16} /></button>
        </div>
        <form onSubmit={handleSave} className="flex flex-col gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
            <select value={type} onChange={(e) => setType(e.target.value as ActivityType)} className="w-full text-sm border border-gray-300 rounded px-2.5 py-1.5 focus:outline-none focus:border-indigo-400">
              {TYPES.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
            </select>
          </div>
          <div><label className="block text-xs font-medium text-gray-600 mb-1">Subject *</label><input required value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full text-sm border border-gray-300 rounded px-2.5 py-1.5 focus:outline-none focus:border-indigo-400" /></div>
          <div className="grid grid-cols-2 gap-2">
            <div><label className="block text-xs font-medium text-gray-600 mb-1">Due Date</label><input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full text-sm border border-gray-300 rounded px-2.5 py-1.5 focus:outline-none focus:border-indigo-400" /></div>
            <div><label className="block text-xs font-medium text-gray-600 mb-1">Due Time</label><input type="time" value={dueTime} onChange={(e) => setDueTime(e.target.value)} className="w-full text-sm border border-gray-300 rounded px-2.5 py-1.5 focus:outline-none focus:border-indigo-400" /></div>
          </div>
          <div><label className="block text-xs font-medium text-gray-600 mb-1">Note</label><textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} className="w-full text-sm border border-gray-300 rounded px-2.5 py-1.5 focus:outline-none focus:border-indigo-400 resize-none" /></div>
          <div className="flex gap-2 mt-2">
            <button type="submit" disabled={create.isPending || update.isPending} className="flex-1 py-2 text-sm text-white rounded-md font-medium cursor-pointer disabled:opacity-50" style={{ backgroundColor: '#6F6EE8' }}>Save</button>
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
