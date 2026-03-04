import express from 'express';
import {
  getNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllNotifications
} from '../controllers/notificationController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

/**
 * ===================================
 * NOTIFICATION ROUTES
 * ===================================
 */

// Get user's notifications (GET /api/notifications)
router.get('/', authenticate, getNotifications);

// Get unread notification count (GET /api/notifications/count)
router.get('/count', authenticate, getUnreadCount);

// Mark notification as read (PUT /api/notifications/:notificationId/read)
router.put('/:notificationId/read', authenticate, markNotificationAsRead);

// Mark all notifications as read (PUT /api/notifications/mark-all-read)
router.put('/mark-all-read', authenticate, markAllNotificationsAsRead);

// Delete notification (DELETE /api/notifications/:notificationId)
router.delete('/:notificationId', authenticate, deleteNotification);

// Delete all notifications (DELETE /api/notifications/delete-all)
router.delete('/delete-all', authenticate, deleteAllNotifications);

export default router;
