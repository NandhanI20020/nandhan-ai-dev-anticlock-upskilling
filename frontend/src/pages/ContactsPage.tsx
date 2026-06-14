import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { UserPlus, Building, Download, Users } from 'lucide-react';
import { usePeople, useAllPeopleForExport } from '../api/usePeople';
import { useOrganizations } from '../api/useOrganizations';
import { useContactsStore } from '../store/contactsStore';
import PeopleTable from '../components/contacts/PeopleTable';
import AddPersonModal from '../components/contacts/AddPersonModal';
import PeopleFilterBar from '../components/contacts/PeopleFilterBar';
import OrgsTable from '../components/organizations/OrgsTable';
import AddOrgModal from '../components/organizations/AddOrgModal';
import PaginationControls from '../components/shared/PaginationControls';
import { downloadCsv } from '../lib/csvExport';

export default function ContactsPage() {
  const location = useLocation();
  const isPeople = !location.pathname.includes('/organizations');
  const { filters, sort, sortDir, selectedIds, page, perPage, setSort, setPage, toggleSelected, setAllSelected, clearSelected, setFilters, clearFilters } = useContactsStore();
  const [addingPerson, setAddingPerson] = useState(false);
  const [addingOrg, setAddingOrg] = useState(false);
  const fetchAllPeople = useAllPeopleForExport(filters, sort, sortDir);

  const peopleQ = usePeople(filters, sort, sortDir, page, perPage);
  const orgsQ = useOrganizations(sort, sortDir, page, perPage);

  async function handleExport() {
    const result = await fetchAllPeople();
    downloadCsv(result.people.map((p) => ({
      Name: p.name, Email: p.email, Phone: p.phone,
      Org: p.orgName ?? '', Owner: p.ownerName,
    })), 'people.csv');
  }

  const total = isPeople ? (peopleQ.data?.total ?? 0) : (orgsQ.data?.total ?? 0);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-gray-50">
      <div className="flex items-center justify-between px-6 pt-5 pb-4 bg-white border-b border-gray-200">
        <div className="flex items-center gap-1">
          <NavLink to="/contacts/people" className={({ isActive }) => `flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}>
            <Users size={14} /> People
          </NavLink>
          <NavLink to="/contacts/organizations" className={({ isActive }) => `flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}>
            <Building size={14} /> Organizations
          </NavLink>
        </div>
        <div className="flex items-center gap-2">
          {isPeople && (
            <button onClick={handleExport} className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
              <Download size={12} /> Export CSV
            </button>
          )}
          <button onClick={() => isPeople ? setAddingPerson(true) : setAddingOrg(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white rounded-lg font-medium cursor-pointer"
            style={{ backgroundColor: '#0A9E5F' }}>
            {isPeople ? <><UserPlus size={12} /> Add Person</> : <><Building size={12} /> Add Organization</>}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
        {isPeople && <PeopleFilterBar filters={filters} onSetFilters={setFilters} onClear={clearFilters} />}

        {isPeople ? (
          <PeopleTable
            people={peopleQ.data?.people ?? []}
            isLoading={peopleQ.isLoading}
            sort={sort}
            sortDir={sortDir}
            onSort={setSort}
            selectedIds={selectedIds}
            onToggleSelect={toggleSelected}
            onSelectAll={setAllSelected}
            onClearAll={clearSelected}
          />
        ) : (
          <OrgsTable
            orgs={orgsQ.data?.organizations ?? []}
            isLoading={orgsQ.isLoading}
            sort={sort}
            sortDir={sortDir}
            onSort={setSort}
          />
        )}

        {total > perPage && (
          <PaginationControls page={page} perPage={perPage} total={total} onPage={setPage} />
        )}
      </div>

      {addingPerson && <AddPersonModal onClose={() => setAddingPerson(false)} />}
      {addingOrg && <AddOrgModal onClose={() => setAddingOrg(false)} />}
    </div>
  );
}
