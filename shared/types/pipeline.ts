export interface Pipeline {
  id: string;
  name: string;
  isDefault: boolean;
  ownerId: string;
  stageIds: string[];
  createdAt: string;
}

export interface Stage {
  id: string;
  name: string;
  order: number;
  pipelineId: string;
  rottingDays: number | null;
}

export interface PipelineWithStages extends Pipeline {
  stages: Stage[];
}
