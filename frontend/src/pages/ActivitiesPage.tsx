import { useState } from 'react';
import { Plus, List, Calendar } from 'lucide-react';
import { useActivitiesStore } from '../store/activitiesStore';
import { useActivities } from '../api/useActivities';
import ActivityTimeTabs from '../components/activities/ActivityTimeTabs';
import ActivityTypeFilter from '../components/activities/ActivityTypeFilter';
import ActivityKPICards from '../components/activities/ActivityKPICards';
import ActivityList from '../components/activities/ActivityList';
import CalendarView from '../components/activities/CalendarView';
import ActivityForm from '../components/activities/ActivityForm';

export default function ActivitiesPage() {
  const { activeTab, typeFilter, view, setActiveTab, setTypeFilter, setView } = useActivitiesStore();
  const [adding, setAdding] = useState(false);
  const { data, isLoading } = useActivities(activeTab, typeFilter);

  const activities = data?.activities ?? [];
  const tabCounts = data?.tabCounts ?? {};
  const kpis = data?.kpis;

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 pt-4 pb-0">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-base font-semibold text-gray-800">Activities</h1>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-gray-200 overflow-hidden bg-white">
              <button onClick={() => setView('list')} className={`p-1.5 cursor-pointer border-r border-gray-200 transition-colors ${view === 'list' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-400 hover:bg-gray-50'}`}><List size={14} /></button>
              <button onClick={() => setView('calendar')} className={`p-1.5 cursor-pointer transition-colors ${view === 'calendar' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-400 hover:bg-gray-50'}`}><Calendar size={14} /></button>
            </div>
            <button onClick={() => setAdding(true)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white rounded-lg font-medium cursor-pointer" style={{ backgroundColor: '#0A9E5F' }}>
              <Plus size={12} /> Add Activity
            </button>
          </div>
        </div>
        <ActivityTimeTabs activeTab={activeTab} tabCounts={tabCounts} onTabChange={setActiveTab} />
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
        <ActivityKPICards kpis={kpis} />
        <ActivityTypeFilter active={typeFilter} onChange={setTypeFilter} />

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          {view === 'list' ? (
            <ActivityList activities={activities as never} activeTab={activeTab} isLoading={isLoading} />
          ) : (
            <CalendarView activities={activities as never} />
          )}
        </div>
      </div>

      {adding && <ActivityForm onClose={() => setAdding(false)} />}
    </div>
  );
}
