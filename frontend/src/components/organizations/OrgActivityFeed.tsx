import { useOrgFeed, useLogOrgActivity, useCreateOrgNote } from '../../api/useOrganizations';
import ActivityFeed from '../deal-detail/ActivityFeed';
import NoteComposer from '../deal-detail/NoteComposer';
import QuickLogBar from '../deal-detail/QuickLogBar';

interface Props { orgId: string; }

export default function OrgActivityFeed({ orgId }: Props) {
  const { data: items = [], isLoading } = useOrgFeed(orgId);
  const logActivity = useLogOrgActivity(orgId);
  const createNote = useCreateOrgNote(orgId);

  return (
    <div className="flex flex-col gap-3">
      <QuickLogBar dealId={orgId} overrideLogFn={(data) => logActivity.mutateAsync(data)} />
      <NoteComposer dealId={orgId} overrideSaveFn={(content) => createNote.mutateAsync(content)} />
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Activity</p>
        <ActivityFeed items={items} dealId={orgId} isLoading={isLoading} />
      </div>
    </div>
  );
}
