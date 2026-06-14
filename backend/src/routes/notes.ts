import { Router, Request, Response } from 'express';
import { notes } from './deals';

const router = Router();

router.put('/:id', (req: Request, res: Response) => {
  const note = notes.find((n) => n.id === req.params.id);
  if (!note) { res.status(404).json({ error: 'Note not found' }); return; }
  const { content } = req.body as { content: string };
  if (!content?.trim()) { res.status(400).json({ error: 'content is required' }); return; }
  note.content = content.trim();
  note.updatedAt = new Date().toISOString();
  res.json(note);
});

router.delete('/:id', (req: Request, res: Response) => {
  const idx = notes.findIndex((n) => n.id === req.params.id);
  if (idx === -1) { res.status(404).json({ error: 'Note not found' }); return; }
  notes.splice(idx, 1);
  res.status(204).send();
});

export default router;
