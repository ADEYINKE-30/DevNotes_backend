import { Router } from 'express';
import {
  getSubscribers,
  deleteSubscriber,
  createAnnouncement
} from '../controllers/newsletterController.js';
import { getAIUsageStats } from '../controllers/adminAIController.js';
import { getReports, updateReport } from '../controllers/reportController.js';
import { getUsers, updateUser, updateUserStatus } from '../controllers/adminUserController.js';
import { requireAuth, requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();

// All admin routes require authentication and admin role
router.get('/newsletter/subscribers', requireAuth, requireAdmin, getSubscribers);
router.delete('/newsletter/subscribers/:id', requireAuth, requireAdmin, deleteSubscriber);
router.post('/notifications/announcement', requireAuth, requireAdmin, createAnnouncement);
router.get('/ai/usage', requireAuth, requireAdmin, getAIUsageStats);

// Admin content moderation reports
router.get('/reports', requireAuth, requireAdmin, getReports);
router.patch('/reports/:id', requireAuth, requireAdmin, updateReport);
router.get('/users', requireAuth, requireAdmin, getUsers);
router.put('/users/:id', requireAuth, requireAdmin, updateUser);
router.patch('/users/:id', requireAuth, requireAdmin, updateUserStatus);

export default router;
