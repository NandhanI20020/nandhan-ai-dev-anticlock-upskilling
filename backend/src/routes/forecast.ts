import { Router, Request, Response } from 'express';
import dealsData from '../../data/deals.json';
import organizationsData from '../../data/organizations.json';
import forecastConfig from '../../data/forecastConfig.json';
import type { ForecastResponse, ForecastMonth, ForecastDeal, ForecastRange } from '../../../shared/types/forecast';

const router = Router();

interface Deal { id: string; title: string; value: number; currency: string; probability: number; expectedCloseDate: string | null; orgId: string | null; ownerId: string; status: string; }
interface Org { id: string; name: string; }

const deals: Deal[] = dealsData as unknown as Deal[];
const orgs: Org[] = organizationsData as Org[];

const OWNER_META: Record<string, string> = { 'user-1': 'Alice Johnson', 'user-2': 'Bob Smith' };
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function getMonthRange(range: ForecastRange): { year: number; month: number }[] {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth(); // 0-indexed
  const quarter = Math.floor(m / 3);

  if (range === 'this_quarter') {
    const start = quarter * 3;
    return [0, 1, 2].map((i) => ({ year: y, month: start + i }));
  }
  if (range === 'next_quarter') {
    const start = (quarter + 1) * 3;
    return [0, 1, 2].map((i) => {
      const mm = start + i;
      return mm >= 12 ? { year: y + 1, month: mm - 12 } : { year: y, month: mm };
    });
  }
  // this_year
  return Array.from({ length: 12 }, (_, i) => ({ year: y, month: i }));
}

// GET /api/forecast?range=
router.get('/', (req: Request, res: Response) => {
  const range = (req.query.range as ForecastRange) ?? 'this_quarter';
  const monthRange = getMonthRange(range);
  const quota = (forecastConfig as { monthlyQuota: number }).monthlyQuota;

  const openDeals = deals.filter((d) => d.status === 'open' && d.expectedCloseDate);

  const months: ForecastMonth[] = monthRange.map(({ year, month }) => {
    const monthDeals: ForecastDeal[] = openDeals
      .filter((d) => {
        const cd = new Date(d.expectedCloseDate!);
        return cd.getFullYear() === year && cd.getMonth() === month;
      })
      .map((d) => {
        const org = orgs.find((o) => o.id === d.orgId);
        const wv = Math.round(d.value * (d.probability / 100));
        return { id: d.id, title: d.title, orgName: org?.name ?? null, ownerName: OWNER_META[d.ownerId] ?? d.ownerId, value: d.value, currency: d.currency, probability: d.probability, weightedValue: wv, expectedCloseDate: d.expectedCloseDate! };
      });

    const totalValue = monthDeals.reduce((s, d) => s + d.value, 0);
    const weightedValue = monthDeals.reduce((s, d) => s + d.weightedValue, 0);
    const quotaPercent = quota > 0 ? Math.round((weightedValue / quota) * 100) : 0;

    return { label: MONTH_NAMES[month], year, month, deals: monthDeals, totalValue, weightedValue, quotaTarget: quota, quotaPercent };
  });

  res.json({ months, range } as ForecastResponse);
});

export default router;
