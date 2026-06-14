import { Router, Request, Response } from 'express';
import dealsData from '../../data/deals.json';
import activitiesData from '../../data/activities.json';
import stagesData from '../../data/stages.json';
import organizationsData from '../../data/organizations.json';
import type { DashboardResponse, StageDistribution, ActivityByDay } from '../../../shared/types/insights';

const router = Router();

interface Deal { id: string; title: string; value: number; currency: string; status: string; stageId: string; orgId: string | null; ownerId: string; createdAt: string; updatedAt: string; wonTime: string | null; lostTime: string | null; expectedCloseDate: string | null; }
interface Activity { id: string; type: string; dueDate: string | null; doneAt: string | null; createdAt: string; }
interface Stage { id: string; name: string; order: number; }
interface Org { id: string; name: string; }

const deals: Deal[] = dealsData as unknown as Deal[];
const activities: Activity[] = activitiesData as unknown as Activity[];
const stages: Stage[] = stagesData as Stage[];
const orgs: Org[] = organizationsData as Org[];

// GET /api/insights?from=&to=
router.get('/', (req: Request, res: Response) => {
  const { from, to } = req.query as { from?: string; to?: string };
  const fromDate = from ? new Date(from) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const toDate = to ? new Date(to) : new Date();
  const periodMs = toDate.getTime() - fromDate.getTime();
  const priorFrom = new Date(fromDate.getTime() - periodMs);
  const priorTo = new Date(fromDate);

  function inPeriod(d: Date, f: Date, t: Date) { return d >= f && d <= t; }

  const inRange = deals.filter((d) => inPeriod(new Date(d.createdAt), fromDate, toDate));
  const inPrior = deals.filter((d) => inPeriod(new Date(d.createdAt), priorFrom, priorTo));

  const openDeals = deals.filter((d) => d.status === 'open');
  const openValue = openDeals.reduce((s, d) => s + d.value, 0);
  const priorOpenValue = inPrior.filter((d) => d.status === 'open').reduce((s, d) => s + d.value, 0);

  const wonInRange = inRange.filter((d) => d.status === 'won');
  const wonRevenue = wonInRange.reduce((s, d) => s + d.value, 0);
  const priorWonRevenue = inPrior.filter((d) => d.status === 'won').reduce((s, d) => s + d.value, 0);

  const todayStr = new Date().toISOString().slice(0, 10);
  const activitiesToday = activities.filter((a) => a.dueDate === todayStr).length;
  const yesterdayStr = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const activitiesYesterday = activities.filter((a) => a.dueDate === yesterdayStr).length;

  const openAgeDays = openDeals.map((d) => Math.floor((Date.now() - new Date(d.createdAt).getTime()) / 86400000));
  const avgDealAge = openAgeDays.length > 0 ? Math.round(openAgeDays.reduce((s, v) => s + v, 0) / openAgeDays.length) : 0;

  function trend(curr: number, prev: number): number {
    if (prev === 0) return curr > 0 ? 100 : 0;
    return Math.round(((curr - prev) / prev) * 100);
  }

  const stageDistribution: StageDistribution[] = stages.map((s) => {
    const stageDeals = openDeals.filter((d) => d.stageId === s.id);
    return { stageName: s.name, dealCount: stageDeals.length, totalValue: stageDeals.reduce((sum, d) => sum + d.value, 0) };
  }).filter((s) => s.dealCount > 0);

  const wonCount = deals.filter((d) => d.status === 'won').length;
  const lostCount = deals.filter((d) => d.status === 'lost').length;
  const totalClosed = wonCount + lostCount;
  const winRate = totalClosed > 0 ? Math.round((wonCount / totalClosed) * 100) : 0;

  // Activity timeline — last 7 days
  const activityTimeline: ActivityByDay[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    const ds = d.toISOString().slice(0, 10);
    const dayActs = activities.filter((a) => a.doneAt?.slice(0, 10) === ds);
    const row: ActivityByDay = { date: ds, call: 0, meeting: 0, task: 0, email: 0, deadline: 0 };
    dayActs.forEach((a) => { if (a.type in row) (row as unknown as Record<string, number>)[a.type]++; });
    activityTimeline.push(row);
  }

  const recentDeals = [...openDeals]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5)
    .map((d) => {
      const stage = stages.find((s) => s.id === d.stageId);
      const org = orgs.find((o) => o.id === d.orgId);
      return { id: d.id, title: d.title, orgName: org?.name ?? null, value: d.value, currency: d.currency ?? 'USD', stageName: stage?.name ?? '', updatedAt: d.updatedAt };
    });

  const response: DashboardResponse = {
    stats: { openPipelineValue: openValue, openPipelineTrend: trend(openValue, priorOpenValue), wonRevenue, wonRevenueTrend: trend(wonRevenue, priorWonRevenue), activitiesToday, activitiesTodayTrend: trend(activitiesToday, activitiesYesterday), avgDealAgeDays: avgDealAge, avgDealAgeTrend: 0 },
    stageDistribution,
    winLoss: { won: wonCount, lost: lostCount, winRate },
    activityTimeline,
    recentDeals,
  };
  res.json(response);
});

export default router;
