import type { DealListFilters } from './deal';

export interface SavedView {
  id: string;
  name: string;
  entity: 'deals';
  filters: DealListFilters;
  createdAt: string;
}

export interface BulkActionRequest {
  ids: string[];
  action: 'delete' | 'assignOwner';
  ownerId?: string;
}
