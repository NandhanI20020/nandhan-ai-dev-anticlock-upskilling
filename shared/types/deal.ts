export type { ActivityType } from './activity';
import type { ActivityType } from './activity';

export type DealStatus = 'open' | 'won' | 'lost';

export interface Deal {
  id: string;
  title: string;
  value: number;
  currency: string;
  stageId: string;
  pipelineId: string;
  orgId: string | null;
  personId: string | null;
  ownerId: string;
  status: DealStatus;
  probability: number;
  expectedCloseDate: string | null;
  source: string | null;
  lostReason: string | null;
  wonTime: string | null;
  lostTime: string | null;
  labels: string[];
  nextActivityDate: string | null;
  nextActivityType: ActivityType | null;
  lastActivityDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DealListItem extends Deal {
  stageName: string;
  stageOrder: number;
  pipelineTotalStages: number;
  orgName: string | null;
  ownerName: string;
  ownerInitials: string;
  ownerColor: string;
  rottingDays: number | null;
}

export interface DealDetail extends DealListItem {
  pipelineName: string;
  orgAddress: string | null;
  personName: string | null;
  personEmail: string | null;
  personPhone: string | null;
  personJobTitle: string | null;
}

export interface DealListFilters {
  status?: 'open' | 'won' | 'lost' | 'all';
  myDeals?: boolean;
  ownerId?: string;
  stageId?: string;
  label?: string;
  valueMin?: number;
  valueMax?: number;
  closeDateFrom?: string;
  closeDateTo?: string;
  source?: string;
  search?: string;
  pipelineId?: string;
}

export interface PaginatedDealsResponse {
  deals: DealListItem[];
  total: number;
  page: number;
  perPage: number;
}

export interface StageTimeEntry {
  id: string;
  dealId: string;
  stageId: string;
  enteredAt: string;
  exitedAt: string | null;
}

export interface Note {
  id: string;
  content: string;
  dealId: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface DealStageInfo {
  id: string;
  name: string;
  order: number;
  isCurrent: boolean;
  rottingDays: number | null;
  enteredAt: string | null;
  exitedAt: string | null;
  daysInStage: number;
}

export type SystemEventKind = 'stage_change' | 'deal_created' | 'deal_won' | 'deal_lost' | 'deal_reopened';

export interface ActivityFeedItem {
  id: string;
  type: 'activity';
  activityType: ActivityType;
  subject: string;
  dueDate: string | null;
  done: boolean;
  doneAt: string | null;
  note: string;
  outcome: string;
  ownerName: string;
  createdAt: string;
}

export interface NoteFeedItem {
  id: string;
  type: 'note';
  content: string;
  ownerName: string;
  ownerInitials: string;
  ownerColor: string;
  createdAt: string;
  updatedAt: string;
}

export interface SystemFeedItem {
  id: string;
  type: 'system';
  kind: SystemEventKind;
  message: string;
  createdAt: string;
}

export type FeedItem = ActivityFeedItem | NoteFeedItem | SystemFeedItem;
