import { NotificationApiResponse, NotificationRecord, NotificationType } from '../types';

const defaultBaseUrl = 'http://20.207.122.201/evaluation-service/notifications';
const apiBaseUrl = import.meta.env.VITE_NOTIFICATION_API_BASE || defaultBaseUrl;
const apiToken = import.meta.env.VITE_NOTIFICATION_API_TOKEN;

interface FetchParams {
  page: number;
  limit: number;
  notificationType?: NotificationType | 'All';
  signal?: AbortSignal;
}

function buildUrl(params: FetchParams): string {
  const url = new URL(apiBaseUrl);
  url.searchParams.set('page', String(params.page));
  url.searchParams.set('limit', String(params.limit));

  if (params.notificationType && params.notificationType !== 'All') {
    url.searchParams.set('notification_type', params.notificationType);
  }

  return url.toString();
}

export async function fetchNotificationPage(params: FetchParams): Promise<NotificationRecord[]> {
  const response = await fetch(buildUrl(params), {
    signal: params.signal,
    headers: {
      ...(apiToken ? { Authorization: `Bearer ${apiToken}` } : {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to load notifications (${response.status})`);
  }

  const payload = (await response.json()) as NotificationApiResponse | NotificationRecord[];

  if (Array.isArray(payload)) {
    return payload;
  }

  return Array.isArray(payload.notifications) ? payload.notifications : [];
}

export async function fetchAllNotifications(notificationType?: NotificationType | 'All'): Promise<NotificationRecord[]> {
  const batchSize = 100;
  const allRows: NotificationRecord[] = [];

  for (let page = 1; page <= 20; page += 1) {
    const chunk = await fetchNotificationPage({ page, limit: batchSize, notificationType });
    allRows.push(...chunk);

    if (chunk.length < batchSize) {
      break;
    }
  }

  return allRows;
}
