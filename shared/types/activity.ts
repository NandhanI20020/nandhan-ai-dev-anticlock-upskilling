export type ActivityType = 'call' | 'meeting' | 'task' | 'email' | 'deadline';

export interface Activity {
  id: string;
  type: ActivityType;
  subject: string;
  dueDate: string | null;
  dueTime: string | null;
  dealId: string | null;
  personId: string | null;
  orgId: string | null;
  ownerId: string;
  done: boolean;
  doneAt: string | null;
  note: string;
  outcome: string;
  createdAt: string;
}
