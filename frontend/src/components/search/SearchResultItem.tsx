import { Building2, User, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { SearchResult } from '../../../../shared/types/search';
import { useSearchStore } from '../../store/searchStore';

const ICONS = { deal: Briefcase, person: User, org: Building2 } as const;
const ROUTES = { deal: '/deals', person: '/contacts/people', org: '/contacts/organizations' } as const;

interface Props { result: SearchResult }

export default function SearchResultItem({ result }: Props) {
  const { addRecent, setOpen } = useSearchStore();
  const Icon = ICONS[result.type];
  const route = `${ROUTES[result.type]}/${result.id}`;

  function handleClick() {
    addRecent({ id: result.id, type: result.type, title: result.title, subtitle: result.subtitle ?? '', url: result.url ?? route });
    setOpen(false);
  }

  return (
    <Link to={route} onClick={handleClick} className="flex items-center gap-2.5 px-3 py-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
      <div className="w-7 h-7 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
        <Icon size={13} className="text-indigo-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{result.title}</p>
        {result.subtitle && <p className="text-xs text-gray-400 truncate">{result.subtitle}</p>}
      </div>
      <span className="text-[10px] text-gray-300 uppercase tracking-wide">{result.type}</span>
    </Link>
  );
}
