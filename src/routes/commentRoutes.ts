import { Router } from 'express';
import {
  updateComment,
  deleteComment,
  likeComment,
  unlikeComment
} from '../controllers/commentController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

// All comment modifying routes require authentication
router.patch('/:id', requireAuth, updateComment);
router.delete('/:id', requireAuth, deleteComment);
router.post('/:id/like', requireAuth, likeComment);
router.delete('/:id/like', requireAuth, unlikeComment);

export default router;
