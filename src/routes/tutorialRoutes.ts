import { Router } from 'express';
import {
  getTutorials,
  getTutorialBySlug,
  createTutorial,
  updateTutorial,
  deleteTutorial,
  getLessonsByTutorial,
  createLesson,
  updateLesson,
  deleteLesson,
  startTutorial,
  completeLesson,
  getTutorialProgress
} from '../controllers/tutorialController.js';
import { requireAuth, requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();

// Public routes
router.get('/', getTutorials);
router.get('/:slug', getTutorialBySlug);

// Tutorial lessons (public)
router.get('/:tutorialId/lessons', getLessonsByTutorial);

// Authenticated user routes
router.post('/:id/start', requireAuth, startTutorial);
router.post('/:tutorialId/lessons/:lessonId/complete', requireAuth, completeLesson);
router.get('/:id/progress', requireAuth, getTutorialProgress);

// Admin-only routes
router.post('/', requireAuth, requireAdmin, createTutorial);
router.patch('/:id', requireAuth, requireAdmin, updateTutorial);
router.delete('/:id', requireAuth, requireAdmin, deleteTutorial);

// Admin lesson routes
router.post('/:tutorialId/lessons', requireAuth, requireAdmin, createLesson);

export default router;
