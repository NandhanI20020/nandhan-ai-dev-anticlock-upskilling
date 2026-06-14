import { Link } from 'react-router-dom';
import type { OrgListItem } from '../../../../shared/types/organization';
import AvatarStack from '../shared/AvatarStack';
import DealCountBadges from './DealCountBadges';
import { relativeTime } from '../../utils/dateUtils';

interface Props { org: OrgListItem; }

export default function OrgRow({ org }: Props) {
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3">
        <Link to={`/contacts/organizations/${org.id}`} className="text-sm font-medium text-gray-900 hover:underline">{org.name}</Link>
        {org.address && <p className="text-xs text-gray-400 truncate max-w-[200px]">{org.address}</p>}
      </td>
      <td className="px-3 py-3"><AvatarStack avatars={org.personAvatars} total={org.peopleCount} /></td>
      <td className="px-3 py-3"><DealCountBadges open={org.openDealCount} won={org.wonDealCount} lost={org.lostDealCount} /></td>
      <td className="px-3 py-3">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold" style={{ backgroundColor: org.ownerColor }}>{org.ownerInitials}</div>
          <span className="text-xs text-gray-600">{org.ownerName}</span>
        </div>
      </td>
      <td className="px-3 py-3 text-xs text-gray-400">{org.lastActivityDate ? relativeTime(org.lastActivityDate) : <span className="text-gray-200">—</span>}</td>
    </tr>
  );
}
