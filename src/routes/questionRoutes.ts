import { Router } from 'express';
import { updateQuestion, deleteQuestion } from '../controllers/quizController.js';
import { requireAuth, requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();

// Admin-only routes for questions
router.patch('/:id', requireAuth, requireAdmin, updateQuestion);
router.delete('/:id', requireAuth, requireAdmin, deleteQuestion);

export default router;
