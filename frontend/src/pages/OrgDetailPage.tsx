import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useOrg } from '../api/useOrganizations';
import OrgInfoPanel from '../components/organizations/OrgInfoPanel';
import OrgActivityFeed from '../components/organizations/OrgActivityFeed';

export default function OrgDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: org, isLoading } = useOrg(id!);

  if (isLoading) return <div className="flex-1 p-8 text-sm text-gray-400 animate-pulse">Loading organization…</div>;
  if (!org) return <div className="flex-1 p-8 text-sm text-gray-500">Organization not found.</div>;

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-gray-50">
      <div className="px-6 pt-4 bg-white border-b border-gray-200 pb-3">
        <Link to="/contacts/organizations" className="flex items-center gap-1 text-xs text-gray-400 hover:text-indigo-600 mb-2">
          <ArrowLeft size={12} /> Back to Organizations
        </Link>
        <h1 className="text-lg font-bold text-gray-900">{org.name}</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="flex gap-5">
          <div className="w-72 shrink-0">
            <OrgInfoPanel org={org} />
          </div>
          <div className="flex-1 min-w-0">
            <OrgActivityFeed orgId={org.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
