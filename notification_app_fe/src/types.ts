export type NotificationType = 'Placement' | 'Result' | 'Event';

export type FilterChoice = 'All' | NotificationType;
export type ViewMode = 'all' | 'priority';

export interface NotificationRecord {
  ID: string;
  Type: NotificationType;
  Message: string;
  Timestamp: string;
}

export interface NotificationApiResponse {
  notifications?: NotificationRecord[];
}

export interface PriorityNotification extends NotificationRecord {
  rank: number;
  viewed: boolean;
}

export interface SortableNotification extends NotificationRecord {
  rank: number;
  timeValue: number;
  viewed: boolean;
}
