import { Router, Request, Response } from 'express';
import dealsData from '../../data/deals.json';
import organizationsData from '../../data/organizations.json';
import type { ArchiveResponse, ArchivedDeal } from '../../../shared/types/archive';

const router = Router();

interface Deal { id: string; title: string; value: number; currency: string; status: string; orgId: string | null; ownerId: string; source: string | null; lostReason: string | null; wonTime: string | null; lostTime: string | null; createdAt: string; updatedAt: string; }
interface Org { id: string; name: string; }

const deals: Deal[] = dealsData as unknown as Deal[];
const orgs: Org[] = organizationsData as Org[];

const OWNER_META: Record<string, { name: string; initials: string; color: string }> = {
  'user-1': { name: 'Alice Johnson', initials: 'AJ', color: '#6F6EE8' },
  'user-2': { name: 'Bob Smith',     initials: 'BS', color: '#0A9E5F' },
};

// GET /api/archive
router.get('/', (req: Request, res: Response) => {
  const { status, from, to, q } = req.query as Record<string, string>;

  const closed = deals.filter((d) => d.status === 'won' || d.status === 'lost');
  let filtered = closed.filter((d) => {
    if (status && status !== 'all' && d.status !== status) return false;
    const closedAt = d.status === 'won' ? d.wonTime : d.lostTime;
    if (!closedAt) return false;
    if (from && closedAt < from) return false;
    if (to && closedAt > to) return false;
    const org = orgs.find((o) => o.id === d.orgId);
    if (q && !d.title.toLowerCase().includes(q.toLowerCase()) && !org?.name.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  const archivedDeals: ArchivedDeal[] = filtered.map((d) => {
    const org = orgs.find((o) => o.id === d.orgId);
    const owner = OWNER_META[d.ownerId] ?? { name: d.ownerId, initials: '?', color: '#999' };
    const closedAt = (d.status === 'won' ? d.wonTime : d.lostTime) ?? d.updatedAt;
    const cycleDays = Math.max(0, Math.floor((new Date(closedAt).getTime() - new Date(d.createdAt).getTime()) / 86400000));
    return { id: d.id, title: d.title, orgName: org?.name ?? null, value: d.value, currency: d.currency, status: d.status as 'won' | 'lost', lostReason: d.lostReason, source: d.source, closedAt, dealCycleDays: cycleDays, ownerName: owner.name, ownerInitials: owner.initials, ownerColor: owner.color };
  });

  const wonDeals = archivedDeals.filter((d) => d.status === 'won');
  const lostDeals = archivedDeals.filter((d) => d.status === 'lost');
  const wonRevenue = wonDeals.reduce((s, d) => s + d.value, 0);
  const lostValue = lostDeals.reduce((s, d) => s + d.value, 0);
  const totalClosed = archivedDeals.length;
  const winRate = totalClosed > 0 ? Math.round((wonDeals.length / totalClosed) * 100) : 0;
  const avgCycle = totalClosed > 0 ? Math.round(archivedDeals.reduce((s, d) => s + d.dealCycleDays, 0) / totalClosed) : 0;

  const sourceCounts: Record<string, { count: number; totalValue: number }> = {};
  wonDeals.forEach((d) => {
    const src = d.source ?? 'Unknown';
    if (!sourceCounts[src]) sourceCounts[src] = { count: 0, totalValue: 0 };
    sourceCounts[src].count++; sourceCounts[src].totalValue += d.value;
  });
  const winReasons = Object.entries(sourceCounts).map(([source, v]) => ({ source, ...v })).sort((a, b) => b.count - a.count);

  const lossReasonCounts: Record<string, number> = {};
  lostDeals.forEach((d) => { const r = d.lostReason ?? 'Unknown'; lossReasonCounts[r] = (lossReasonCounts[r] ?? 0) + 1; });
  const totalLost = lostDeals.length;
  const lossReasons = Object.entries(lossReasonCounts).map(([reason, count]) => ({ reason, count, percent: totalLost > 0 ? Math.round((count / totalLost) * 100) : 0 })).sort((a, b) => b.count - a.count);

  res.json({ deals: archivedDeals, kpis: { totalArchived: totalClosed, wonCount: wonDeals.length, wonRevenue, lostCount: lostDeals.length, lostValue, winRate, avgCycleDays: avgCycle }, winReasons, lossReasons, total: totalClosed } as ArchiveResponse);
});

export default router;
