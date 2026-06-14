import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import savedViewsData from '../../data/savedViews.json';
import type { SavedView } from '../../../shared/types/savedView';

const router = Router();
const savedViews: SavedView[] = (savedViewsData as SavedView[]).map((v) => ({ ...v }));

// GET /api/saved-views?entity=deals
router.get('/', (req: Request, res: Response) => {
  const { entity } = req.query as { entity?: string };
  const results = entity ? savedViews.filter((v) => v.entity === entity) : savedViews;
  res.json(results);
});

// POST /api/saved-views
router.post('/', (req: Request, res: Response) => {
  const { name, entity, filters } = req.body as Partial<SavedView>;
  if (!name || !entity || !filters) {
    res.status(400).json({ error: 'name, entity, and filters are required' }); return;
  }
  const newView: SavedView = {
    id: `view-${uuidv4().slice(0, 8)}`,
    name,
    entity,
    filters,
    createdAt: new Date().toISOString(),
  };
  savedViews.push(newView);
  res.status(201).json(newView);
});

// DELETE /api/saved-views/:id
router.delete('/:id', (req: Request, res: Response) => {
  const idx = savedViews.findIndex((v) => v.id === req.params.id);
  if (idx === -1) { res.status(404).json({ error: 'View not found' }); return; }
  savedViews.splice(idx, 1);
  res.status(204).send();
});

export default router;
