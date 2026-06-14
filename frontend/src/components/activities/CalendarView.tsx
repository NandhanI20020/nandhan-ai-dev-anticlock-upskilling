import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Activity, ActivityType } from '../../../../shared/types/activity';

const TYPE_COLORS: Record<ActivityType, string> = {
  call: '#6F6EE8', meeting: '#0A9E5F', task: '#FB923C', email: '#3B82F6', deadline: '#E15A51',
};

type EnrichedActivity = Activity & { dealTitle: string | null; personName: string | null; tab: string };

interface Props { activities: EnrichedActivity[]; }

export default function CalendarView({ activities }: Props) {
  const [current, setCurrent] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const y = current.getFullYear();
  const m = current.getMonth();
  const firstDay = new Date(y, m, 1).getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const monthLabel = current.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  function dateStr(day: number): string {
    return `${y}-${String(m + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  const dayActivities = selectedDay ? activities.filter((a) => a.dueDate === selectedDay) : [];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <button onClick={() => setCurrent(new Date(y, m - 1, 1))} className="p-1.5 rounded hover:bg-gray-100 cursor-pointer"><ChevronLeft size={16} /></button>
        <span className="text-sm font-semibold text-gray-800">{monthLabel}</span>
        <button onClick={() => setCurrent(new Date(y, m + 1, 1))} className="p-1.5 rounded hover:bg-gray-100 cursor-pointer"><ChevronRight size={16} /></button>
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200 rounded-lg overflow-hidden">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d} className="bg-gray-50 text-center text-xs font-semibold text-gray-400 py-2">{d}</div>
        ))}
        {Array.from({ length: firstDay }, (_, i) => <div key={`empty-${i}`} className="bg-white py-8" />)}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const ds = dateStr(day);
          const dayActs = activities.filter((a) => a.dueDate === ds);
          const isSelected = ds === selectedDay;
          const isToday = ds === new Date().toISOString().slice(0, 10);
          return (
            <div key={day} onClick={() => setSelectedDay(isSelected ? null : ds)} className={`bg-white min-h-[60px] p-1 cursor-pointer hover:bg-indigo-50 transition-colors ${isSelected ? 'bg-indigo-50 ring-2 ring-inset ring-indigo-300' : ''}`}>
              <span className={`text-xs font-medium inline-flex w-5 h-5 items-center justify-center rounded-full ${isToday ? 'bg-indigo-600 text-white' : 'text-gray-700'}`}>{day}</span>
              <div className="flex flex-wrap gap-0.5 mt-0.5">
                {dayActs.slice(0, 3).map((a) => <span key={a.id} className="w-2 h-2 rounded-full" style={{ backgroundColor: TYPE_COLORS[a.type] ?? '#6B7280' }} title={a.subject} />)}
              </div>
            </div>
          );
        })}
      </div>

      {selectedDay && (
        <div>
          <p className="text-xs font-semibold text-gray-500 mb-2">{new Date(selectedDay + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          {dayActivities.length === 0 ? (
            <p className="text-sm text-gray-400">No activities on this day.</p>
          ) : (
            dayActivities.map((a) => (
              <div key={a.id} className="flex items-center gap-2 py-1.5 border-b border-gray-100 last:border-0">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: TYPE_COLORS[a.type] ?? '#6B7280' }} />
                <span className="text-sm text-gray-800">{a.subject}</span>
                {a.dealTitle && <span className="text-xs text-gray-400 ml-auto">{a.dealTitle}</span>}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
