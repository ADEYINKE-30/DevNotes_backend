import { Router } from 'express';
import {
  subscribe,
  unsubscribe,
  getSubscriptionStatus
} from '../controllers/newsletterController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

// Public routes
router.post('/subscribe', subscribe);
router.post('/unsubscribe', unsubscribe);

// Authenticated routes
router.get('/status', requireAuth, getSubscriptionStatus);

export default router;
