const TABS = [
  { key: 'overdue',     label: 'Overdue' },
  { key: 'today',       label: 'Today' },
  { key: 'tomorrow',    label: 'Tomorrow' },
  { key: 'this_week',   label: 'This Week' },
  { key: 'upcoming',    label: 'Upcoming' },
  { key: 'done',        label: 'Done' },
];

interface Props {
  activeTab: string;
  tabCounts: Record<string, number>;
  onTabChange: (t: string) => void;
}

export default function ActivityTimeTabs({ activeTab, tabCounts, onTabChange }: Props) {
  return (
    <div className="flex items-center gap-0 border-b border-gray-200">
      {TABS.map((t) => {
        const count = tabCounts[t.key] ?? 0;
        const isActive = t.key === activeTab;
        return (
          <button key={t.key} onClick={() => onTabChange(t.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors cursor-pointer whitespace-nowrap
              ${isActive ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'}`}
          >
            {t.label}
            {count > 0 && (
              <span className={`ml-1.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${isActive ? 'bg-indigo-100 text-indigo-700' : (t.key === 'overdue' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600')}`}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
