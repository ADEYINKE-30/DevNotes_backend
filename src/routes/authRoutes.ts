import { Router } from 'express';
import {
  register,
  login,
  logout,
  me,
  getProfile,
  updateProfile,
  changePassword
} from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.post('/logout', requireAuth, logout);
router.get('/me', requireAuth, me);
router.get('/profile', requireAuth, getProfile);
router.patch('/profile', requireAuth, updateProfile);
router.patch('/password', requireAuth, changePassword);

export default router;
