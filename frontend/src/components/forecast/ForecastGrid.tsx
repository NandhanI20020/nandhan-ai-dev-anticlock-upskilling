import type { ForecastMonth } from '../../../../shared/types/forecast';
import ForecastColumn from './ForecastColumn';

export default function ForecastGrid({ months }: { months: ForecastMonth[] }) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {months.map((m) => <ForecastColumn key={`${m.year}-${m.month}`} month={m} />)}
    </div>
  );
}
