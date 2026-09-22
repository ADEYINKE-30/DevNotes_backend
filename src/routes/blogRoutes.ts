import { Router } from 'express';
import { createPost, deletePost, getPostBySlug, getPosts, updatePost } from '../controllers/blogController.js';
import { requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();

// Public routes
router.get('/', getPosts);
router.get('/:slug', getPostBySlug);

// Admin-only routes
router.post('/', requireAdmin, createPost);
router.put('/:id', requireAdmin, updatePost);
router.delete('/:id', requireAdmin, deletePost);

export default router;
