import { useState } from 'react';
import { X } from 'lucide-react';
import { useCreateOrg } from '../../api/useOrganizations';

interface Props { onClose: () => void; }

export default function AddOrgModal({ onClose }: Props) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [warning, setWarning] = useState('');
  const create = useCreateOrg();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name) return;
    create.mutate({ name, address, phone, website }, {
      onSuccess: (data) => { if (data.warning) setWarning(data.warning); else onClose(); },
      onError: () => setWarning('Failed to create organization.'),
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold">Add Organization</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100 cursor-pointer"><X size={16} /></button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {warning && <div className="text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded flex items-center justify-between">{warning}<button type="button" onClick={onClose} className="underline cursor-pointer ml-2">Continue anyway</button></div>}
          <div><label className="block text-xs font-medium text-gray-600 mb-1">Name *</label><input required value={name} onChange={(e) => setName(e.target.value)} className="w-full text-sm border border-gray-300 rounded px-2.5 py-1.5 focus:outline-none focus:border-indigo-400" /></div>
          <div><label className="block text-xs font-medium text-gray-600 mb-1">Address</label><input value={address} onChange={(e) => setAddress(e.target.value)} className="w-full text-sm border border-gray-300 rounded px-2.5 py-1.5 focus:outline-none focus:border-indigo-400" /></div>
          <div><label className="block text-xs font-medium text-gray-600 mb-1">Phone</label><input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full text-sm border border-gray-300 rounded px-2.5 py-1.5 focus:outline-none focus:border-indigo-400" /></div>
          <div><label className="block text-xs font-medium text-gray-600 mb-1">Website</label><input value={website} onChange={(e) => setWebsite(e.target.value)} className="w-full text-sm border border-gray-300 rounded px-2.5 py-1.5 focus:outline-none focus:border-indigo-400" /></div>
          <div className="flex gap-2 mt-2">
            <button type="submit" disabled={create.isPending} className="flex-1 py-2 text-sm text-white rounded-md font-medium cursor-pointer disabled:opacity-50" style={{ backgroundColor: '#6F6EE8' }}>{create.isPending ? 'Saving…' : 'Add Organization'}</button>
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
