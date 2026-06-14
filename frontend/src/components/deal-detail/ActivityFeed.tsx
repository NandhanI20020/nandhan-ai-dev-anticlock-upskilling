import type { FeedItem } from '../../../../shared/types/deal';
import ActivityFeedItem from './ActivityFeedItem';

interface Props {
  items: FeedItem[];
  dealId: string;
  isLoading?: boolean;
}

function dateDividerLabel(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();
  if (sameDay(d, today)) return 'Today';
  if (sameDay(d, yesterday)) return 'Yesterday';
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: d.getFullYear() !== today.getFullYear() ? 'numeric' : undefined });
}

function groupByDate(items: FeedItem[]): { label: string; items: FeedItem[] }[] {
  const groups: Map<string, FeedItem[]> = new Map();
  for (const item of items) {
    const label = dateDividerLabel(item.createdAt);
    if (!groups.has(label)) groups.set(label, []);
    groups.get(label)!.push(item);
  }
  return Array.from(groups.entries()).map(([label, items]) => ({ label, items }));
}

export default function ActivityFeed({ items, dealId, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-5 h-5 border-2 border-gray-300 border-t-[#6F6EE8] rounded-full animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <p className="text-sm text-gray-400 py-6 text-center">
        No activity yet — log a call or add a note to get started.
      </p>
    );
  }

  const groups = groupByDate(items);

  return (
    <div className="divide-y divide-gray-100">
      {groups.map(({ label, items: groupItems }) => (
        <div key={label}>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider py-2 sticky top-0 bg-white">{label}</p>
          {groupItems.map((item) => (
            <ActivityFeedItem key={item.id} item={item} dealId={dealId} />
          ))}
        </div>
      ))}
    </div>
  );
}
