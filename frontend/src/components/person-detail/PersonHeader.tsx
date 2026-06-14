import { useState } from 'react';
import { ArrowLeft, Edit2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { PersonDetail } from '../../../../shared/types/person';
import PersonEditModal from './PersonEditModal';

interface Props { person: PersonDetail; }

export default function PersonHeader({ person }: Props) {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const initials = person.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 shrink-0">
      <button onClick={() => navigate('/contacts/people')} className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 mb-3 cursor-pointer">
        <ArrowLeft size={12} /> Back to People
      </button>
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold shrink-0" style={{ backgroundColor: person.ownerColor }}>
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-semibold text-gray-900">{person.name}</h1>
          <p className="text-sm text-gray-500">{[person.jobTitle, person.orgName].filter(Boolean).join(' · ')}</p>
          {person.labelIds.length > 0 && (
            <div className="flex gap-1 mt-1 flex-wrap">
              {person.labelIds.map((l) => <span key={l} className="text-xs px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200">{l}</span>)}
            </div>
          )}
        </div>
        <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 cursor-pointer">
          <Edit2 size={13} /> Edit
        </button>
      </div>
      {editing && <PersonEditModal person={person} onClose={() => setEditing(false)} />}
    </div>
  );
}
