import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import dealsData from '../../data/deals.json';
import stagesData from '../../data/stages.json';
import organizationsData from '../../data/organizations.json';
import pipelinesData from '../../data/pipelines.json';
import peopleData from '../../data/people.json';
import notesData from '../../data/notes.json';
import activitiesData from '../../data/activities.json';
import stageTimeEntriesData from '../../data/stageTimeEntries.json';
import type { Deal, DealListItem, DealDetail, StageTimeEntry, Note, DealStageInfo, FeedItem, ActivityFeedItem, NoteFeedItem, SystemFeedItem } from '../../../shared/types/deal';
import type { Stage, Pipeline } from '../../../shared/types/pipeline';
import type { Activity } from '../../../shared/types/activity';

const router = Router();

interface Person { id: string; name: string; email: string; phone: string; jobTitle: string; orgId: string; }
interface Organization { id: string; name: string; address: string; }

const deals: Deal[] = (dealsData as unknown as Deal[]).map((d) => ({ ...d }));
const stages: Stage[] = stagesData as Stage[];
const orgs: Organization[] = organizationsData as Organization[];
const pipelines: Pipeline[] = pipelinesData as Pipeline[];
const people: Person[] = peopleData as Person[];
const notes: Note[] = (notesData as Note[]).map((n) => ({ ...n }));
const activities: Activity[] = (activitiesData as unknown as Activity[]).map((a) => ({ ...a, dueTime: null, outcome: '' }));
const stageTimeEntries: StageTimeEntry[] = (stageTimeEntriesData as StageTimeEntry[]).map((e) => ({ ...e }));

const OWNER_META: Record<string, { name: string; initials: string; color: string }> = {
  'user-1': { name: 'Alice Johnson', initials: 'AJ', color: '#6F6EE8' },
  'user-2': { name: 'Bob Smith',     initials: 'BS', color: '#0A9E5F' },
};

function daysBetween(from: string, to: string | null): number {
  const end = to ? new Date(to) : new Date();
  return Math.max(0, Math.floor((end.getTime() - new Date(from).getTime()) / 86_400_000));
}

function toDealListItem(deal: Deal): DealListItem {
  const stage = stages.find((s) => s.id === deal.stageId);
  const pipelineStages = stages.filter((s) => s.pipelineId === deal.pipelineId);
  const org = orgs.find((o) => o.id === deal.orgId);
  const owner = OWNER_META[deal.ownerId] ?? { name: deal.ownerId, initials: '??', color: '#999' };
  return {
    ...deal,
    stageName: stage?.name ?? '',
    stageOrder: stage?.order ?? 0,
    pipelineTotalStages: pipelineStages.length,
    orgName: org?.name ?? null,
    ownerName: owner.name,
    ownerInitials: owner.initials,
    ownerColor: owner.color,
    rottingDays: stage?.rottingDays ?? null,
  };
}

function toDealDetail(deal: Deal): DealDetail {
  const base = toDealListItem(deal);
  const pipeline = pipelines.find((p) => p.id === deal.pipelineId);
  const org = orgs.find((o) => o.id === deal.orgId);
  const person = people.find((p) => p.id === deal.personId);
  return {
    ...base,
    pipelineName: pipeline?.name ?? '',
    orgAddress: org?.address ?? null,
    personName: person?.name ?? null,
    personEmail: person?.email ?? null,
    personPhone: person?.phone ?? null,
    personJobTitle: person?.jobTitle ?? null,
  };
}

