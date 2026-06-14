import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import organizationsData from '../../data/organizations.json';
import peopleData from '../../data/people.json';
import dealsData from '../../data/deals.json';
import activitiesData from '../../data/activities.json';
import notesData from '../../data/notes.json';
import type { Organization, OrgListItem, OrgDetail } from '../../../shared/types/organization';
import type { FeedItem, NoteFeedItem, ActivityFeedItem, Note } from '../../../shared/types/deal';
import type { Activity } from '../../../shared/types/activity';

const router = Router();

interface Person { id: string; name: string; email: string; jobTitle: string; orgId: string | null; ownerId: string; }
interface Deal { id: string; title: string; value: number; currency: string; stageId: string; orgId: string | null; status: string; ownerId: string; createdAt: string; updatedAt: string; }

const orgs: Organization[] = (organizationsData as Organization[]).map((o) => ({ ...o }));
const people: Person[] = peopleData as Person[];
const deals: Deal[] = dealsData as unknown as Deal[];
const activities: Activity[] = activitiesData as unknown as Activity[];
const notes: Note[] = notesData as Note[];

const OWNER_META: Record<string, { name: string; initials: string; color: string }> = {
  'user-1': { name: 'Alice Johnson', initials: 'AJ', color: '#6F6EE8' },
  'user-2': { name: 'Bob Smith',     initials: 'BS', color: '#0A9E5F' },
};

const PERSON_COLORS = ['#6F6EE8', '#0A9E5F', '#E15A51', '#FB923C', '#3B82F6'];
function personColor(name: string): string {
  let h = 0; for (const c of name) h = c.charCodeAt(0) + ((h << 5) - h);
  return PERSON_COLORS[Math.abs(h) % PERSON_COLORS.length];
}
function initials(name: string): string { return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2); }

