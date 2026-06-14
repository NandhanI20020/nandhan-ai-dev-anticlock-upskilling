import { useForecastStore } from '../store/forecastStore';
import { useForecast } from '../api/useForecast';
import ForecastRangeToggle from '../components/forecast/ForecastRangeToggle';
import ForecastGrid from '../components/forecast/ForecastGrid';

function fmt(n: number): string {
  return n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `$${(n / 1_000).toFixed(0)}K` : `$${n}`;
}

export default function ForecastPage() {
  const { range, setRange } = useForecastStore();
  const { data, isLoading } = useForecast(range);

  const totalValue = data?.months.reduce((s, m) => s + m.totalValue, 0) ?? 0;
  const totalWeighted = data?.months.reduce((s, m) => s + (m.weightedValue ?? 0), 0) ?? 0;

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-gray-50">
      <div className="flex items-center justify-between px-6 pt-5 pb-4 bg-white border-b border-gray-200">
        <div>
          <h1 className="text-base font-semibold text-gray-800">Revenue Forecast</h1>
          {!isLoading && data && (
            <p className="text-xs text-gray-400 mt-0.5">
              Pipeline: <strong className="text-gray-700">{fmt(totalValue)}</strong>
              <span className="mx-2">·</span>
              Weighted: <strong className="text-green-700">{fmt(totalWeighted)}</strong>
            </p>
          )}
        </div>
        <ForecastRangeToggle range={range} onChange={setRange} />
      </div>

      <div className="flex-1 overflow-x-auto px-6 py-4">
        {isLoading ? (
          <div className="text-sm text-gray-400 animate-pulse">Loading forecast…</div>
        ) : (
          <ForecastGrid months={data?.months ?? []} />
        )}
      </div>
    </div>
  );
}
