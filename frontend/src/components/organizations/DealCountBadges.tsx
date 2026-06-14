interface Props { open: number; won: number; lost: number; }

export default function DealCountBadges({ open, won, lost }: Props) {
  return (
    <div className="flex items-center gap-1">
      {open > 0 && <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 font-medium">{open} open</span>}
      {won > 0 && <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-50 text-green-700 font-medium">{won} won</span>}
      {lost > 0 && <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-50 text-red-600 font-medium">{lost} lost</span>}
      {open === 0 && won === 0 && lost === 0 && <span className="text-xs text-gray-300">No deals</span>}
    </div>
  );
}
