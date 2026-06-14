import type { Activity } from '../../../../shared/types/activity';
import ActivityRow from './ActivityRow';

type EnrichedActivity = Activity & { dealTitle: string | null; personName: string | null; orgName: string | null; ownerName: string; tab: string };

const EMPTY_MSGS: Record<string, string> = {
  overdue: 'No overdue activities 🎉',
  today:   'Nothing due today',
  tomorrow: 'Nothing due tomorrow',
  this_week: 'Nothing due this week',
  upcoming: 'No upcoming activities',
  done:    'No completed activities',
};

interface Props { activities: EnrichedActivity[]; activeTab: string; isLoading: boolean; }

export default function ActivityList({ activities, activeTab, isLoading }: Props) {
  if (isLoading) return <div className="p-8 text-center text-sm text-gray-400 animate-pulse">Loading activities…</div>;
  if (activities.length === 0) {
    return <div className="p-8 text-center text-sm text-gray-400">{EMPTY_MSGS[activeTab] ?? 'No activities.'}</div>;
  }
  return (
    <div className="divide-y-0">
      {activities.map((a) => <ActivityRow key={a.id} activity={a} />)}
    </div>
  );
}
