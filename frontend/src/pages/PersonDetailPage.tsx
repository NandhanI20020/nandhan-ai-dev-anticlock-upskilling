import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { usePerson } from '../api/usePersonDetail';
import PersonHeader from '../components/person-detail/PersonHeader';
import PersonContactPanel from '../components/person-detail/PersonContactPanel';
import PersonActivityFeed from '../components/person-detail/PersonActivityFeed';
import LabelPicker from '../components/person-detail/LabelPicker';

export default function PersonDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: person, isLoading } = usePerson(id!);

  if (isLoading) return <div className="flex-1 p-8 text-sm text-gray-400 animate-pulse">Loading contact…</div>;
  if (!person) return <div className="flex-1 p-8 text-sm text-gray-500">Contact not found.</div>;

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-gray-50">
      <div className="px-6 pt-4 pb-0">
        <Link to="/contacts/people" className="flex items-center gap-1 text-xs text-gray-400 hover:text-indigo-600 mb-3">
          <ArrowLeft size={12} /> Back to People
        </Link>
        <PersonHeader person={person} />
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-4 flex gap-5">
          <div className="w-72 shrink-0 flex flex-col gap-4">
            <PersonContactPanel person={person} />
            <LabelPicker personId={person.id} labelIds={person.labelIds ?? []} />
          </div>
          <div className="flex-1 min-w-0">
            <PersonActivityFeed personId={person.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
