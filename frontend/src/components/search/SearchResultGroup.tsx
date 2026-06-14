import type { SearchResult } from '../../../../shared/types/search';
import SearchResultItem from './SearchResultItem';

interface Props { title: string; results: SearchResult[] }

export default function SearchResultGroup({ title, results }: Props) {
  if (results.length === 0) return null;
  return (
    <div className="mb-3">
      <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold px-3 mb-1">{title}</p>
      {results.map((r) => <SearchResultItem key={`${r.type}-${r.id}`} result={r} />)}
    </div>
  );
}
