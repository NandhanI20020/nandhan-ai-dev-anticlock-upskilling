import { useState } from 'react';
import { Building } from 'lucide-react';
import { useOrganizations } from '../api/useOrganizations';
import { useContactsStore } from '../store/contactsStore';
import OrgsTable from '../components/organizations/OrgsTable';
import AddOrgModal from '../components/organizations/AddOrgModal';
import PaginationControls from '../components/shared/PaginationControls';

export default function OrganizationsPage() {
  const { sort, sortDir, page, perPage, setSort, setPage } = useContactsStore();
  const [addingOrg, setAddingOrg] = useState(false);
  const { data, isLoading } = useOrganizations(sort, sortDir, page, perPage);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-gray-50">
      <div className="flex items-center justify-between px-6 pt-5 pb-4 bg-white border-b border-gray-200">
        <h1 className="text-base font-semibold text-gray-800">Organizations</h1>
        <button onClick={() => setAddingOrg(true)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white rounded-lg font-medium cursor-pointer" style={{ backgroundColor: '#0A9E5F' }}>
          <Building size={12} /> Add Organization
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
        <OrgsTable orgs={data?.organizations ?? []} isLoading={isLoading} sort={sort} sortDir={sortDir} onSort={setSort} />
        {(data?.total ?? 0) > perPage && <PaginationControls page={page} perPage={perPage} total={data?.total ?? 0} onPage={setPage} />}
      </div>

      {addingOrg && <AddOrgModal onClose={() => setAddingOrg(false)} />}
    </div>
  );
}
