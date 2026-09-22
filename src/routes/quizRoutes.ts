import { Router } from 'express';
import {
  getQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  getQuestionsByQuiz,
  createQuestion,
  startQuiz,
  submitQuiz,
  getQuizResults
} from '../controllers/quizController.js';
import { requireAuth, requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();

// Public routes
router.get('/', getQuizzes);
router.get('/:id', getQuizById);
router.get('/:quizId/questions', getQuestionsByQuiz);

// Authenticated user routes
router.post('/:id/start', requireAuth, startQuiz);
router.post('/:id/submit', requireAuth, submitQuiz);
router.get('/:id/results', requireAuth, getQuizResults);

// Admin-only routes
router.post('/', requireAuth, requireAdmin, createQuiz);
router.patch('/:id', requireAuth, requireAdmin, updateQuiz);
router.delete('/:id', requireAuth, requireAdmin, deleteQuiz);

// Admin question routes
router.post('/:quizId/questions', requireAuth, requireAdmin, createQuestion);

export default router;
