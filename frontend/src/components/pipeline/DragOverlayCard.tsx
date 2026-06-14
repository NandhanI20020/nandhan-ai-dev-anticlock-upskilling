import type { DealListItem } from '../../../../shared/types/deal';
import DealCard from './DealCard';

interface Props {
  deal: DealListItem;
}

export default function DragOverlayCard({ deal }: Props) {
  return <DealCard deal={deal} isDragOverlay />;
}
