import { Router } from 'express';
import {
  chat,
  getConversations,
  getConversation,
  deleteConversation,
  getRecommendations,
  explain,
  hint,
  summarize
} from '../controllers/aiController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

// All AI routes require authentication
router.post('/chat', requireAuth, chat);
router.post('/explain', requireAuth, explain);
router.post('/hint', requireAuth, hint);
router.post('/summarize', requireAuth, summarize);
router.get('/conversations', requireAuth, getConversations);
router.get('/conversations/:id', requireAuth, getConversation);
router.delete('/conversations/:id', requireAuth, deleteConversation);
router.get('/recommendations', requireAuth, getRecommendations);

export default router;