// GET /api/deals — list with full filter/sort/paginate support
router.get('/', (req: Request, res: Response) => {
  const {
    pipelineId, stageId, status = 'open', search,
    page = '1', perPage = '15',
    sort = 'createdAt', sortDir = 'desc',
    ownerId, label, valueMin, valueMax,
    closeDateFrom, closeDateTo, source,
    myDeals,
  } = req.query as Record<string, string>;

  let filtered = deals.filter((d) => {
    if (status !== 'all' && d.status !== status) return false;
    if (pipelineId && d.pipelineId !== pipelineId) return false;
    if (stageId && d.stageId !== stageId) return false;
    if (search && !d.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (ownerId && d.ownerId !== ownerId) return false;
    if (myDeals === 'true' && d.ownerId !== 'user-1') return false;
    if (label && !d.labels.includes(label)) return false;
    if (valueMin && d.value < parseFloat(valueMin)) return false;
    if (valueMax && d.value > parseFloat(valueMax)) return false;
    if (closeDateFrom && d.expectedCloseDate && d.expectedCloseDate < closeDateFrom) return false;
    if (closeDateTo && d.expectedCloseDate && d.expectedCloseDate > closeDateTo) return false;
    if (source && d.source !== source) return false;
    return true;
  });

  const listItems = filtered.map(toDealListItem);

  // Sort
  listItems.sort((a, b) => {
    let av: string | number | null = null;
    let bv: string | number | null = null;
    switch (sort) {
      case 'title':           av = a.title;           bv = b.title;           break;
      case 'value':           av = a.value;           bv = b.value;           break;
      case 'expectedCloseDate': av = a.expectedCloseDate; bv = b.expectedCloseDate; break;
      case 'updatedAt':       av = a.updatedAt;       bv = b.updatedAt;       break;
      case 'stageName':       av = a.stageName;       bv = b.stageName;       break;
      case 'orgName':         av = a.orgName ?? '';   bv = b.orgName ?? '';   break;
      case 'ownerName':       av = a.ownerName;       bv = b.ownerName;       break;
      default:                av = a.createdAt;       bv = b.createdAt;       break;
    }
    if (av === null) av = '';
    if (bv === null) bv = '';
    const cmp = av < bv ? -1 : av > bv ? 1 : 0;
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const total = listItems.length;
  const pageNum = parseInt(page, 10);
  const perPageNum = parseInt(perPage, 10);

  const paginated = req.query.all === 'true'
    ? listItems
    : listItems.slice((pageNum - 1) * perPageNum, pageNum * perPageNum);

  res.json({ deals: paginated, total, page: pageNum, perPage: perPageNum });
});

// PATCH /api/deals/bulk — bulk delete or assign owner
router.patch('/bulk', (req: Request, res: Response) => {
  const { ids, action, ownerId: newOwnerId } = req.body as { ids: string[]; action: string; ownerId?: string };

  if (!Array.isArray(ids) || ids.length === 0) {
    res.status(400).json({ error: 'ids array is required' }); return;
  }

  if (action === 'delete') {
    let affected = 0;
    ids.forEach((id) => {
      const idx = deals.findIndex((d) => d.id === id);
      if (idx !== -1) { deals.splice(idx, 1); affected++; }
    });
    res.json({ affected }); return;
  }

  if (action === 'assignOwner') {
    if (!newOwnerId) { res.status(400).json({ error: 'ownerId is required for assignOwner action' }); return; }
    let affected = 0;
    const now = new Date().toISOString();
    ids.forEach((id) => {
      const idx = deals.findIndex((d) => d.id === id);
      if (idx !== -1) { deals[idx] = { ...deals[idx], ownerId: newOwnerId, updatedAt: now }; affected++; }
    });
    res.json({ affected }); return;
  }

  res.status(400).json({ error: `Unknown action: ${action}` });
});

// GET /api/deals/:id/stages — stage progress bar data
router.get('/:id/stages', (req: Request, res: Response) => {
  const deal = deals.find((d) => d.id === req.params.id);
  if (!deal) { res.status(404).json({ error: 'Deal not found' }); return; }

  const pipelineStages = stages.filter((s) => s.pipelineId === deal.pipelineId).sort((a, b) => a.order - b.order);

  const result: DealStageInfo[] = pipelineStages.map((stage) => {
    const entries = stageTimeEntries.filter((e) => e.dealId === deal.id && e.stageId === stage.id);
    const enteredAt = entries.length > 0 ? entries[0].enteredAt : null;
    const exitedAt = entries.find((e) => e.exitedAt === null) ? null : (entries[entries.length - 1]?.exitedAt ?? null);
    const daysInStage = entries.reduce((sum, e) => sum + daysBetween(e.enteredAt, e.exitedAt), 0);
    return {
      id: stage.id,
      name: stage.name,
      order: stage.order,
      isCurrent: stage.id === deal.stageId,
      rottingDays: stage.rottingDays,
      enteredAt,
      exitedAt,
      daysInStage,
    };
  });

  res.json(result);
});

// GET /api/deals/:id/feed — aggregated activity feed
router.get('/:id/feed', (req: Request, res: Response) => {
  const deal = deals.find((d) => d.id === req.params.id);
  if (!deal) { res.status(404).json({ error: 'Deal not found' }); return; }

  const feedItems: FeedItem[] = [];

  // Activities
  activities
    .filter((a) => a.dealId === deal.id)
    .forEach((a) => {
      const owner = OWNER_META[a.ownerId] ?? { name: a.ownerId, initials: '??', color: '#999' };
      const item: ActivityFeedItem = {
        id: a.id,
        type: 'activity',
        activityType: a.type,
        subject: a.subject,
        dueDate: a.dueDate,
        done: a.doneAt !== null,
        doneAt: a.doneAt,
        note: a.note ?? '',
        outcome: (a as Activity & { outcome?: string }).outcome ?? '',
        ownerName: owner.name,
        createdAt: a.createdAt,
      };
      feedItems.push(item);
    });

  // Notes
  notes
    .filter((n) => n.dealId === deal.id)
    .forEach((n) => {
      const owner = OWNER_META[n.ownerId] ?? { name: n.ownerId, initials: '??', color: '#999' };
      const item: NoteFeedItem = {
        id: n.id,
        type: 'note',
        content: n.content,
        ownerName: owner.name,
        ownerInitials: owner.initials,
        ownerColor: owner.color,
        createdAt: n.createdAt,
        updatedAt: n.updatedAt,
      };
      feedItems.push(item);
    });

  // System events: deal_created
  feedItems.push({
    id: `sys-created-${deal.id}`,
    type: 'system',
    kind: 'deal_created',
    message: 'Deal created',
    createdAt: deal.createdAt,
  } as SystemFeedItem);

  // System events: stage changes (from closed stageTimeEntries)
  stageTimeEntries
    .filter((e) => e.dealId === deal.id && e.exitedAt !== null)
    .forEach((e) => {
      const fromStage = stages.find((s) => s.id === e.stageId);
      const entries = stageTimeEntries.filter((x) => x.dealId === deal.id);
      const idx = entries.indexOf(e);
      const nextEntry = entries[idx + 1];
      const toStage = nextEntry ? stages.find((s) => s.id === nextEntry.stageId) : null;
      feedItems.push({
        id: `sys-stage-${e.id}`,
        type: 'system',
        kind: 'stage_change',
        message: toStage
          ? `Moved from ${fromStage?.name ?? e.stageId} to ${toStage.name}`
          : `Left stage ${fromStage?.name ?? e.stageId}`,
        createdAt: e.exitedAt!,
      } as SystemFeedItem);
    });

  // System events: won/lost
  if (deal.status === 'won' && deal.wonTime) {
    feedItems.push({ id: `sys-won-${deal.id}`, type: 'system', kind: 'deal_won', message: 'Deal marked as Won', createdAt: deal.wonTime } as SystemFeedItem);
  }
  if (deal.status === 'lost' && deal.lostTime) {
    feedItems.push({ id: `sys-lost-${deal.id}`, type: 'system', kind: 'deal_lost', message: `Deal marked as Lost${deal.lostReason ? `: ${deal.lostReason}` : ''}`, createdAt: deal.lostTime } as SystemFeedItem);
  }

  feedItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json(feedItems);
});

// GET /api/deals/:id — single deal detail
router.get('/:id', (req: Request, res: Response) => {
  const deal = deals.find((d) => d.id === req.params.id);
  if (!deal) { res.status(404).json({ error: 'Deal not found' }); return; }
  res.json(toDealDetail(deal));
});

// POST /api/deals — create deal
router.post('/', (req: Request, res: Response) => {
  const { title, value, currency = 'USD', stageId, pipelineId, orgId = null, personId = null, ownerId = 'user-1', expectedCloseDate = null, source = null } = req.body as Partial<Deal>;

  if (!title || !stageId || !pipelineId) { res.status(400).json({ error: 'title, stageId, pipelineId are required' }); return; }

  const newDeal: Deal = {
    id: `deal-${uuidv4().slice(0, 8)}`,
    title: title as string,
    value: typeof value === 'number' ? value : 0,
    currency,
    stageId: stageId as string,
    pipelineId: pipelineId as string,
    orgId: orgId ?? null,
    personId: personId ?? null,
    ownerId: (ownerId as string) ?? 'user-1',
    status: 'open',
    probability: 20,
    expectedCloseDate: expectedCloseDate ?? null,
    source: source ?? null,
    lostReason: null,
    wonTime: null,
    lostTime: null,
    labels: [],
    nextActivityDate: null,
    nextActivityType: null,
    lastActivityDate: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  deals.push(newDeal);
  stageTimeEntries.push({ id: `ste-${uuidv4().slice(0, 8)}`, dealId: newDeal.id, stageId: newDeal.stageId, enteredAt: newDeal.createdAt, exitedAt: null });
  res.status(201).json(toDealListItem(newDeal));
});

// PATCH /api/deals/:id/stage — move to a different stage
router.patch('/:id/stage', (req: Request, res: Response) => {
  const idx = deals.findIndex((d) => d.id === req.params.id);
  if (idx === -1) { res.status(404).json({ error: 'Deal not found' }); return; }

  const { stageId } = req.body as { stageId: string };
  const deal = deals[idx];
  const targetStage = stages.find((s) => s.id === stageId && s.pipelineId === deal.pipelineId);
  if (!targetStage) { res.status(400).json({ error: 'Stage not in pipeline' }); return; }

  const now = new Date().toISOString();
  const openEntry = stageTimeEntries.find((e) => e.dealId === deal.id && e.exitedAt === null);
  if (openEntry) openEntry.exitedAt = now;

  stageTimeEntries.push({ id: `ste-${uuidv4().slice(0, 8)}`, dealId: deal.id, stageId, enteredAt: now, exitedAt: null });
  deals[idx] = { ...deal, stageId, updatedAt: now };
  res.json(toDealDetail(deals[idx]));
});

// PATCH /api/deals/:id — update deal fields
router.patch('/:id', (req: Request, res: Response) => {
  const idx = deals.findIndex((d) => d.id === req.params.id);
  if (idx === -1) { res.status(404).json({ error: 'Deal not found' }); return; }
  deals[idx] = { ...deals[idx], ...req.body as Partial<Deal>, updatedAt: new Date().toISOString() };
  res.json(toDealDetail(deals[idx]));
});

// PATCH /api/deals/:id/won
router.patch('/:id/won', (req: Request, res: Response) => {
  const idx = deals.findIndex((d) => d.id === req.params.id);
  if (idx === -1) { res.status(404).json({ error: 'Deal not found' }); return; }
  deals[idx] = { ...deals[idx], status: 'won', wonTime: new Date().toISOString(), updatedAt: new Date().toISOString() };
  res.json(toDealDetail(deals[idx]));
});

// PATCH /api/deals/:id/lost
router.patch('/:id/lost', (req: Request, res: Response) => {
  const idx = deals.findIndex((d) => d.id === req.params.id);
  if (idx === -1) { res.status(404).json({ error: 'Deal not found' }); return; }
  const { lostReason = null } = req.body as { lostReason?: string };
  deals[idx] = { ...deals[idx], status: 'lost', lostReason, lostTime: new Date().toISOString(), updatedAt: new Date().toISOString() };
  res.json(toDealDetail(deals[idx]));
});

// POST /api/deals/:id/activities — log an activity
router.post('/:id/activities', (req: Request, res: Response) => {
  const deal = deals.find((d) => d.id === req.params.id);
  if (!deal) { res.status(404).json({ error: 'Deal not found' }); return; }

  const { type, subject, dueDate = null, dueTime = null, note = '', outcome = '' } = req.body as Partial<Activity>;
  if (!type || !subject) { res.status(400).json({ error: 'type and subject are required' }); return; }

  const now = new Date().toISOString();
  const newActivity: Activity = {
    id: `act-${uuidv4().slice(0, 8)}`,
    type,
    subject: subject as string,
    dueDate: dueDate ?? null,
    dueTime: dueTime ?? null,
    dealId: deal.id,
    personId: deal.personId,
    orgId: deal.orgId,
    ownerId: deal.ownerId,
    done: false,
    doneAt: null,
    note: note as string,
    outcome: outcome as string,
    createdAt: now,
  };

  activities.push(newActivity);
  const dealIdx = deals.findIndex((d) => d.id === deal.id);
  deals[dealIdx] = { ...deals[dealIdx], lastActivityDate: now, nextActivityDate: dueDate ?? null, nextActivityType: type, updatedAt: now };
  res.status(201).json(newActivity);
});

// POST /api/deals/:id/notes — add a note
router.post('/:id/notes', (req: Request, res: Response) => {
  const deal = deals.find((d) => d.id === req.params.id);
  if (!deal) { res.status(404).json({ error: 'Deal not found' }); return; }

  const { content } = req.body as { content: string };
  if (!content?.trim()) { res.status(400).json({ error: 'content is required' }); return; }

  const now = new Date().toISOString();
  const newNote: Note = {
    id: `note-${uuidv4().slice(0, 8)}`,
    content: content.trim(),
    dealId: deal.id,
    ownerId: deal.ownerId,
    createdAt: now,
    updatedAt: now,
  };

  notes.push(newNote);
  res.status(201).json(newNote);
});

// PATCH /api/deals/:id/reopen
router.patch('/:id/reopen', (req: Request, res: Response) => {
  const idx = deals.findIndex((d) => d.id === req.params.id);
  if (idx === -1) { res.status(404).json({ error: 'Deal not found' }); return; }
  const deal = deals[idx];
  const pipelineFirstStage = stages.filter((s) => s.pipelineId === deal.pipelineId).sort((a, b) => a.order - b.order)[0];
  const stageId = pipelineFirstStage?.id ?? deal.stageId;
  const now = new Date().toISOString();
  const openEntry = stageTimeEntries.find((e) => e.dealId === deal.id && e.exitedAt === null);
  if (openEntry) openEntry.exitedAt = now;
  stageTimeEntries.push({ id: `ste-${uuidv4().slice(0, 8)}`, dealId: deal.id, stageId, enteredAt: now, exitedAt: null });
  deals[idx] = { ...deal, status: 'open', lostReason: null, lostTime: null, stageId, updatedAt: now };
  res.json(toDealDetail(deals[idx]));
});

// DELETE /api/deals/:id
router.delete('/:id', (req: Request, res: Response) => {
  const idx = deals.findIndex((d) => d.id === req.params.id);
  if (idx === -1) { res.status(404).json({ error: 'Deal not found' }); return; }
  deals.splice(idx, 1);
  res.status(204).send();
});

export { notes };
export default router;
