import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(80).optional(),
  avatar: z.string().url().optional().or(z.literal('')),
  bio: z.string().trim().max(500, 'Bio cannot exceed 500 characters').optional()
});
