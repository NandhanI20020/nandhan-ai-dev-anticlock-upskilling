export interface ArchivedDeal {
  id: string;
  title: string;
  orgName: string | null;
  value: number;
  currency: string;
  status: 'won' | 'lost';
  lostReason: string | null;
  source: string | null;
  closedAt: string;
  dealCycleDays: number;
  ownerName: string;
  ownerInitials: string;
  ownerColor: string;
}

export interface ArchiveKPIs {
  totalArchived: number;
  wonCount: number;
  wonRevenue: number;
  lostCount: number;
  lostValue: number;
  winRate: number;
  avgCycleDays: number;
}

export interface WinReasonEntry {
  source: string;
  count: number;
  totalValue: number;
}

export interface LossReasonEntry {
  reason: string;
  count: number;
  percent: number;
}

export interface ArchiveResponse {
  deals: ArchivedDeal[];
  kpis: ArchiveKPIs;
  winReasons: WinReasonEntry[];
  lossReasons: LossReasonEntry[];
  total: number;
}
