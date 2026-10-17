import User from '../models/User.js';
import type { UserDocument } from '../types/auth.js';

export interface GetAdminUsersOptions {
  page: number;
  limit: number;
  search?: string;
}

export interface AdminUsersResult {
  users: UserDocument[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const escapeRegex = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const getAdminUsersService = async ({
  page,
  limit,
  search
}: GetAdminUsersOptions): Promise<AdminUsersResult> => {
  const filter = search?.trim()
    ? {
        $or: [
          { name: { $regex: escapeRegex(search.trim()), $options: 'i' } },
          { email: { $regex: escapeRegex(search.trim()), $options: 'i' } }
        ]
      }
    : {};
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    User.countDocuments(filter)
  ]);

  return {
    users: users.map((user) => ({
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    })),
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};
