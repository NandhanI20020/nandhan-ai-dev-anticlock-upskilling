interface Props {
  stageOrder: number;
  totalStages: number;
}

export default function StageProgressCell({ stageOrder, totalStages }: Props) {
  if (totalStages === 0) return null;
  return (
    <div className="flex gap-0.5 items-center">
      {Array.from({ length: totalStages }, (_, i) => (
        <div
          key={i}
          className="h-1.5 rounded-full flex-1"
          style={{
            backgroundColor: i < stageOrder ? '#6F6EE8' : '#E5E7EB',
            minWidth: 6,
          }}
        />
      ))}
    </div>
  );
}
