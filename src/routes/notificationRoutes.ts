import { Router } from 'express';
import {
  getUserNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  getUnreadCount
} from '../controllers/newsletterController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

// All notification routes require authentication
router.get('/', requireAuth, getUserNotifications);
router.get('/unread-count', requireAuth, getUnreadCount);
router.patch('/read-all', requireAuth, markAllNotificationsRead);
router.patch('/:id/read', requireAuth, markNotificationRead);
router.delete('/:id', requireAuth, deleteNotification);

export default router;