function toOrgListItem(org: Organization): OrgListItem {
  const owner = OWNER_META[org.ownerId] ?? { name: org.ownerId, initials: '??', color: '#999' };
  const orgPeople = people.filter((p) => p.orgId === org.id);
  const personAvatars = orgPeople.slice(0, 3).map((p) => ({ initials: initials(p.name), color: personColor(p.name) }));
  const orgDeals = deals.filter((d) => d.orgId === org.id);
  const lastAct = activities.filter((a) => a.orgId === org.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
  return {
    ...org,
    peopleCount: orgPeople.length,
    personAvatars,
    openDealCount: orgDeals.filter((d) => d.status === 'open').length,
    wonDealCount: orgDeals.filter((d) => d.status === 'won').length,
    lostDealCount: orgDeals.filter((d) => d.status === 'lost').length,
    lastActivityDate: lastAct?.createdAt ?? null,
    ownerName: owner.name,
    ownerInitials: owner.initials,
    ownerColor: owner.color,
  };
}

// GET /api/organizations
router.get('/', (req: Request, res: Response) => {
  const { ownerId, myOrgs, search, sort = 'createdAt', sortDir = 'desc', page = '1', perPage = '15' } = req.query as Record<string, string>;
  let filtered = orgs.filter((o) => {
    if (ownerId && o.ownerId !== ownerId) return false;
    if (myOrgs === 'true' && o.ownerId !== 'user-1') return false;
    if (search && !o.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
  const items = filtered.map(toOrgListItem);
  items.sort((a, b) => {
    const av = (a as unknown as Record<string, unknown>)[sort] ?? ''; const bv = (b as unknown as Record<string, unknown>)[sort] ?? '';
    const cmp = String(av) < String(bv) ? -1 : String(av) > String(bv) ? 1 : 0;
    return sortDir === 'asc' ? cmp : -cmp;
  });
  const total = items.length; const pageNum = parseInt(page, 10); const perPageNum = parseInt(perPage, 10);
  const paginated = req.query.all === 'true' ? items : items.slice((pageNum - 1) * perPageNum, pageNum * perPageNum);
  res.json({ organizations: paginated, total, page: pageNum, perPage: perPageNum });
});

// GET /api/organizations/:id
router.get('/:id', (req: Request, res: Response) => {
  const org = orgs.find((o) => o.id === req.params.id);
  if (!org) { res.status(404).json({ error: 'Org not found' }); return; }
  const base = toOrgListItem(org);
  const orgPeople = people.filter((p) => p.orgId === org.id).map((p) => ({ id: p.id, name: p.name, jobTitle: p.jobTitle, email: p.email, initials: initials(p.name), color: personColor(p.name) }));
  const activeDeals = deals.filter((d) => d.orgId === org.id && d.status === 'open').map((d) => ({ id: d.id, title: d.title, value: d.value, currency: 'USD', stageName: d.stageId }));
  const detail: OrgDetail = { ...base, people: orgPeople, activeDeals };
  res.json(detail);
});

// GET /api/organizations/:id/feed
router.get('/:id/feed', (req: Request, res: Response) => {
  const org = orgs.find((o) => o.id === req.params.id);
  if (!org) { res.status(404).json({ error: 'Org not found' }); return; }
  const feedItems: FeedItem[] = [];
  activities.filter((a) => a.orgId === org.id).forEach((a) => {
    const owner = OWNER_META[a.ownerId] ?? { name: a.ownerId, initials: '??', color: '#999' };
    feedItems.push({ id: a.id, type: 'activity', activityType: a.type, subject: a.subject, dueDate: a.dueDate, done: a.doneAt !== null, doneAt: a.doneAt, note: a.note ?? '', outcome: '', ownerName: owner.name, createdAt: a.createdAt } as ActivityFeedItem);
  });
  const orgDealIds = new Set(deals.filter((d) => d.orgId === org.id).map((d) => d.id));
  notes.filter((n) => orgDealIds.has(n.dealId)).forEach((n) => {
    const owner = OWNER_META[n.ownerId] ?? { name: n.ownerId, initials: '??', color: '#999' };
    feedItems.push({ id: n.id, type: 'note', content: n.content, ownerName: owner.name, ownerInitials: owner.initials, ownerColor: owner.color, createdAt: n.createdAt, updatedAt: n.updatedAt } as NoteFeedItem);
  });
  feedItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json(feedItems);
});

// POST /api/organizations
router.post('/', (req: Request, res: Response) => {
  const { name, address = '', phone = '', website = '', ownerId = 'user-1' } = req.body as Partial<Organization>;
  if (!name) { res.status(400).json({ error: 'name is required' }); return; }
  const dup = orgs.find((o) => o.name.toLowerCase() === (name as string).toLowerCase());
  const now = new Date().toISOString();
  const newOrg: Organization = { id: `org-${uuidv4().slice(0, 8)}`, name: name as string, address, phone, website, ownerId, labels: [], createdAt: now, updatedAt: now };
  orgs.push(newOrg);
  res.status(201).json({ ...toOrgListItem(newOrg), warning: dup ? `Similar org "${dup.name}" already exists` : undefined });
});

// PATCH /api/organizations/:id
router.patch('/:id', (req: Request, res: Response) => {
  const idx = orgs.findIndex((o) => o.id === req.params.id);
  if (idx === -1) { res.status(404).json({ error: 'Org not found' }); return; }
  orgs[idx] = { ...orgs[idx], ...req.body as Partial<Organization>, updatedAt: new Date().toISOString() };
  res.json(toOrgListItem(orgs[idx]));
});

// POST /api/organizations/:id/activities
router.post('/:id/activities', (req: Request, res: Response) => {
  const org = orgs.find((o) => o.id === req.params.id);
  if (!org) { res.status(404).json({ error: 'Org not found' }); return; }
  const { type, subject, dueDate = null, note = '' } = req.body as Partial<Activity>;
  if (!type || !subject) { res.status(400).json({ error: 'type and subject required' }); return; }
  const now = new Date().toISOString();
  const act: Activity = { id: `act-${uuidv4().slice(0, 8)}`, type, subject: subject as string, dueDate: dueDate ?? null, dueTime: null, dealId: null, personId: null, orgId: org.id, ownerId: org.ownerId, done: false, doneAt: null, note: note as string, outcome: '', createdAt: now };
  activities.push(act);
  res.status(201).json(act);
});

// POST /api/organizations/:id/notes
router.post('/:id/notes', (req: Request, res: Response) => {
  const org = orgs.find((o) => o.id === req.params.id);
  if (!org) { res.status(404).json({ error: 'Org not found' }); return; }
  const { content } = req.body as { content: string };
  if (!content?.trim()) { res.status(400).json({ error: 'content required' }); return; }
  const now = new Date().toISOString();
  const newNote = { id: `note-${uuidv4().slice(0, 8)}`, content: content.trim(), dealId: '', orgId: org.id, ownerId: org.ownerId, createdAt: now, updatedAt: now };
  (notes as (Note & { orgId?: string })[]).push(newNote as Note);
  res.status(201).json(newNote);
});

export { orgs };
export default router;
