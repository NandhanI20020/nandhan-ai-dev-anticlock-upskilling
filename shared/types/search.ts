export type SearchEntityType = 'deal' | 'person' | 'org';

export interface SearchResult {
  id: string;
  type: SearchEntityType;
  title: string;
  subtitle: string;
  url: string;
}

export interface SearchResponse {
  deals: SearchResult[];
  people: SearchResult[];
  orgs: SearchResult[];
}

export interface RecentlyViewedItem {
  id: string;
  type: SearchEntityType;
  title: string;
  subtitle: string;
  url: string;
  viewedAt: string;
}
