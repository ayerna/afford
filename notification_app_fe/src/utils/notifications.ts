import { NotificationRecord, NotificationType, PriorityNotification, SortableNotification } from '../types';

const priorityWeights: Record<NotificationType, number> = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

export function rankNotificationType(type: NotificationType): number {
  return priorityWeights[type] ?? 0;
}

export function parseNotificationTime(timestamp: string): number {
  const normalized = timestamp.includes('T') ? timestamp : timestamp.replace(' ', 'T');
  const parsed = new Date(normalized).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
}

export function compareNotifications(left: SortableNotification, right: SortableNotification): number {
  if (left.rank !== right.rank) {
    return right.rank - left.rank;
  }

  if (left.timeValue !== right.timeValue) {
    return right.timeValue - left.timeValue;
  }

  return left.ID.localeCompare(right.ID);
}

export function decorateNotifications(items: NotificationRecord[], viewedIds: Set<string>): SortableNotification[] {
  return items.map((item) => ({
    ...item,
    rank: rankNotificationType(item.Type),
    timeValue: parseNotificationTime(item.Timestamp),
    viewed: viewedIds.has(item.ID),
  }));
}

export function sortNotifications(items: SortableNotification[]): SortableNotification[] {
  return [...items].sort(compareNotifications);
}

export function sliceTopNotifications(items: SortableNotification[], topCount: number): PriorityNotification[] {
  return sortNotifications(items)
    .slice(0, topCount)
    .map((item) => ({
      ID: item.ID,
      Type: item.Type,
      Message: item.Message,
      Timestamp: item.Timestamp,
      rank: item.rank,
      viewed: item.viewed,
    }));
}

export function prettyTimestamp(timestamp: string): string {
  const readable = new Date(timestamp.includes('T') ? timestamp : timestamp.replace(' ', 'T'));
  if (Number.isNaN(readable.getTime())) {
    return timestamp;
  }

  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(readable);
}

export function typeAccent(type: NotificationType): string {
  switch (type) {
    case 'Placement':
      return '#0f766e';
    case 'Result':
      return '#b45309';
    case 'Event':
      return '#1d4ed8';
    default:
      return '#4b5563';
  }
}

export function typeTone(type: NotificationType): 'success' | 'warning' | 'info' {
  switch (type) {
    case 'Placement':
      return 'success';
    case 'Result':
      return 'warning';
    case 'Event':
    default:
      return 'info';
  }
}
