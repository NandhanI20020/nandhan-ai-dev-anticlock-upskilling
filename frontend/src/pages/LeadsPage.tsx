import { useLeadsStore } from '../store/leadsStore';
import { useLeads } from '../api/useLeads';
import LeadKPICards from '../components/leads/LeadKPICards';
import LeadsTable from '../components/leads/LeadsTable';
import LeadSourceChart from '../components/leads/LeadSourceChart';
import type { LeadStatus } from '../../../shared/types/lead';

const TABS: { key: LeadStatus | 'all'; label: string }[] = [
  { key: 'all',          label: 'All' },
  { key: 'incoming',     label: 'Incoming' },
  { key: 'contacted',    label: 'Contacted' },
  { key: 'converted',    label: 'Converted' },
  { key: 'disqualified', label: 'Disqualified' },
];

const SOURCES = ['website', 'referral', 'cold_outreach', 'social_media', 'event', 'partner'];

export default function LeadsPage() {
  const { activeTab, sortField, sortDir, sourceFilter, setActiveTab, setSourceFilter } = useLeadsStore();
  const { data, isLoading } = useLeads(activeTab, sortField, sortDir, sourceFilter);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 pt-4 pb-0">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-base font-semibold text-gray-800">Leads</h1>
          <select value={sourceFilter ?? ''} onChange={(e) => setSourceFilter(e.target.value || null)}
            className="text-sm border border-gray-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-400 bg-white">
            <option value="">All Sources</option>
            {SOURCES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
          </select>
        </div>
        <div className="flex gap-0 border-b border-transparent -mb-px">
          {TABS.map((t) => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 cursor-pointer transition-colors whitespace-nowrap
                ${activeTab === t.key ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
            >{t.label}</button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
        <LeadKPICards kpis={data?.kpis} />

        <div className="flex gap-4">
          <div className="flex-1 min-w-0">
            <LeadsTable leads={data?.leads ?? []} isLoading={isLoading} />
          </div>
          {(data?.sourceDistribution?.length ?? 0) > 0 && (
            <div className="w-64 shrink-0">
              <LeadSourceChart data={data!.sourceDistribution} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
