import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import peopleData from '../../data/people.json';
import organizationsData from '../../data/organizations.json';
import dealsData from '../../data/deals.json';
import activitiesData from '../../data/activities.json';
import notesData from '../../data/notes.json';
import labelsData from '../../data/labels.json';
import stagesData from '../../data/stages.json';
import type { Person, PersonListItem, PersonDetail, ActivePersonDeal } from '../../../shared/types/person';
import type { FeedItem, NoteFeedItem, ActivityFeedItem } from '../../../shared/types/deal';
import type { Activity } from '../../../shared/types/activity';
import type { Note } from '../../../shared/types/deal';
import type { Stage } from '../../../shared/types/pipeline';

const router = Router();

interface Org { id: string; name: string; address: string; }
interface Deal { id: string; title: string; value: number; currency: string; stageId: string; personId: string | null; status: string; nextActivityDate: string | null; nextActivityType: string | null; createdAt: string; }

const people: Person[] = (peopleData as unknown as Person[]).map((p) => ({ ...p, labelIds: (p as Person & { labelIds?: string[] }).labelIds ?? [] }));
const orgs: Org[] = organizationsData as Org[];
const deals: Deal[] = dealsData as unknown as Deal[];
const activities: Activity[] = activitiesData as unknown as Activity[];
const notes: Note[] = notesData as Note[];
const stages: Stage[] = stagesData as Stage[];

const OWNER_META: Record<string, { name: string; initials: string; color: string }> = {
  'user-1': { name: 'Alice Johnson', initials: 'AJ', color: '#6F6EE8' },
  'user-2': { name: 'Bob Smith',     initials: 'BS', color: '#0A9E5F' },
};

function nameInitials(name: string): string {
  return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
}

function toPersonListItem(person: Person): PersonListItem {
  const org = orgs.find((o) => o.id === person.orgId);
  const owner = OWNER_META[person.ownerId] ?? { name: person.ownerId, initials: '??', color: '#999' };
  const dealCount = deals.filter((d) => d.personId === person.id && d.status === 'open').length;

  const personActivities = activities.filter((a) => a.personId === person.id);
  let lastActionDate: string | null = null;
  let lastActionStatus: 'active' | 'overdue' | 'new' | null = null;

  if (personActivities.length > 0) {
    const sorted = [...personActivities].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    lastActionDate = sorted[0].createdAt;
    const upcoming = personActivities.find((a) => !a.doneAt && a.dueDate);
    if (upcoming) {
      const overdue = upcoming.dueDate && new Date(upcoming.dueDate) < new Date();
      lastActionStatus = overdue ? 'overdue' : 'active';
    } else {
      lastActionStatus = 'active';
    }
  } else {
    lastActionStatus = 'new';
  }

  return {
    ...person,
    orgName: org?.name ?? null,
    dealCount,
    lastActionDate,
    lastActionStatus,
    ownerName: owner.name,
    ownerInitials: owner.initials,
    ownerColor: owner.color,
  };
}

