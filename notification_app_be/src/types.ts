/**
 * Backend Type Definitions
 * 
 * Shared types for the notifications API service
 */

/**
 * Notification types (priority order)
 */
export type NotificationType = 'Placement' | 'Result' | 'Event';

/**
 * Notification record from API
 */
export interface NotificationRecord {
  ID: string;
  Type: NotificationType;
  Message: string;
  Timestamp: string;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

/**
 * Error response
 */
export interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
  timestamp: string;
}

/**
 * API request query parameters
 */
export interface NotificationQueryParams {
  page?: number;
  limit?: number;
  notification_type?: NotificationType | 'All';
}

/**
 * Authentication token payload
 */
export interface TokenPayload {
  sub: string;
  iat: number;
  exp: number;
  role?: string;
}

/**
 * Mock notification database
 */
export interface NotificationStore {
  [key: string]: NotificationRecord;
}
