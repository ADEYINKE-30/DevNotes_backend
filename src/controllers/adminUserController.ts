import type { NextFunction, Request, Response } from 'express';
import { getAdminUsersService } from '../services/adminUserService.js';

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
