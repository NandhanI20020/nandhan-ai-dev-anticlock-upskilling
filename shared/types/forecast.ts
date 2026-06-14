export type ForecastRange = 'this_quarter' | 'next_quarter' | 'this_year';

export interface ForecastDeal {
  id: string;
  title: string;
  orgName: string | null;
  ownerName: string;
  value: number;
  currency: string;
  probability: number;
  weightedValue: number;
  expectedCloseDate: string;
}

export interface ForecastMonth {
  label: string;
  year: number;
  month: number;
  deals: ForecastDeal[];
  totalValue: number;
  weightedValue: number;
  quotaTarget: number;
  quotaPercent: number;
}

export interface ForecastResponse {
  months: ForecastMonth[];
  range: ForecastRange;
}
