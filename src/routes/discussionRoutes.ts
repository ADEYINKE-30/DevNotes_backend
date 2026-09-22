import { Router } from 'express';
import {
  getDiscussions,
  getDiscussion,
  createDiscussion,
  updateDiscussion,
  deleteDiscussion,
  lockDiscussion,
  likeDiscussion,
  unlikeDiscussion
} from '../controllers/discussionController.js';
import {
  getComments,
  createComment
} from '../controllers/commentController.js';
import { requireAuth, requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();

// Public routes (matching application designs)
router.get('/', getDiscussions);
router.get('/:id', getDiscussion);
router.get('/:discussionId/comments', getComments);

// Authenticated routes
router.post('/', requireAuth, createDiscussion);
router.patch('/:id', requireAuth, updateDiscussion);
router.delete('/:id', requireAuth, deleteDiscussion);
router.post('/:id/like', requireAuth, likeDiscussion);
router.delete('/:id/like', requireAuth, unlikeDiscussion);
router.post('/:discussionId/comments', requireAuth, createComment);

// Admin only routes
router.patch('/:id/lock', requireAuth, requireAdmin, lockDiscussion);

export default router;
