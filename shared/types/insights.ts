export type DatePreset = 'this_month' | 'last_month' | 'this_quarter' | 'last_quarter' | 'this_year' | 'custom';

export interface DashboardStats {
  openPipelineValue: number;
  openPipelineTrend: number;
  wonRevenue: number;
  wonRevenueTrend: number;
  activitiesToday: number;
  activitiesTodayTrend: number;
  avgDealAgeDays: number;
  avgDealAgeTrend: number;
}

export interface StageDistribution {
  stageName: string;
  dealCount: number;
  totalValue: number;
}

export interface WinLossRatio {
  won: number;
  lost: number;
  winRate: number;
}

export interface ActivityByDay {
  date: string;
  call: number;
  meeting: number;
  task: number;
  email: number;
  deadline: number;
}

export interface RecentDeal {
  id: string;
  title: string;
  orgName: string | null;
  value: number;
  currency: string;
  stageName: string;
  updatedAt: string;
}

export interface DashboardResponse {
  stats: DashboardStats;
  stageDistribution: StageDistribution[];
  winLoss: WinLossRatio;
  activityTimeline: ActivityByDay[];
  recentDeals: RecentDeal[];
}
