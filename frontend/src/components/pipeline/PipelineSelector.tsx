import type { PipelineWithStages } from '../../../../shared/types/pipeline';

interface Props {
  pipelines: PipelineWithStages[];
  activePipelineId: string;
  onChange: (id: string) => void;
}

export default function PipelineSelector({ pipelines, activePipelineId, onChange }: Props) {
  return (
    <div className="flex gap-1">
      {pipelines.map((p) => (
        <button
          key={p.id}
          onClick={() => onChange(p.id)}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
            p.id === activePipelineId
              ? 'text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          style={p.id === activePipelineId ? { backgroundColor: '#6F6EE8' } : {}}
        >
          {p.name}
        </button>
      ))}
    </div>
  );
}