// GET /api/people
router.get('/', (req: Request, res: Response) => {
  const { ownerId, myPeople, label, orgId, search, sort = 'createdAt', sortDir = 'desc', page = '1', perPage = '15' } = req.query as Record<string, string>;

  let filtered = people.filter((p) => {
    if (ownerId && p.ownerId !== ownerId) return false;
    if (myPeople === 'true' && p.ownerId !== 'user-1') return false;
    if (label && !p.labelIds.includes(label)) return false;
    if (orgId && p.orgId !== orgId) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const listItems = filtered.map(toPersonListItem);
  listItems.sort((a, b) => {
    const av = (a as unknown as Record<string, unknown>)[sort] ?? '';
    const bv = (b as unknown as Record<string, unknown>)[sort] ?? '';
    const cmp = String(av) < String(bv) ? -1 : String(av) > String(bv) ? 1 : 0;
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const total = listItems.length;
  const pageNum = parseInt(page, 10);
  const perPageNum = parseInt(perPage, 10);
  const paginated = req.query.all === 'true' ? listItems : listItems.slice((pageNum - 1) * perPageNum, pageNum * perPageNum);
  res.json({ people: paginated, total, page: pageNum, perPage: perPageNum });
});

// GET /api/people/:id
router.get('/:id', (req: Request, res: Response) => {
  if (req.params.id === 'merge') { res.status(404).json({ error: 'Not found' }); return; }
  const person = people.find((p) => p.id === req.params.id);
  if (!person) { res.status(404).json({ error: 'Person not found' }); return; }

  const base = toPersonListItem(person);
  const activeDeals: ActivePersonDeal[] = deals
    .filter((d) => d.personId === person.id && d.status === 'open')
    .map((d) => {
      const stage = stages.find((s) => s.id === d.stageId);
      return { id: d.id, title: d.title, value: d.value, currency: d.currency, stageName: stage?.name ?? '', nextActivityDate: d.nextActivityDate, nextActivityType: d.nextActivityType };
    });

  const detail: PersonDetail = { ...base, activeDeals };
  res.json(detail);
});

// GET /api/people/:id/feed
router.get('/:id/feed', (req: Request, res: Response) => {
  const person = people.find((p) => p.id === req.params.id);
  if (!person) { res.status(404).json({ error: 'Person not found' }); return; }

  const feedItems: FeedItem[] = [];
  activities.filter((a) => a.personId === person.id).forEach((a) => {
    const owner = OWNER_META[a.ownerId] ?? { name: a.ownerId, initials: '??', color: '#999' };
    feedItems.push({ id: a.id, type: 'activity', activityType: a.type, subject: a.subject, dueDate: a.dueDate, done: a.doneAt !== null, doneAt: a.doneAt, note: a.note ?? '', outcome: (a as Activity & { outcome?: string }).outcome ?? '', ownerName: owner.name, createdAt: a.createdAt } as ActivityFeedItem);
  });
  notes.filter((n) => (n as Note & { personId?: string }).personId === person.id || deals.find((d) => d.personId === person.id && d.id === n.dealId)).forEach((n) => {
    const owner = OWNER_META[n.ownerId] ?? { name: n.ownerId, initials: '??', color: '#999' };
    feedItems.push({ id: n.id, type: 'note', content: n.content, ownerName: owner.name, ownerInitials: owner.initials, ownerColor: owner.color, createdAt: n.createdAt, updatedAt: n.updatedAt } as NoteFeedItem);
  });
  feedItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json(feedItems);
});

// POST /api/people
router.post('/', (req: Request, res: Response) => {
  const { name, email, phone = '', jobTitle = '', orgId = null, ownerId = 'user-1', labelIds = [] } = req.body as Partial<Person>;
  if (!name || !email) { res.status(400).json({ error: 'name and email are required' }); return; }
  const dup = people.find((p) => p.email.toLowerCase() === (email as string).toLowerCase());
  if (dup) { res.status(409).json({ error: 'A contact with this email already exists', existingId: dup.id }); return; }
  const now = new Date().toISOString();
  const newPerson: Person = { id: `person-${uuidv4().slice(0, 8)}`, name: name as string, email: email as string, phone, jobTitle, orgId: orgId ?? null, ownerId, labelIds: labelIds as string[], createdAt: now, updatedAt: now };
  people.push(newPerson);
  res.status(201).json(toPersonListItem(newPerson));
});

// PATCH /api/people/:id
router.patch('/:id', (req: Request, res: Response) => {
  const idx = people.findIndex((p) => p.id === req.params.id);
  if (idx === -1) { res.status(404).json({ error: 'Person not found' }); return; }
  people[idx] = { ...people[idx], ...req.body as Partial<Person>, updatedAt: new Date().toISOString() };
  res.json(toPersonListItem(people[idx]));
});

// PATCH /api/people/bulk
router.patch('/bulk', (req: Request, res: Response) => {
  const { ids, action, ownerId: newOwner, labelId } = req.body as { ids: string[]; action: string; ownerId?: string; labelId?: string };
  if (!Array.isArray(ids)) { res.status(400).json({ error: 'ids required' }); return; }
  let affected = 0;
  const now = new Date().toISOString();
  ids.forEach((id) => {
    const idx = people.findIndex((p) => p.id === id);
    if (idx === -1) return;
    if (action === 'delete') { people.splice(idx, 1); }
    else if (action === 'assignOwner' && newOwner) { people[idx] = { ...people[idx], ownerId: newOwner, updatedAt: now }; }
    else if (action === 'addLabel' && labelId) { if (!people[idx].labelIds.includes(labelId)) people[idx] = { ...people[idx], labelIds: [...people[idx].labelIds, labelId], updatedAt: now }; }
    affected++;
  });
  res.json({ affected });
});

// POST /api/people/:id/notes
router.post('/:id/notes', (req: Request, res: Response) => {
  const person = people.find((p) => p.id === req.params.id);
  if (!person) { res.status(404).json({ error: 'Person not found' }); return; }
  const { content } = req.body as { content: string };
  if (!content?.trim()) { res.status(400).json({ error: 'content required' }); return; }
  const now = new Date().toISOString();
  const newNote = { id: `note-${uuidv4().slice(0, 8)}`, content: content.trim(), dealId: '', personId: person.id, ownerId: person.ownerId, createdAt: now, updatedAt: now };
  (notes as (Note & { personId?: string })[]).push(newNote as Note);
  res.status(201).json(newNote);
});

// POST /api/people/:id/activities
router.post('/:id/activities', (req: Request, res: Response) => {
  const person = people.find((p) => p.id === req.params.id);
  if (!person) { res.status(404).json({ error: 'Person not found' }); return; }
  const { type, subject, dueDate = null, note = '' } = req.body as Partial<Activity>;
  if (!type || !subject) { res.status(400).json({ error: 'type and subject required' }); return; }
  const now = new Date().toISOString();
  const act: Activity = { id: `act-${uuidv4().slice(0, 8)}`, type, subject: subject as string, dueDate: dueDate ?? null, dueTime: null, dealId: null, personId: person.id, orgId: person.orgId, ownerId: person.ownerId, done: false, doneAt: null, note: note as string, outcome: '', createdAt: now };
  activities.push(act);
  res.status(201).json(act);
});

// POST /api/people/merge
router.post('/merge', (req: Request, res: Response) => {
  const { keepId, mergeId } = req.body as { keepId: string; mergeId: string };
  const mergeIdx = people.findIndex((p) => p.id === mergeId);
  if (mergeIdx === -1) { res.status(404).json({ error: 'mergeId not found' }); return; }
  deals.forEach((d) => { if (d.personId === mergeId) d.personId = keepId; });
  activities.forEach((a) => { if (a.personId === mergeId) a.personId = keepId; });
  people.splice(mergeIdx, 1);
  res.json({ ok: true });
});

// GET /api/labels
router.get('/labels', (_req: Request, res: Response) => {
  res.json(labelsData);
});

// Helper to get initials color for people
export function personInitialsColor(name: string): string {
  const colors = ['#6F6EE8', '#0A9E5F', '#E15A51', '#FB923C', '#3B82F6', '#8B5CF6'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

export { people, nameInitials };
export default router;
