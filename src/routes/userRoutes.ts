import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  changePassword
} from '../controllers/authController.js';
import { getUserLearning } from '../controllers/tutorialController.js';
import { getUserQuizzes } from '../controllers/quizController.js';
import {
  getNotificationPreferences,
  updateNotificationPreferences
} from '../controllers/newsletterController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

// All user routes require authentication
router.get('/me', requireAuth, getProfile);
router.get('/me/learning', requireAuth, getUserLearning);
router.get('/me/quizzes', requireAuth, getUserQuizzes);
router.get('/me/notification-preferences', requireAuth, getNotificationPreferences);
router.patch('/me', requireAuth, updateProfile);
router.patch('/me/password', requireAuth, changePassword);
router.patch('/me/notification-preferences', requireAuth, updateNotificationPreferences);

export default router;
