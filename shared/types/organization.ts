export interface Organization {
  id: string;
  name: string;
  address: string;
  phone: string;
  website: string;
  ownerId: string;
  labels: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface OrgListItem extends Organization {
  peopleCount: number;
  personAvatars: { initials: string; color: string }[];
  openDealCount: number;
  wonDealCount: number;
  lostDealCount: number;
  lastActivityDate: string | null;
  ownerName: string;
  ownerInitials: string;
  ownerColor: string;
}

export interface OrgDetail extends OrgListItem {
  people: { id: string; name: string; jobTitle: string; email: string; initials: string; color: string }[];
  activeDeals: { id: string; title: string; value: number; currency: string; stageName: string }[];
}
