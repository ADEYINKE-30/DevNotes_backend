import { Router } from 'express';
import { updateLesson, deleteLesson } from '../controllers/tutorialController.js';
import { requireAuth, requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();

// Admin-only routes for lessons
router.patch('/:id', requireAuth, requireAdmin, updateLesson);
router.delete('/:id', requireAuth, requireAdmin, deleteLesson);

export default router;
