import { Link } from 'react-router-dom';
import type { OrgDetail } from '../../../../shared/types/organization';
import InlineEdit from '../deal-detail/InlineEdit';
import { useUpdateOrg } from '../../api/useOrganizations';

interface Props { org: OrgDetail; }

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start py-2 border-b border-gray-100 last:border-0">
      <span className="text-xs text-gray-400 w-24 shrink-0 pt-0.5">{label}</span>
      <span className="text-sm text-gray-800 flex-1 min-w-0">{children}</span>
    </div>
  );
}

export default function OrgInfoPanel({ org }: Props) {
  const update = useUpdateOrg(org.id);
  return (
    <aside className="flex flex-col gap-0 bg-white rounded-xl border border-gray-200 p-4 h-fit">
      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Organization Info</p>
      <Field label="Name"><InlineEdit value={org.name} onSave={(v) => update.mutate({ name: v })} /></Field>
      <Field label="Address"><InlineEdit value={org.address} onSave={(v) => update.mutate({ address: v })} placeholder="Add address" /></Field>
      <Field label="Phone"><InlineEdit value={org.phone} onSave={(v) => update.mutate({ phone: v })} placeholder="Add phone" /></Field>
      <Field label="Website"><InlineEdit value={org.website} onSave={(v) => update.mutate({ website: v })} placeholder="Add website" /></Field>
      <Field label="Owner">{org.ownerName}</Field>

      {org.people.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">People ({org.people.length})</p>
          <div className="flex flex-col gap-1.5">
            {org.people.map((p) => (
              <Link key={p.id} to={`/contacts/people/${p.id}`} className="flex items-center gap-2 hover:text-indigo-600">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-bold shrink-0" style={{ backgroundColor: p.color }}>{p.initials}</div>
                <div><p className="text-xs font-medium text-gray-800">{p.name}</p><p className="text-[10px] text-gray-400">{p.jobTitle}</p></div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {org.activeDeals.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Active Deals ({org.activeDeals.length})</p>
          {org.activeDeals.map((d) => (
            <Link key={d.id} to={`/deals/${d.id}`} className="block text-xs text-indigo-600 hover:underline truncate">{d.title}</Link>
          ))}
        </div>
      )}
    </aside>
  );
}
