interface Tab {
  key: string;
  label: string;
}

const TABS: Tab[] = [
  { key: 'all',   label: 'All' },
  { key: 'open',  label: 'Open' },
  { key: 'won',   label: 'Won' },
  { key: 'lost',  label: 'Lost' },
  { key: 'my',    label: 'My Deals' },
];

interface Props {
  activeTab: string;
  total: number;
  onTabChange: (key: string) => void;
}

export default function QuickFilterTabs({ activeTab, total, onTabChange }: Props) {
  return (
    <div className="flex items-center gap-0 border-b border-gray-200">
      {TABS.map((tab) => {
        const isActive = tab.key === activeTab;
        return (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors cursor-pointer whitespace-nowrap
              ${isActive
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'}`}
          >
            {tab.label}
            {isActive && (
              <span className="ml-1.5 text-xs font-semibold px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-600">
                {total}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
