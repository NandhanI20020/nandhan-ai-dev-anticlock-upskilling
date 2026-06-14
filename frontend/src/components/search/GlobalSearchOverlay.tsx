import { useEffect, useRef, useState } from 'react';
import { X, Search, Clock } from 'lucide-react';
import { useSearchStore } from '../../store/searchStore';
import { useSearch } from '../../api/useSearch';
import SearchResultGroup from './SearchResultGroup';

export default function GlobalSearchOverlay() {
  const { setOpen, recentlyViewed } = useSearchStore();
  const [q, setQ] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { data, isLoading } = useSearch(q);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const hasResults = data && (data.deals.length + data.people.length + data.orgs.length) > 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4 bg-black/40" onClick={() => setOpen(false)}>
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
          <Search size={16} className="text-gray-400 shrink-0" />
          <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search deals, contacts, organizations…"
            className="flex-1 text-sm outline-none text-gray-900 placeholder-gray-400" />
          <button onClick={() => setOpen(false)} className="p-1 rounded hover:bg-gray-100 cursor-pointer"><X size={14} className="text-gray-400" /></button>
        </div>

        <div className="max-h-[420px] overflow-y-auto p-2">
          {q.trim().length < 2 ? (
            recentlyViewed.length > 0 ? (
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold px-3 mb-1 flex items-center gap-1"><Clock size={9} /> Recent</p>
                {recentlyViewed.map((r) => (
                  <div key={`${r.type}-${r.id}`} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <span className="capitalize text-xs text-gray-400">{r.type}</span>
                    <span>{r.title}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-8">Type to search…</p>
            )
          ) : isLoading ? (
            <p className="text-sm text-gray-400 text-center py-8 animate-pulse">Searching…</p>
          ) : !hasResults ? (
            <p className="text-sm text-gray-400 text-center py-8">No results for "{q}"</p>
          ) : (
            <>
              <SearchResultGroup title="Deals" results={data?.deals ?? []} />
              <SearchResultGroup title="People" results={data?.people ?? []} />
              <SearchResultGroup title="Organizations" results={data?.orgs ?? []} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
