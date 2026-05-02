/**
 * Notifications Routes
 * 
 * Endpoints for retrieving and managing notifications
 */

import { Router, Request, Response, NextFunction } from 'express';
import { MOCK_NOTIFICATIONS } from '../data/mock';
import { NotificationQueryParams, PaginatedResponse, NotificationRecord } from '../types';
import { APIError } from '../middleware/errorHandler';

const router = Router();

/**
 * GET /notifications
 * 
 * Retrieve paginated notifications with optional filtering
 * 
 * Query Parameters:
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 10)
 * - notification_type: Filter by type (Placement, Result, Event, All)
 */
router.get(
  '/',
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      const params: NotificationQueryParams = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        notification_type: (req.query.notification_type as string) || 'All',
      };

      // Validation
      if (params.page! < 1) {
        throw new APIError(400, 'Page must be >= 1', 'Bad Request');
      }
      if (params.limit! < 1 || params.limit! > 100) {
        throw new APIError(400, 'Limit must be between 1 and 100', 'Bad Request');
      }

      // Filter notifications
      let filtered = MOCK_NOTIFICATIONS;
      if (params.notification_type !== 'All') {
        filtered = filtered.filter((n) => n.Type === params.notification_type);
      }

      // Sort by timestamp (newest first)
      const sorted = filtered.sort(
        (a, b) => new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime(),
      );

      // Paginate
      const startIndex = (params.page! - 1) * params.limit!;
      const endIndex = startIndex + params.limit!;
      const paginated = sorted.slice(startIndex, endIndex);

      const response: PaginatedResponse<NotificationRecord> = {
        notifications: paginated,
        page: params.page!,
        limit: params.limit!,
        total: sorted.length,
        hasMore: endIndex < sorted.length,
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  },
);

/**
 * GET /notifications/:id
 * 
 * Retrieve a specific notification by ID
 */
router.get(
  '/:id',
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      const { id } = req.params;
      const notification = MOCK_NOTIFICATIONS.find((n) => n.ID === id);

      if (!notification) {
        throw new APIError(404, `Notification with ID ${id} not found`, 'Not Found');
      }

      res.json(notification);
    } catch (error) {
      next(error);
    }
  },
);

/**
 * GET /notifications/type/:type
 * 
 * Retrieve all notifications of a specific type
 */
router.get(
  '/type/:type',
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      const { type } = req.params;
      const validTypes = ['Placement', 'Result', 'Event'];

      if (!validTypes.includes(type)) {
        throw new APIError(
          400,
          `Invalid type. Must be one of: ${validTypes.join(', ')}`,
          'Bad Request',
        );
      }

      const notifications = MOCK_NOTIFICATIONS.filter((n) => n.Type === type);

      res.json({
        data: notifications,
        type,
        count: notifications.length,
      });
    } catch (error) {
      next(error);
    }
  },
);

/**
 * Health check endpoint
 */
router.get('/health/ping', (req: Request, res: Response): void => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

export default router;
