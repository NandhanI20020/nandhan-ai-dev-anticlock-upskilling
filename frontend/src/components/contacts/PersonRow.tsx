import { Link } from 'react-router-dom';
import type { PersonListItem } from '../../../../shared/types/person';
import LastActionBadge from './LastActionBadge';

interface Props {
  person: PersonListItem;
  selected: boolean;
  onToggle: (id: string) => void;
}

export default function PersonRow({ person, selected, onToggle }: Props) {
  const initials = person.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
  return (
    <tr className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${selected ? 'bg-indigo-50' : ''}`}>
      <td className="pl-4 pr-2 py-2.5 w-8">
        <input type="checkbox" className="rounded border-gray-300 text-indigo-600 cursor-pointer" checked={selected} onChange={() => onToggle(person.id)} />
      </td>
      <td className="px-3 py-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ backgroundColor: person.ownerColor }}>
            {initials}
          </div>
          <div>
            <Link to={`/contacts/people/${person.id}`} className="text-sm font-medium text-gray-900 hover:underline block">{person.name}</Link>
            <p className="text-xs text-gray-400">{person.jobTitle}</p>
          </div>
        </div>
      </td>
      <td className="px-3 py-2.5 text-sm text-gray-600">{person.orgName ?? <span className="text-gray-300">—</span>}</td>
      <td className="px-3 py-2.5"><a href={`mailto:${person.email}`} className="text-xs text-indigo-600 hover:underline">{person.email}</a></td>
      <td className="px-3 py-2.5 text-xs text-gray-500">{person.phone}</td>
      <td className="px-3 py-2.5 text-sm text-center">
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold">{person.dealCount}</span>
      </td>
      <td className="px-3 py-2.5"><LastActionBadge status={person.lastActionStatus} date={person.lastActionDate} /></td>
    </tr>
  );
}
