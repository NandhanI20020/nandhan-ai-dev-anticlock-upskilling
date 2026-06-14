import { Router, Request, Response } from 'express';
import pipelinesData from '../../data/pipelines.json';
import stagesData from '../../data/stages.json';
import { Pipeline, Stage, PipelineWithStages } from '../../../shared/types/pipeline';

const router = Router();

const pipelines: Pipeline[] = pipelinesData as Pipeline[];
const stages: Stage[] = stagesData as Stage[];

router.get('/', (_req: Request, res: Response) => {
  const withStages: PipelineWithStages[] = pipelines.map((p) => ({
    ...p,
    stages: stages.filter((s) => s.pipelineId === p.id).sort((a, b) => a.order - b.order),
  }));
  res.json(withStages);
});

router.get('/:id', (req: Request, res: Response) => {
  const pipeline = pipelines.find((p) => p.id === req.params.id);
  if (!pipeline) {
    res.status(404).json({ error: 'Pipeline not found' });
    return;
  }
  const withStages: PipelineWithStages = {
    ...pipeline,
    stages: stages.filter((s) => s.pipelineId === pipeline.id).sort((a, b) => a.order - b.order),
  };
  res.json(withStages);
});

export default router;
