import { formatCurrency } from '../../utils/dateUtils';
import type { DealDetail } from '../../../../shared/types/deal';
import InlineEdit from './InlineEdit';
import LinkedContactCard from './LinkedContactCard';
import { useUpdateDeal } from '../../api/useDealDetail';

interface Props { deal: DealDetail; }

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start py-2 border-b border-gray-100 last:border-0">
      <span className="text-xs text-gray-400 w-28 shrink-0 pt-0.5">{label}</span>
      <span className="text-sm text-gray-800 flex-1 min-w-0">{children}</span>
    </div>
  );
}

export default function DealInfoPanel({ deal }: Props) {
  const update = useUpdateDeal(deal.id);

  return (
    <aside className="w-full flex flex-col gap-0 bg-white rounded-xl border border-gray-200 p-4 h-fit">
      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Deal Info</p>

      <Field label="Value">
        <InlineEdit
          value={String(deal.value)}
          type="number"
          onSave={(v) => update.mutate({ value: parseFloat(v) || 0 })}
          displayClassName="font-semibold"
        />
        {' '}{deal.currency}
        <span className="ml-1 text-xs text-gray-400">({formatCurrency(deal.value, deal.currency)})</span>
      </Field>

      <Field label="Close date">
        <InlineEdit
          value={deal.expectedCloseDate ?? ''}
          type="date"
          placeholder="Set date"
          onSave={(v) => update.mutate({ expectedCloseDate: v || null })}
        />
      </Field>

      <Field label="Probability">
        <InlineEdit
          value={String(deal.probability)}
          type="number"
          onSave={(v) => update.mutate({ probability: Math.min(100, Math.max(0, parseInt(v) || 0)) })}
        />%
      </Field>

      <Field label="Pipeline">{deal.pipelineName}</Field>
      <Field label="Stage">{deal.stageName}</Field>
      <Field label="Source">{deal.source ?? <span className="text-gray-300">—</span>}</Field>

      <Field label="Owner">
        <span className="flex items-center gap-1.5">
          <span
            className="w-4 h-4 rounded-full flex items-center justify-center text-white text-[9px] font-bold"
            style={{ backgroundColor: deal.ownerColor }}
          >
            {deal.ownerInitials}
          </span>
          {deal.ownerName}
        </span>
      </Field>

      <Field label="Created">{new Date(deal.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</Field>

      <LinkedContactCard deal={deal} />
    </aside>
  );
}
