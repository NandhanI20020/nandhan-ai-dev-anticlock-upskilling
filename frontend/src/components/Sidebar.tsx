import { NavLink } from 'react-router-dom';
import {
  LayoutGrid,
  List,
  Users,
  Building2,
  Calendar,
  Inbox,
  BarChart2,
  TrendingUp,
  Archive,
  Search,
} from 'lucide-react';
import { useSearchStore } from '../store/searchStore';

const NAV = [
  { to: '/pipeline',              label: 'Pipeline',       Icon: LayoutGrid },
  { to: '/deals',                 label: 'Deals',          Icon: List },
  { to: '/contacts/people',       label: 'People',         Icon: Users },
  { to: '/contacts/organizations',label: 'Organizations',  Icon: Building2 },
  { to: '/activities',            label: 'Activities',     Icon: Calendar },
  { to: '/leads',                 label: 'Leads',          Icon: Inbox },
  { to: '/insights',              label: 'Insights',       Icon: BarChart2 },
  { to: '/forecast',              label: 'Forecast',       Icon: TrendingUp },
  { to: '/archive',               label: 'Archive',        Icon: Archive },
];

export default function Sidebar() {
  const { setOpen } = useSearchStore();
  return (
    <aside className="flex flex-col w-14 min-h-screen shrink-0" style={{ backgroundColor: '#2C2D6F' }}>
      <div className="flex items-center justify-center h-14 border-b border-white/10">
        <div className="w-7 h-7 rounded-md flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: '#6F6EE8' }}>
          S
        </div>
      </div>

      <div className="p-2">
        <button onClick={() => setOpen(true)} title="Search (Ctrl+K)"
          className="flex items-center justify-center w-10 h-10 rounded-lg text-white/50 hover:text-white/80 hover:bg-white/10 transition-colors cursor-pointer w-full">
          <Search size={18} />
        </button>
      </div>

      <nav className="flex flex-col gap-1 p-2 flex-1">
        {NAV.map(({ to, label, Icon }) => (
          <NavLink key={to} to={to} title={label}
            className={({ isActive }) =>
              `flex items-center justify-center w-10 h-10 rounded-lg transition-colors ${isActive ? 'text-white' : 'text-white/50 hover:text-white/80 hover:bg-white/10'}`
            }
            style={({ isActive }) => isActive ? { backgroundColor: '#6F6EE8' } : {}}
          >
            <Icon size={18} />
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
