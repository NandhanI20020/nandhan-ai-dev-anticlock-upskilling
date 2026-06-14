export interface Person {
  id: string;
  name: string;
  email: string;
  phone: string;
  jobTitle: string;
  orgId: string | null;
  ownerId: string;
  labelIds: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface PersonListItem extends Person {
  orgName: string | null;
  dealCount: number;
  lastActionDate: string | null;
  lastActionStatus: 'active' | 'overdue' | 'new' | null;
  ownerName: string;
  ownerInitials: string;
  ownerColor: string;
}

export interface PaginatedPeopleResponse {
  people: PersonListItem[];
  total: number;
  page: number;
  perPage: number;
}

export interface PersonDetail extends PersonListItem {
  activeDeals: ActivePersonDeal[];
}

export interface ActivePersonDeal {
  id: string;
  title: string;
  value: number;
  currency: string;
  stageName: string;
  nextActivityDate: string | null;
  nextActivityType: string | null;
}
