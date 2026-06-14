import { usePersonFeed } from '../../api/usePersonDetail';
import ActivityFeed from '../deal-detail/ActivityFeed';

interface Props { personId: string; }

export default function PersonActivityFeed({ personId }: Props) {
  const { data: items = [], isLoading } = usePersonFeed(personId);
  return <ActivityFeed items={items} dealId="" isLoading={isLoading} />;
}
