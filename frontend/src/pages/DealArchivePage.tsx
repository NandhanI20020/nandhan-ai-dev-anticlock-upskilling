import { useArchiveStore } from '../store/archiveStore';
import { useArchive } from '../api/useArchive';
import ArchiveKPICards from '../components/archive/ArchiveKPICards';
import ArchiveFilterBar from '../components/archive/ArchiveFilterBar';
import ArchiveTable from '../components/archive/ArchiveTable';
import WinReasonChart from '../components/archive/WinReasonChart';
import LossInsightsPanel from '../components/archive/LossInsightsPanel';

export default function DealArchivePage() {
  const { statusFilter, datePreset, searchQuery } = useArchiveStore();
  const { data, isLoading } = useArchive(statusFilter, datePreset, searchQuery);

  const deals = data?.deals ?? [];
  const filtered = searchQuery
    ? deals.filter((d) => d.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : deals;

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-gray-50">
      <div className="flex items-center justify-between px-6 pt-5 pb-4 bg-white border-b border-gray-200">
        <h1 className="text-base font-semibold text-gray-800">Deal Archive</h1>
        <ArchiveFilterBar />
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
        <ArchiveKPICards kpis={data?.kpis} />
        <ArchiveTable deals={filtered} isLoading={isLoading} />

        {(data?.winReasons?.length ?? 0) > 0 || (data?.lossReasons?.length ?? 0) > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            <WinReasonChart data={data?.winReasons ?? []} />
            <LossInsightsPanel data={data?.lossReasons ?? []} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
