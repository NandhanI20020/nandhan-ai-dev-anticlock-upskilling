import { useRef, useEffect } from 'react';
import { Trophy, XCircle, Trash2 } from 'lucide-react';

interface Props {
  dealId: string;
  pipelineId: string;
  onWon: () => void;
  onLost: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export default function DealCardMenu({ onWon, onLost, onDelete, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute right-0 top-6 z-50 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-36"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={onWon}
        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-gray-50 cursor-pointer"
        style={{ color: '#0A9E5F' }}
      >
        <Trophy size={14} /> Mark Won
      </button>
      <button
        onClick={onLost}
        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-gray-50 cursor-pointer"
        style={{ color: '#E15A51' }}
      >
        <XCircle size={14} /> Mark Lost
      </button>
      <div className="h-px bg-gray-100 my-1" />
      <button
        onClick={onDelete}
        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-gray-50 cursor-pointer text-gray-500"
      >
        <Trash2 size={14} /> Delete
      </button>
    </div>
  );
}
