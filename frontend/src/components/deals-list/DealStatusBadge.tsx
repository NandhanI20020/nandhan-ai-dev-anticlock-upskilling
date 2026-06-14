import { daysSince } from '../../utils/dateUtils';

interface Props {
  status: 'open' | 'won' | 'lost';
  rottingDays: number | null;
  updatedAt: string;
}

export default function DealStatusBadge({ status, rottingDays, updatedAt }: Props) {
  if (status === 'won') {
    return (
      <span className="inline-block text-[10px] font-bold px-1.5 py-0.5 rounded bg-green-100 text-green-700">
        WON
      </span>
    );
  }
  if (status === 'lost') {
    return (
      <span className="inline-block text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-700">
        LOST
      </span>
    );
  }
  if (rottingDays !== null && daysSince(updatedAt) > rottingDays) {
    return (
      <span className="text-[10px] font-medium" style={{ color: '#FB923C' }}>
        Rotten ({daysSince(updatedAt)}d)
      </span>
    );
  }
  return null;
}
