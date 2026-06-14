import type { PersonDetail } from '../../../../shared/types/person';
import ActiveDealsSection from './ActiveDealsSection';

interface Props { person: PersonDetail; }

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start py-2 border-b border-gray-100 last:border-0">
      <span className="text-xs text-gray-400 w-24 shrink-0 pt-0.5">{label}</span>
      <span className="text-sm text-gray-800 flex-1 min-w-0">{children}</span>
    </div>
  );
}

export default function PersonContactPanel({ person }: Props) {
  return (
    <aside className="w-full flex flex-col gap-0 bg-white rounded-xl border border-gray-200 p-4 h-fit">
      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Contact Info</p>
      <Field label="Email"><a href={`mailto:${person.email}`} className="text-indigo-600 hover:underline">{person.email}</a></Field>
      <Field label="Phone"><a href={`tel:${person.phone}`} className="text-indigo-600 hover:underline">{person.phone}</a></Field>
      <Field label="Job Title">{person.jobTitle || <span className="text-gray-300">—</span>}</Field>
      <Field label="Organization">{person.orgName || <span className="text-gray-300">—</span>}</Field>
      <Field label="Owner">{person.ownerName}</Field>
      <Field label="Created">{new Date(person.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</Field>
      <ActiveDealsSection deals={person.activeDeals} />
    </aside>
  );
}
