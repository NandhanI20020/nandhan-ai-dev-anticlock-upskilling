import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import activitiesData from '../../data/activities.json';
import dealsData from '../../data/deals.json';
import peopleData from '../../data/people.json';
import organizationsData from '../../data/organizations.json';
import type { Activity, ActivityType } from '../../../shared/types/activity';

const router = Router();

interface Deal { id: string; title: string; }
interface Person { id: string; name: string; }
interface Org { id: string; name: string; }

const activities: Activity[] = (activitiesData as unknown as Activity[]).map((a) => ({ ...a, dueTime: (a as Activity & { dueTime?: string | null }).dueTime ?? null, outcome: (a as Activity & { outcome?: string }).outcome ?? '', orgId: (a as Activity & { orgId?: string | null }).orgId ?? null }));
const dealsArr: Deal[] = dealsData as unknown as Deal[];
const peopleArr: Person[] = peopleData as Person[];
const orgsArr: Org[] = organizationsData as Org[];

const OWNER_META: Record<string, { name: string }> = {
  'user-1': { name: 'Alice Johnson' },
  'user-2': { name: 'Bob Smith' },
};

const TODAY = new Date(); TODAY.setHours(0, 0, 0, 0);
const tomorrow = new Date(TODAY); tomorrow.setDate(tomorrow.getDate() + 1);
const nextWeekEnd = new Date(TODAY); nextWeekEnd.setDate(nextWeekEnd.getDate() + 7);

function tabFor(a: Activity): string {
  if (a.doneAt) return 'done';
  if (!a.dueDate) return 'no_due_date';
  const d = new Date(a.dueDate); d.setHours(0, 0, 0, 0);
  if (d < TODAY) return 'overdue';
  if (d.getTime() === TODAY.getTime()) return 'today';
  if (d.getTime() === tomorrow.getTime()) return 'tomorrow';
  if (d <= nextWeekEnd) return 'this_week';
  return 'upcoming';
}

function enrichActivity(a: Activity) {
  const deal = dealsArr.find((d) => d.id === a.dealId);
  const person = peopleArr.find((p) => p.id === a.personId);
  const org = orgsArr.find((o) => o.id === (a as Activity & { orgId?: string | null }).orgId);
  const owner = OWNER_META[a.ownerId] ?? { name: a.ownerId };
  return { ...a, dealTitle: deal?.title ?? null, personName: person?.name ?? null, orgName: org?.name ?? null, ownerName: owner.name, tab: tabFor(a) };
}

// GET /api/activities
router.get('/', (req: Request, res: Response) => {
  const { tab, type, dealId, personId, orgId } = req.query as Record<string, string>;

  const now = new Date();
  const startOf30d = new Date(now); startOf30d.setDate(startOf30d.getDate() - 30);

  const kpis = {
    completionRate: (() => {
      const period = activities.filter((a) => new Date(a.createdAt) >= startOf30d);
      if (period.length === 0) return 0;
      return Math.round((period.filter((a) => a.doneAt).length / period.length) * 100);
    })(),
    urgentCount: activities.filter((a) => !a.doneAt && a.dueDate && new Date(a.dueDate) < now).length,
    avgResponseTimeHours: 24,
  };

  const tabCounts: Record<string, number> = { overdue: 0, today: 0, tomorrow: 0, this_week: 0, upcoming: 0, done: 0, no_due_date: 0 };
  activities.forEach((a) => { const t = tabFor(a); if (t in tabCounts) tabCounts[t]++; });

  let filtered = activities;
  if (tab && tab !== 'all') filtered = filtered.filter((a) => tabFor(a) === tab);
  if (type) filtered = filtered.filter((a) => a.type === type as ActivityType);
  if (dealId) filtered = filtered.filter((a) => a.dealId === dealId);
  if (personId) filtered = filtered.filter((a) => a.personId === personId);
  if (orgId) filtered = filtered.filter((a) => (a as Activity & { orgId?: string | null }).orgId === orgId);

  filtered.sort((a, b) => {
    if (!a.dueDate && !b.dueDate) return 0;
    if (!a.dueDate) return 1; if (!b.dueDate) return -1;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  res.json({ activities: filtered.map(enrichActivity), tabCounts, kpis });
});

// PATCH /api/activities/:id/done
router.patch('/:id/done', (req: Request, res: Response) => {
  const idx = activities.findIndex((a) => a.id === req.params.id);
  if (idx === -1) { res.status(404).json({ error: 'Not found' }); return; }
  activities[idx] = { ...activities[idx], done: true, doneAt: new Date().toISOString() };
  res.json(enrichActivity(activities[idx]));
});

// PATCH /api/activities/:id
router.patch('/:id', (req: Request, res: Response) => {
  const idx = activities.findIndex((a) => a.id === req.params.id);
  if (idx === -1) { res.status(404).json({ error: 'Not found' }); return; }
  activities[idx] = { ...activities[idx], ...req.body as Partial<Activity> };
  res.json(enrichActivity(activities[idx]));
});

// DELETE /api/activities/:id
router.delete('/:id', (req: Request, res: Response) => {
  const idx = activities.findIndex((a) => a.id === req.params.id);
  if (idx === -1) { res.status(404).json({ error: 'Not found' }); return; }
  activities.splice(idx, 1);
  res.status(204).send();
});

// POST /api/activities
router.post('/', (req: Request, res: Response) => {
  const { type, subject, dueDate = null, dueTime = null, note = '', dealId = null, personId = null, orgId = null, ownerId = 'user-1' } = req.body as Partial<Activity>;
  if (!type || !subject) { res.status(400).json({ error: 'type and subject required' }); return; }
  const act: Activity = { id: `act-${uuidv4().slice(0, 8)}`, type, subject: subject as string, dueDate: dueDate ?? null, dueTime: dueTime ?? null, dealId: dealId ?? null, personId: personId ?? null, orgId: (orgId ?? null) as string | null, ownerId, done: false, doneAt: null, note: note as string, outcome: '', createdAt: new Date().toISOString() };
  activities.push(act);
  res.status(201).json(enrichActivity(act));
});

export { activities };
export default router;
