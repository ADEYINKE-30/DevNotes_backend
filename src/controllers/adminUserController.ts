import type { NextFunction, Request, Response } from 'express';
import User from '../models/User.js';
import { getAdminUsersService } from '../services/adminUserService.js';

const publicUser = (user: Record<string, unknown>) => {
  const { password: _password, ...safeUser } = user;
  return safeUser;
};

export const getAdminUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const requestedPage = Number(req.query.page ?? 1);
    const requestedLimit = Number(req.query.limit ?? 20);
    const page = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
    const limit =
      Number.isInteger(requestedLimit) && requestedLimit > 0
        ? Math.min(requestedLimit, 100)
        : 20;
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;

    const result = await getAdminUsersService({ page, limit, search });

    res.status(200).json({
      success: true,
      data: result.users,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, role } = req.body as {
      name?: unknown;
      email?: unknown;
      role?: unknown;
    };

    if (typeof name !== 'string' || !name.trim() || typeof email !== 'string' || !email.trim()) {
      res.status(400).json({ success: false, message: 'Name and email are required' });
      return;
    }
    if (role !== 'user' && role !== 'admin') {
      res.status(400).json({ success: false, message: 'Role must be user or admin' });
      return;
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name: name.trim(), email: email.trim().toLowerCase(), role },
      { new: true, runValidators: true }
    ).select('-password').lean();

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }
    res.status(200).json({ success: true, data: publicUser(user) });
  } catch (error) {
    next(error);
  }
};

export const updateUserStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status } = req.body as { status?: unknown };
    if (status !== 'active' && status !== 'suspended') {
      res.status(400).json({ success: false, message: 'Status must be active or suspended' });
      return;
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).select('-password').lean();

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }
    res.status(200).json({ success: true, data: publicUser(user) });
  } catch (error) {
    next(error);
  }
};
