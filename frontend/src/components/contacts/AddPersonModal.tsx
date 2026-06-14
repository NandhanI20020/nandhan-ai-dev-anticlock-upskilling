import { useState } from 'react';
import { X } from 'lucide-react';
import { useCreatePerson } from '../../api/usePeople';

interface Props { onClose: () => void; }

export default function AddPersonModal({ onClose }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [error, setError] = useState('');
  const create = useCreatePerson();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email) return;
    create.mutate({ name, email, phone, jobTitle }, {
      onSuccess: () => onClose(),
      onError: (err: Error & { existingId?: string }) => {
        setError(err.message === 'duplicate' ? 'A contact with this email already exists.' : 'Failed to create contact.');
      },
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-800">Add Person</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100 cursor-pointer"><X size={16} /></button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {error && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded">{error}</p>}
          <div><label className="block text-xs font-medium text-gray-600 mb-1">Full Name *</label><input required value={name} onChange={(e) => setName(e.target.value)} className="w-full text-sm border border-gray-300 rounded px-2.5 py-1.5 focus:outline-none focus:border-indigo-400" /></div>
          <div><label className="block text-xs font-medium text-gray-600 mb-1">Email *</label><input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full text-sm border border-gray-300 rounded px-2.5 py-1.5 focus:outline-none focus:border-indigo-400" /></div>
          <div><label className="block text-xs font-medium text-gray-600 mb-1">Phone</label><input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full text-sm border border-gray-300 rounded px-2.5 py-1.5 focus:outline-none focus:border-indigo-400" /></div>
          <div><label className="block text-xs font-medium text-gray-600 mb-1">Job Title</label><input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} className="w-full text-sm border border-gray-300 rounded px-2.5 py-1.5 focus:outline-none focus:border-indigo-400" /></div>
          <div className="flex gap-2 mt-2">
            <button type="submit" disabled={create.isPending} className="flex-1 py-2 text-sm text-white rounded-md font-medium cursor-pointer disabled:opacity-50" style={{ backgroundColor: '#6F6EE8' }}>
              {create.isPending ? 'Saving…' : 'Add Person'}
            </button>
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
