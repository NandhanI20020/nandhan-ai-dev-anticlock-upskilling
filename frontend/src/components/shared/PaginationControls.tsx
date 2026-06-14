import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  total: number;
  page: number;
  perPage: number;
  onPageChange: (page: number) => void;
}

export default function PaginationControls({ total, page, perPage, onPageChange }: Props) {
  const totalPages = Math.ceil(total / perPage);
  if (totalPages <= 1) return null;

  const start = (page - 1) * perPage + 1;
  const end = Math.min(page * perPage, total);

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visible = pages.filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1);

  return (
    <div className="flex items-center justify-between px-1 py-3">
      <p className="text-xs text-gray-500">
        Showing {start}–{end} of {total} deals
      </p>
      <div className="flex items-center gap-1">
        <button
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          <ChevronLeft size={14} />
        </button>

        {visible.reduce<(number | string)[]>((acc, p, i) => {
          if (i > 0 && (p as number) - (visible[i - 1] as number) > 1) acc.push('…');
          acc.push(p);
          return acc;
        }, []).map((p, i) =>
          p === '…' ? (
            <span key={`ellipsis-${i}`} className="px-1 text-gray-400 text-xs">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              className={`w-7 h-7 text-xs rounded font-medium cursor-pointer
                ${page === p ? 'text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              style={page === p ? { backgroundColor: '#6F6EE8' } : {}}
            >
              {p}
            </button>
          )
        )}

        <button
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
