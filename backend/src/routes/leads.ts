import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import leadsData from '../../data/leads.json';
import dealsData from '../../data/deals.json';
import pipelinesData from '../../data/pipelines.json';
import stagesData from '../../data/stages.json';
import type { Lead, LeadStatus, LeadsResponse } from '../../../shared/types/lead';

const router = Router();

interface Deal { id: string; title: string; value: number; stageId: string; pipelineId: string; ownerId: string; status: string; orgId: null; personId: null; currency: string; probability: number; expectedCloseDate: null; source: string | null; lostReason: null; wonTime: null; lostTime: null; labels: string[]; nextActivityDate: null; nextActivityType: null; lastActivityDate: null; createdAt: string; updatedAt: string; }
interface Pipeline { id: string; name: string; }
interface Stage { id: string; name: string; pipelineId: string; order: number; }

const leads: Lead[] = (leadsData as Lead[]).map((l) => ({ ...l }));
const deals: Deal[] = dealsData as unknown as Deal[];
const pipelines: Pipeline[] = pipelinesData as Pipeline[];
const stages: Stage[] = stagesData as Stage[];

// GET /api/leads
router.get('/', (req: Request, res: Response) => {
  const { status, source, sort = 'intentScore', sortDir = 'desc' } = req.query as Record<string, string>;

  let filtered = leads.filter((l) => {
    if (status && status !== 'all' && l.status !== status) return false;
    if (source && l.source !== source) return false;
    return true;
  });

  const scoreOrder: Record<string, number> = { high: 3, medium: 2, low: 1 };
  filtered.sort((a, b) => {
    if (sort === 'intentScore') {
      const diff = (scoreOrder[b.intentScore] ?? 0) - (scoreOrder[a.intentScore] ?? 0);
      return sortDir === 'asc' ? -diff : diff;
    }
    const av = (a as unknown as Record<string, unknown>)[sort] ?? ''; const bv = (b as unknown as Record<string, unknown>)[sort] ?? '';
    const cmp = String(av) < String(bv) ? -1 : String(av) > String(bv) ? 1 : 0;
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const incomingCount = leads.filter((l) => l.status === 'incoming').length;
  const estimatedValue = leads.filter((l) => l.status === 'incoming').reduce((s, l) => s + l.estimatedValue, 0);
  const convertedCount = leads.filter((l) => l.status === 'converted').length;
  const responseRate = leads.length > 0 ? Math.round(((leads.length - incomingCount) / leads.length) * 100) : 0;

  const sourceCounts: Record<string, number> = {};
  leads.forEach((l) => { sourceCounts[l.source] = (sourceCounts[l.source] ?? 0) + 1; });
  const sourceDistribution = Object.entries(sourceCounts).map(([source, count]) => ({ source, count })).sort((a, b) => b.count - a.count);

  const response: LeadsResponse = {
    leads: filtered,
    kpis: { incomingCount, estimatedValue, responseRate, convertedCount },
    sourceDistribution,
  };
  res.json(response);
});

// POST /api/leads/:id/convert
router.post('/:id/convert', (req: Request, res: Response) => {
  const lead = leads.find((l) => l.id === req.params.id);
  if (!lead) { res.status(404).json({ error: 'Lead not found' }); return; }

  const { title, value, pipelineId, stageId } = req.body as { title: string; value: number; pipelineId: string; stageId: string };
  if (!title || !pipelineId || !stageId) { res.status(400).json({ error: 'title, pipelineId, stageId required' }); return; }

  const pipeline = pipelines.find((p) => p.id === pipelineId);
  const stage = stages.find((s) => s.id === stageId);
  if (!pipeline || !stage) { res.status(400).json({ error: 'Invalid pipeline or stage' }); return; }

  const now = new Date().toISOString();
  const newDeal: Deal = { id: `deal-${uuidv4().slice(0, 8)}`, title, value: value ?? lead.estimatedValue, stageId, pipelineId, ownerId: 'user-1', status: 'open', orgId: null, personId: null, currency: 'USD', probability: 20, expectedCloseDate: null, source: lead.source, lostReason: null, wonTime: null, lostTime: null, labels: [], nextActivityDate: null, nextActivityType: null, lastActivityDate: null, createdAt: now, updatedAt: now };
  deals.push(newDeal);
  lead.status = 'converted';
  res.status(201).json({ lead, deal: newDeal });
});

export default router;
