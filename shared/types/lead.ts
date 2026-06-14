export type IntentScore = 'high' | 'medium' | 'low';
export type LeadStatus = 'incoming' | 'contacted' | 'converted' | 'disqualified';

export interface Lead {
  id: string;
  name: string;
  contactName: string;
  email: string;
  source: string;
  intentScore: IntentScore;
  estimatedValue: number;
  status: LeadStatus;
  createdAt: string;
  notes: string;
}

export interface LeadKPIs {
  incomingCount: number;
  estimatedValue: number;
  responseRate: number;
  convertedCount: number;
}

export interface LeadConvertRequest {
  leadId: string;
  title: string;
  value: number;
  pipelineId: string;
  stageId: string;
}

export interface SourceDistribution {
  source: string;
  count: number;
}

export interface LeadsResponse {
  leads: Lead[];
  kpis: LeadKPIs;
  sourceDistribution: SourceDistribution[];
}
